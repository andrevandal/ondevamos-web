import { InferSelectModel } from 'drizzle-orm'
import { openingHours as OpeningHoursTable } from '@/server/schemas/db/openingHours'

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

// @ts-ignore
if (import.meta.vitest) {
  // @ts-ignore
  const { it, expect } = import.meta.vitest

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
}
