import 'dotenv/config'

import { migrate } from 'drizzle-orm/planetscale-serverless/migrator'
import { db } from './services/database'
import { cities } from './schemas/db/places'

// this will automatically run needed migrations on the database
try {
  await migrate(db, { migrationsFolder: './server/migrations' })

  // await db.insert(cities).values([{ name: 'Andrew' }, { name: 'Dan' }]);

  await db.insert(cities).values([
    {
      uuid: '631MoVdwcatv',
      name: 'Guarulhos',
      state: 'SP',
      ibgeCode: '3518800',
      country: 'BR',
      label: 'guarulhos',
    },
    {
      uuid: 'vU2TFimVUMa5',
      name: 'São Paulo',
      state: 'SP',
      ibgeCode: '3550308',
      country: 'BR',
      label: 'sao paulo',
    },
    {
      uuid: 'ZsEYCGHz54QZ',
      name: 'Paranavaí',
      state: 'PR',
      ibgeCode: '4118402',
      country: 'BR',
      label: 'paranavai',
    },
  ])
} catch (e) {
  console.log(e)
}
