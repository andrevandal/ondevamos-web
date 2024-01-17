import 'dotenv/config'

import * as fs from 'fs'
import * as path from 'path'
import * as fastq from 'fastq'

import slugify from 'slugify'

import { parse } from 'csv-parse'
import { consola } from 'consola'
import { pick, shake } from 'radash'

import type { queueAsPromised } from 'fastq'

import { type Action } from './schemas'

import { camelize, transformPeriods } from './helpers'
import { defaultCities } from './defaults'
import { MockedPlaces } from './mocks'
import type { Place, Row, TaskData, EnhancedPlace } from './types'
import {
  createPlace,
  updatePlace,
  findPlaceByExternalId,
  updateOpeningHours,
} from './repositories'

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

  if (!place) {
    localLogger.error('Error on create or update place', place)
    return
  }

  localLogger.success('Place created', place)
}

async function createOrUpdatePlace(place: EnhancedPlace) {
  const localLogger = logger.withTag('[Create or Update Place]')
  const existPlace = await findPlaceByExternalId(place.externalId)

  if (existPlace?.uuid) {
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

  if (!createdPlace) {
    localLogger.error('Error on create place', place)
    return null
  }

  await updateOpeningHours(createdPlace.uuid, place.openingHours)
  await updatePlace(createdPlace.uuid, {
    tags: place.tags,
    categories: place.categories,
  })

  return createdPlace
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
