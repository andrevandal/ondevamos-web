/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
import 'dotenv/config'

import * as fs from 'fs'
import * as path from 'path'
import * as fastq from 'fastq'

import slugify from 'slugify'

import { parse } from 'csv-parse'
import { consola } from 'consola'
import { omit, pick, shake } from 'radash'
import { eq } from 'drizzle-orm'

import type { queueAsPromised } from 'fastq'

import {
  type Action,
  type CreatePlace,
  type UpdatePlace,
} from '../schemas/endpoints/places'
import { places as PlacesTable } from '../schemas/db/places'
import { db } from '../services/database'
import { generateUuid } from '../services/nanoid'
import { camelize, transformPeriods } from './helpers'
import { defaultCities } from './defaults'
import { MockedPlaces } from './mocks'
import type { Place, Row, TaskData, EnhancedPlace } from './types'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

const logger = consola.withTag('utils:processPlacesCsv')

const findCity = (cityName: string) =>
  defaultCities.find((city) => city.name === cityName)

const queue: queueAsPromised<TaskData> = fastq.promise(asyncWorker, 1)

async function asyncWorker(data: TaskData): Promise<void> {
  const localLogger = logger.withTag('[Worker]')
  localLogger.info('Processing place...', data.name, data.placeId)
  const enhancedPlace = await enhancePlace(data)
  localLogger.info('Creating place...')

  const place = await createOrUpdatePlace(enhancedPlace)

  localLogger.success('Place created', place)
}

async function createOrUpdatePlace(place: EnhancedPlace) {
  const localLogger = logger.withTag('[Create or Update Place]')
  const existPlace = await findPlaceByExternalId(place.externalId)

  async function createPlace(data: CreatePlace) {
    const localLogger = logger.withTag('[Create Place]')
    localLogger.info('Creating place', place.name)

    const url = new URL('places', 'http://localhost:3000/api/v1/').toString()
    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(data as CreatePlace),
      })

      localLogger.log(JSON.stringify(result, null, 2))

      if (!result.ok) {
        localLogger.error('Error on create place', await result.json())
        return null
      }

      return result.json()
    } catch (error) {
      localLogger.error(error)
    }
  }

  async function updatePlace(uuid: string, data: UpdatePlace) {
    const localLogger = logger.withTag('[Update Place]')
    localLogger.info('Updating place', place.name)

    const url = new URL(
      `places/${uuid}`,
      'http://localhost:3000/api/v1/',
    ).toString()

    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(data as UpdatePlace),
    })

    if (!result.ok) {
      localLogger.error('Error on update place', result)
      return null
    }

    return result.json()
  }

  async function updateOpeningHours(
    identifier: string,
    openingHours: EnhancedPlace['openingHours'],
  ) {
    const localLogger = logger.withTag('[Update Place Opening Hours]')
    localLogger.info(
      'Updating place',
      place.name,
      JSON.stringify(openingHours, null, 2),
    )

    const url = new URL(
      `places/${identifier}/opening-hours`,
      'http://localhost:3000/api/v1/',
    ).toString()

    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(openingHours),
    })

    if (!result.ok) {
      const { data } = await result.json()
      localLogger.error(
        'Error on update place opening hours',
        openingHours,
        data,
      )
      return null
    }

    return result.json()
  }

  if (existPlace) {
    localLogger.info('Place already exist', place.name)
    await updatePlace(existPlace.uuid, {
      ratingLevel: place.ratingLevel,
      ratingCount: place.ratingCount,
      pricingLevel: place.pricingLevel,
      // pricingCount: place.pricingCount,
      tags: place.tags,
      categories: place.categories,
    })

    await updateOpeningHours(existPlace.uuid, place.openingHours)

    return existPlace
  }

  const createdPlace = await createPlace(place)

  localLogger.success('Place created', createdPlace)

  await updateOpeningHours(createdPlace.uuid, place.openingHours)
  await updatePlace(createdPlace.uuid, {
    tags: place.tags,
    categories: place.categories,
  })

  return createdPlace
}

