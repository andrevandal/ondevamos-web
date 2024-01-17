import { camel } from 'radash'
// import { consola } from 'consola'

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
  // const localLogger = consola.withTag('utils/helpers.ts')
  // localLogger.log('periods', JSON.stringify(periods, null, 2))
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
