import { it, expect, vi, describe, afterEach } from 'vitest'

import { createPlace, getRawPlace, getPlaceId, getPlace } from './places'

import { db } from '../services/database'
import { generateUuid } from '../services/nanoid'

const CURRENT_CITY = {
  id: 1,
  uuid: '631MoVdwcatv',
  name: 'Guarulhos',
  state: 'SP',
  ibgeCode: '3518800',
  country: 'BR',
  label: 'guarulhos',
}

const SelectMocked = vi.mocked(db.select)
const InsertMocked = vi.mocked(db.insert)
const GeneratedUuidMocked = vi.mocked(generateUuid)

vi.mock('../services/database', () => {
  const db = {
    select: vi.fn(),
    insert: vi.fn(),
  }
  return { db }
})
vi.mock('../services/nanoid', () => {
  const generateUuid = vi.fn().mockReturnValue('uuid')
  return { generateUuid }
})

describe('createPlace', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create a place', async () => {
    const newPlace = {
      name: 'Hamburgeria do Seu Zé',
      slug: 'hamburgeria-do-seu-ze2',
      description: 'O melhor hamburguer da cidade',
      ratingLevel: 5,
      ratingCount: 100,
      pricingLevel: 3,
      pricingCount: 100,
      active: true,
      externalId: 'W67inS8LqrDkw',
      avatar: 'ZKvlJ0Kvit2N',
      cover: 'TkFEAWG1BtYS',
      city: 'vU2TFimVUMa5',
      addressStreet: 'Rua dos Bobos',
      addressNumber: '0',
      addressComplement: 'Apto 1',
      addressNeighborhood: 'Centro',
      addressZipCode: '00000-000',
      addressLongitude: -46.633309,
      addressLatitude: -23.550519,
    }

    SelectMocked.mockImplementationOnce(
      () =>
        ({
          from: vi.fn().mockImplementationOnce(() => ({
            where: vi.fn().mockImplementationOnce(() => [CURRENT_CITY]),
          })),
        }) as any,
    )
    SelectMocked.mockImplementationOnce(
      () =>
        ({
          from: vi.fn().mockImplementationOnce(() => ({
            where: vi.fn().mockImplementationOnce(() => ({
              leftJoin: vi.fn().mockImplementationOnce(() => ({
                groupBy: vi.fn().mockImplementationOnce(() => [newPlace]),
              })),
            })),
          })),
        }) as any,
    )
    InsertMocked.mockImplementationOnce(
      () =>
        ({
          values: InsertedValues,
        }) as any,
    )
    GeneratedUuidMocked.mockReturnValueOnce('uuid')

    const InsertedValues = vi.fn().mockResolvedValueOnce({
      insertId: 1,
      ...newPlace,
    })

    await createPlace(newPlace)

    expect(InsertedValues).toHaveBeenCalledWith({
      active: true,
      address: {
        complement: 'Apto 1',
        latitude: -23.550519,
        longitude: -46.633309,
        neighborhood: 'Centro',
        number: '0',
        street: 'Rua dos Bobos',
        zipCode: '00000-000',
      },
      avatarMedia: 'ZKvlJ0Kvit2N',
      city: 1,
      coverMedia: 'TkFEAWG1BtYS',
      description: 'O melhor hamburguer da cidade',
      externalId: 'W67inS8LqrDkw',
      featuredMedias: undefined,
      name: 'Hamburgeria do Seu Zé',
      pricingCount: 100,
      pricingLevel: 3,
      ratingCount: 100,
      ratingLevel: 5,
      slug: 'hamburgeria-do-seu-ze2',
      uuid: 'uuid',
    })
    expect(SelectMocked).toHaveBeenCalledTimes(2)
  })
})

describe('getRawPlace', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should retrieve an raw place', async () => {
    const place = {
      uuid: 'uuid',
      name: 'Hamburgeria do Seu Zé',
      slug: 'hamburgeria-do-seu-ze2',
      description: 'O melhor hamburguer da cidade',
      ratingLevel: 5,
      ratingCount: 100,
      pricingLevel: 3,
      pricingCount: 100,
      active: true,
      externalId: 'W67inS8LqrDkw',
      avatar: 'ZKvlJ0Kvit2N',
      cover: 'TkFEAWG1BtYS',
      city: 'vU2TFimVUMa5',
      addressStreet: 'Rua dos Bobos',
      addressNumber: '0',
      addressComplement: 'Apto 1',
      addressNeighborhood: 'Centro',
      addressZipCode: '00000-000',
      addressLongitude: -46.633309,
      addressLatitude: -23.550519,
    }

    SelectMocked.mockImplementationOnce(
      () =>
        ({
          from: vi.fn().mockImplementationOnce(() => ({
            where: vi.fn().mockImplementationOnce(() => [place]),
          })),
        }) as any,
    )

    const rawPlace = await getRawPlace({
      uuid: 'uuid',
    })

    expect(rawPlace).toBe(place)
  })
})

describe('getPlaceId', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should retrieve an place id', async () => {
    const place = {
      id: 1,
      uuid: 'uuid',
      name: 'Hamburgeria do Seu Zé',
      slug: 'hamburgeria-do-seu-ze2',
      description: 'O melhor hamburguer da cidade',
      ratingLevel: 5,
      ratingCount: 100,
      pricingLevel: 3,
      pricingCount: 100,
      active: true,
      externalId: 'W67inS8LqrDkw',
      avatar: 'ZKvlJ0Kvit2N',
      cover: 'TkFEAWG1BtYS',
      city: 'vU2TFimVUMa5',
      addressStreet: 'Rua dos Bobos',
      addressNumber: '0',
      addressComplement: 'Apto 1',
      addressNeighborhood: 'Centro',
      addressZipCode: '00000-000',
      addressLongitude: -46.633309,
      addressLatitude: -23.550519,
    }

    SelectMocked.mockImplementationOnce(
      () =>
        ({
          from: vi.fn().mockImplementationOnce(() => ({
            where: vi.fn().mockImplementationOnce(() => [place]),
          })),
        }) as any,
    )

    const rawPlace = await getPlaceId({
      uuid: 'uuid',
    })

    expect(rawPlace).toBe(1)
  })
})

describe('getPlace', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should retrieve an place', async () => {
    const place = {
      id: 1,
      uuid: 'uuid',
      name: 'Hamburgeria do Seu Zé',
      slug: 'hamburgeria-do-seu-ze2',
      description: 'O melhor hamburguer da cidade',
      ratingLevel: 5,
      ratingCount: 100,
      pricingLevel: 3,
      pricingCount: 100,
      active: true,
      externalId: 'W67inS8LqrDkw',
      avatar: 'ZKvlJ0Kvit2N',
      cover: 'TkFEAWG1BtYS',
      city: 'vU2TFimVUMa5',
      addressStreet: 'Rua dos Bobos',
      addressNumber: '0',
      addressComplement: 'Apto 1',
      addressNeighborhood: 'Centro',
      addressZipCode: '00000-000',
      addressLongitude: -46.633309,
      addressLatitude: -23.550519,
    }

    SelectMocked.mockImplementationOnce(
      () =>
        ({
          from: vi.fn().mockImplementationOnce(() => ({
            where: vi.fn().mockImplementationOnce(() => ({
              leftJoin: vi.fn().mockImplementationOnce(() => ({
                groupBy: vi.fn().mockImplementationOnce(() => [place]),
              })),
            })),
          })),
        }) as any,
    )

    const rawPlace = await getPlace({
      uuid: 'uuid',
    })

    expect(rawPlace).toBe(place)
  })
})