async function findPlaceByExternalId(externalId?: string) {
  const localLogger = logger.withTag('[Find Place By External Id]')
  localLogger.info('Searching place by external id', externalId)

  if (!externalId) {
    localLogger.warn('External id not provided')
    return null
  }

  const [place] = await db
    .select({
      uuid: PlacesTable.uuid,
      externalId: PlacesTable.externalId,
      name: PlacesTable.name,
      slug: PlacesTable.slug,
    })
    .from(PlacesTable)
    .where(eq(PlacesTable.externalId, externalId))
    .limit(1)

  if (!place) {
    localLogger.warn('Place not found', externalId)
    return null
  }

  return place
}

async function enhancePlace(place: TaskData) {
  const localLogger = logger.withTag('[Enhance Place]')
  const fromGoogle = await findPlaceOnGoogle(place.placeId)

  localLogger.info(`Enhancing place ${place.name}`)

  const name = place.name ?? fromGoogle?.name
  const city = findCity('Guarulhos')?.uuid

  function getAddressComponents(addressComponents: any) {
    let addressStreet: string | undefined
    let addressNumber: string | undefined
    let addressComplement: string | undefined
    let addressNeighborhood: string | undefined
    let addressZipCode: string | undefined

    for (const component of addressComponents) {
      if (component.types.includes('route')) {
        addressStreet = component.long_name
      } else if (component.types.includes('street_number')) {
        addressNumber = component.long_name
      } else if (component.types.includes('sublocality_level_1')) {
        addressNeighborhood = component.long_name
      } else if (component.types.includes('postal_code')) {
        addressZipCode = component.long_name
      }
    }

    return {
      addressStreet,
      addressNumber,
      addressComplement,
      addressNeighborhood,
      addressZipCode,
    }
  }

  const actions = Object.entries({
    ...(place.whatsapp && { whatsapp: place.whatsapp }),
    ...(place.instagram && { instagram: place.instagram }),
    ...(fromGoogle?.url && { maps: fromGoogle?.url }),
  }).reduce((acc, [key, value]) => {
    switch (key) {
      case 'whatsapp':
        acc.push({
          type: 'social',
          name: 'WhatsApp',
          iconName: 'whatsapp',
          link: `https://wa.me/${value}`,
        })
        break
      case 'instagram':
        acc.push({
          type: 'social',
          name: 'Instagram',
          iconName: 'instagram',
          link: `https://instagram.com/${value}`,
        })
        break
      case 'maps':
        acc.push({
          type: 'maps',
          name: 'Google Maps',
          iconName: 'google',
          link: value,
        })
        break
    }
    return acc
  }, [] as Action[])

  const openingHours = transformPeriods(
    fromGoogle?.opening_hours?.periods ?? [],
  )

  const {
    addressStreet,
    addressNumber,
    addressComplement,
    addressNeighborhood,
    addressZipCode,
  } = getAddressComponents(fromGoogle?.address_components ?? [])

  function mapTags(ops: Record<string, any>) {
    const options = shake(ops, (a) => !a)

    const adaptedTags = {
      delivery: 'entrega',
      dine_in: 'local',
      serves_beer: 'cerveja',
      serves_vegetarian_food: 'vegetariano',
      serves_breakfast: 'cafe-da-manha',
      serves_brunch: 'brunch',
      serves_dinner: 'jantar',
      serves_lunch: 'almoco',
      serves_wine: 'vinho',
      takeout: 'para-levar',
    }

    const tags = Object.entries(options).reduce((acc, [key, value]) => {
      if (value) {
        acc.push(adaptedTags[key as keyof typeof adaptedTags] as string)
      }
      return acc
    }, [] as string[])

    return tags
  }

  const tags = mapTags({
    ...pick({ ...fromGoogle }, [
      'delivery',
      'dine_in',
      'serves_beer',
      'serves_vegetarian_food',
      'serves_breakfast',
      'serves_brunch',
      'serves_dinner',
      'serves_lunch',
      'serves_wine',
      'takeout',
    ]),
  })

  const categories = place.categories

  const formatedPlace = {
    name,
    actions,
    city,
    description: fromGoogle?.name,
    slug: slugify(name, { lower: true }),
    ratingLevel: fromGoogle?.rating,
    ratingCount: fromGoogle?.user_ratings_total,
    pricingLevel: fromGoogle?.price_level,
    pricingCount: 0,
    externalId: place.placeId,
    active: false,
    addressStreet,
    addressNumber,
    addressComplement,
    addressNeighborhood,
    addressZipCode,
    addressLongitude: fromGoogle?.geometry.location.lng,
    addressLatitude: fromGoogle?.geometry.location.lat,
    openingHours,
    tags,
    categories,
  } as EnhancedPlace

  localLogger.debug(formatedPlace)
  localLogger.success('Place enhanced', pick(formatedPlace, ['name', 'slug']))

  return formatedPlace
}

