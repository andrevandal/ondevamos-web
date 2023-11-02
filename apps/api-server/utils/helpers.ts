import { camel } from 'radash'
import { consola } from 'consola'
import { InferSelectModel } from 'drizzle-orm'
import { openingHours as OpeningHoursTable } from '../schemas/db/openingHours'

export function parseMysqlInsertStatement(statement: string) {
  // Match field names and values using RegExp
  const fieldsMatch = statement.match(/\(`(.+?)`\)/)?.[1].split(', ')
  const valuesMatch = statement
    .match(/values ((?:\(.*?\),? ?)+)/)?.[1]
    .split(/(?<=\)),? ?/)

  return valuesMatch?.map((valueString) => {
    const values = valueString.slice(1, -1).split(', ')

    const result: { [key: string]: any } = {}
    for (let i = 0; i < fieldsMatch!.length; i++) {
      const key = String(fieldsMatch![i]).replace(/`/g, '')
      // Handle JSON content in `icon` field
      if (key === 'icon') {
        result[key] = JSON.parse(values[i].replace(/'/g, '').replace(/\\/g, ''))
      } else {
        result[key] = values[i].startsWith("'")
          ? values[i].slice(1, -1)
          : values[i]
      }
    }
    return result
  })
}

export const checkHours = (
  hours: Pick<
    InferSelectModel<typeof OpeningHoursTable>,
    | 'isClosed'
    | 'isOpen24Hours'
    | 'openTime1'
    | 'closeTime1'
    | 'openTime2'
    | 'closeTime2'
  >,
  currentTime: number,
) => {
  if (hours.isClosed) {
    return false
  } else if (hours.isOpen24Hours) {
    return true
  } else if (
    (hours.openTime1 <= currentTime && currentTime <= hours.closeTime1) ||
    (hours.openTime2 !== null &&
      hours.closeTime2 !== null &&
      hours.openTime2 <= currentTime &&
      currentTime <= hours.closeTime2)
  ) {
    return true
  }
  return false
}

type Object = Record<string, any>

type CamelizeProps = {
  el: Object
  replacements?: Object
}

export function camelize(props: CamelizeProps) {
  const replacements = props.replacements ?? {}
  return Object.fromEntries(
    Object.entries(props.el).map(([key, value]) => {
      const camelizeKey = camel(key)
      return [replacements[camelizeKey] ?? camelizeKey, value]
    }),
  )
}

type CamelizeArrayProps = {
  array: Object[]
  replacements?: Object
}

export function camelizeArray(props: CamelizeArrayProps) {
  const replacements = props.replacements ?? {}
  return Array.from(props.array).map((el) => camelize({ el, replacements }))
}

type Period = {
  open: {
    day: number
    time: string
  }
  close: {
    time: string
  }
}

type Day = {
  dayOfWeek: number
  isClosed?: boolean
  period: number[][]
  isOpen24Hours?: boolean
}

export function transformPeriods(periods: Period[]) {
  const localLogger = consola.withTag('utils/helpers.ts')
  localLogger.log('periods', JSON.stringify(periods, null, 2))
  // Inicializar um objeto vazio para cada dia da semana
  const initialDays = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    isClosed: true,
    period: [],
  })) as Day[]

  // Usar reduce para transformar os dados
  const days = periods.reduce((acc, period) => {
    const day = acc[period.open.day]

    if (!day) return acc

    delete day?.isClosed

    const openTime = parseInt(period.open.time)
    const closeTime = parseInt(period.close.time)

    // Lidar com casos especiais, como quando o local está aberto 24 horas por dia
    if (openTime === 0 && closeTime === 0) {
      day.isOpen24Hours = true
      return acc
    }

    // Ajustar o horário de fechamento para '2359' se for '0'
    if (closeTime === 0) {
      day.period.push([openTime, 2359])
      return acc
    }

    day.period.push([openTime, closeTime])

    return acc
  }, initialDays)

  // Retornar o objeto final
  return days
}

// @ts-ignore
if (import.meta.vitest) {
  // @ts-ignore
  const { it, expect, describe } = import.meta.vitest

  describe('Parsing data from MySql statement', () => {
    it('should return inserted data', () => {
      expect(
        parseMysqlInsertStatement(
          "insert into `categories` (`id`, `uuid`, `slug`, `name`, `label`, `description`, `icon`, `active`, `created_at`, `updated_at`) values (default, 'RIcphp6nBEMg', 'lanchonete', 'Lanchonete', 'Lanchonete', 'This place sells lanches', '{\\\"name\\\":\\\"lanche\\\",\\\"pack\\\":\\\"w-4\\\"}', false, default, default)",
        ),
      ).toStrictEqual([
        {
          id: 'default',
          uuid: 'RIcphp6nBEMg',
          slug: 'lanchonete',
          name: 'Lanchonete',
          label: 'Lanchonete',
          description: 'This place sells lanches',
          icon: { name: 'lanche', pack: 'w-4' },
          active: 'false',
          created_at: 'default',
          updated_at: 'default',
        },
      ])
    })
  })
  describe('Checking if place is open', () => {
    it('should return true if place is the provided time is between the first period', () => {
      const BusinessHours = {
        isClosed: false,
        isOpen24Hours: false,
        openTime1: 800,
        closeTime1: 1200,
        openTime2: null,
        closeTime2: null,
      }
      const result = checkHours(BusinessHours, 1000)

      expect(result).toBe(true)
    })
    it('should return true if place is the provided time is between the second period', () => {
      const BusinessHours = {
        isClosed: false,
        isOpen24Hours: false,
        openTime1: 800,
        closeTime1: 1200,
        openTime2: 1300,
        closeTime2: 1800,
      }
      const result = checkHours(BusinessHours, 1400)

      expect(result).toBe(true)
    })
    it('should return true if place is open 24 hours', () => {
      const BusinessHours = {
        isClosed: false,
        isOpen24Hours: true,
        openTime1: 800,
        closeTime1: 1200,
        openTime2: null,
        closeTime2: null,
      }
      const result = checkHours(BusinessHours, 1400)

      expect(result).toBe(true)
    })
    it('should return false if place is closed', () => {
      const BusinessHours = {
        isClosed: true,
        isOpen24Hours: false,
        openTime1: 800,
        closeTime1: 1200,
        openTime2: null,
        closeTime2: null,
      }
      const result = checkHours(BusinessHours, 1000)

      expect(result).toBe(false)
    })
    it('should return false if the provided time is outside any period', () => {
      const BusinessHours = {
        isClosed: false,
        isOpen24Hours: false,
        openTime1: 800,
        closeTime1: 1200,
        openTime2: 1300,
        closeTime2: 1800,
      }
      expect(checkHours(BusinessHours, 1230)).toBe(false)
      expect(checkHours(BusinessHours, 1900)).toBe(false)
    })
  })

  describe('Transforming Google Places periods', () => {
    it('should correctly transform periods with multiple opening times', () => {
      const periods = [
        {
          close: { day: 1, time: '1500' },
          open: { day: 1, time: '1200' },
        },
        {
          close: { day: 1, time: '2330' },
          open: { day: 1, time: '1800' },
        },
      ]
      const result = transformPeriods(periods)
      expect(result[1]).toStrictEqual({
        dayOfWeek: 1,
        period: [
          [1200, 1500],
          [1800, 2330],
        ],
      })
    })

    it('should correctly handle places that are open 24 hours', () => {
      const periods = [
        {
          close: { day: 2, time: '0000' },
          open: { day: 2, time: '0000' },
        },
      ]
      const result = transformPeriods(periods)
      expect(result[2]).toStrictEqual({
        dayOfWeek: 2,
        isOpen24Hours: true,
        period: [],
      })
    })

    it('should correctly handle places that are closed', () => {
      const periods = [] as any[]
      const result = transformPeriods(periods)
      expect(result[0]).toStrictEqual({
        dayOfWeek: 0,
        period: [],
        isClosed: true,
      })
    })

    it('should correctly handle places with a single opening time', () => {
      const periods = [
        {
          close: { day: 3, time: '2300' },
          open: { day: 3, time: '1100' },
        },
      ]
      const result = transformPeriods(periods)
      expect(result[3]).toStrictEqual({
        dayOfWeek: 3,
        period: [[1100, 2300]],
      })
    })

    it('should correctly handle places with close time as midnight', () => {
      const periods = [
        {
          close: { day: 3, time: '0' },
          open: { day: 3, time: '1100' },
        },
      ]
      const result = transformPeriods(periods)
      expect(result[3]).toStrictEqual({
        dayOfWeek: 3,
        period: [[1100, 2359]],
      })
    })
  })
}
