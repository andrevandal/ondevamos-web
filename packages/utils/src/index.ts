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

type Hours = {
  isClosed: boolean
  isOpen24Hours: boolean
  openTime1: number
  closeTime1: number
  openTime2: number | null
  closeTime2: number | null
}

export const checkHours = (hours: Hours, currentTime: number) => {
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
}