async function findPlaceOnGoogle(placeId: string) {
  const localLogger = logger.withTag('[Google Places]')
  localLogger.info('Searching place on Google Places API', placeId)

  if (MockedPlaces[placeId]) {
    return MockedPlaces[placeId] as Place
  }

  const url = `https://maps.googleapis.com/maps/api`
  const token = process.env.VITE_GOOGLE_PLACES_API_KEY

  const fields = [
    'address_components',
    'geometry',
    'name',
    'type',
    'url',
    'opening_hours',
    'delivery',
    'dine_in',
    'price_level',
    'rating',
    'serves_vegetarian_food',
    'serves_lunch',
    'serves_dinner',
    'serves_brunch',
    'serves_breakfast',
    'serves_beer',
    'serves_wine',
    'takeout',
    'user_ratings_total',
  ].join(',')

  const response = await fetch(
    `${url}/place/details/json?place_id=${placeId}&key=${token}&language=pt-BR&fields=${fields}`,
  )

  if (!response.ok) {
    logger.error(`Error on ${placeId}`, response)
  }

  const { result } = (await response.json()) as { result: Place }

  return result
}

function processPlacesCsv(filepath: string) {
  const localLogger = logger.withTag('[CSV Parser]')
  localLogger.info('Processing places CSV from ', filepath)

  const onError = (error: unknown) => {
    localLogger.error(error)
  }

  const onData = (row: Row) => {
    const rawData = pick(
      camelize({
        el: row,
        replacements: {
          googlePlaceId: 'placeId',
          categoriasForDb: 'categories',
          nome: 'name',
          ativa: 'active',
          cadastrada: 'registered',
        },
      }),
      [
        'placeId',
        'name',
        'categories',
        'whatsapp',
        'instagram',
        'active',
        'registered',
      ],
    ) as {
      placeId: string
      name: string
      categories: string | string[]
      whatsapp: string
      instagram: string
      active: string
      registered: string
    }

    const data = {
      ...rawData,
      categories: !Array.isArray(rawData.categories)
        ? rawData.categories
            .split(',')
            .map((category: string) => category.trim())
        : rawData.categories,
      active: rawData.active === 'TRUE',
      registered: rawData.registered === 'TRUE',
    } as TaskData

    queue.push(data)
  }

  const onEnd = () => {
    localLogger.success(`Parsed done.`)
  }

  const parser = parse({ delimiter: ',', columns: true })

  parser.on('readable', function () {
    let record
    while ((record = parser.read()) !== null) {
      const placeId = record['GOOGLE PLACE ID']
      if (!placeId) continue

      onData(record)
    }
  })

  parser.on('error', onError)
  parser.on('end', onEnd)

  fs.createReadStream(filepath).pipe(parser)
}

const file = path.resolve(path.resolve(), 'bucket', '0001-places.csv')

processPlacesCsv(file)
