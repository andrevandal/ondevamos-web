import { consola } from 'consola'
import { CreatePlace, UpdatePlace } from './schemas'
import type { EnhancedPlace } from './types'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN
const BASE_URL = process.env.BASE_URL

const logger = consola.withTag('utils:repositories')

export async function createPlace(data: CreatePlace) {
  const localLogger = logger.withTag('[Create Place]')
  localLogger.info('Creating place', data.name)

  const url = new URL('places', BASE_URL).toString()
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(data as CreatePlace),
    })

    if (!response.ok) {
      localLogger.error('Error on create place', await response.json())
      return null
    }
    const result = await response.json()
    return result
  } catch (error) {
    localLogger.error(error?.message ?? error)
    return null
  }
}

export async function updatePlace(uuid: string, data: UpdatePlace) {
  const localLogger = logger.withTag('[Update Place]')
  localLogger.info('Updating place', data.name)

  const url = new URL(`places/${uuid}`, BASE_URL).toString()

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(data as UpdatePlace),
    })

    if (!response.ok) {
      localLogger.error('Error on update place', response)
      return null
    }
    const result = await response.json()

    return result
  } catch (error) {
    localLogger.error(error?.message ?? error)
    return null
  }
}

export async function findPlaceByExternalId(externalId?: string) {
  const localLogger = logger.withTag('[Find Place By External Id]')
  localLogger.info('Searching place by external id', externalId)

  if (!externalId) {
    localLogger.warn('External id not provided')
    return null
  }

  const url = new URL(`places/${externalId}/from-external`, BASE_URL).toString()

  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    })

    localLogger.log('Result', result)

    if (!result.ok) {
      localLogger.error('Error on find place by external id', result)
      return null
    }

    const data = await result.json()
    return data
  } catch (error) {
    localLogger.error(error?.message ?? error)
    return null
  }
}

export async function updateOpeningHours(
  identifier: string,
  openingHours: EnhancedPlace['openingHours'],
) {
  const localLogger = logger.withTag('[Update Place Opening Hours]')
  localLogger.info(
    'Updating place',
    identifier,
    JSON.stringify(openingHours, null, 2),
  )

  const url = new URL(`places/${identifier}/opening-hours`, BASE_URL).toString()

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
      body: JSON.stringify(openingHours),
    })

    const result = await response.json()

    if (!response.ok) {
      const { data } = result
      localLogger.error(
        'Error on update place opening hours',
        openingHours,
        data,
      )
      return null
    }

    return result
  } catch (error) {
    localLogger.error(error?.message ?? error)
    return null
  }
}
