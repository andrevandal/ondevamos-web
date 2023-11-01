// const MockedPlace = {
//   cover: {
//     url: '/images/375x165.png',
//     alt: '',
//   },
//   title: 'Dom Catulo Burguer',
//   avatar: '/images/100x100.png',
//   available: true,
//   address: 'Rod. Hélio Smidt, Check-in B - Aeroporto, Guarulhos - SP',
//   description: 'Lorem ipsum dolor sit amet consectetur. Venenatis egestas.',
//   rating: 3,
//   price: 3,
//   veganOptions: true,
//   petFriendly: true,
//   featuredMedias: Array(3).fill({
//     type: 'image',
//     src: '/images/270x338.png',
//     alt: '',
//   }),
//   actions: [
//     {
//       icon: 'map-pin-outline',
//       label: 'Como chegar',
//       href: 'https://www.google.com/maps?q=',
//     },
//     {
//       icon: 'instagram',
//       label: '@pedrohenri.ms',
//       href: 'https://www.instagram.com/pedrohenri.ms',
//     },
//     {
//       icon: 'whatsapp',
//       label: '(44) 99144-1919',
//       href: 'https://wa.me/+5544991441919',
//     },
//   ],
//   mainAttractions: Array(2).fill({
//     image: {
//       src: '/images/270x338.png',
//       alt: '',
//     },
//     title: 'Deliciosos Cookies',
//     description: 'A partir de R$00,00',
//   }),
//   openNow: false,
//   openingHours: [
//     { day: 'Segunda-feira', hour: '07:00-23:00' },
//     { day: 'Terça-feira', hour: '07:00-23:00' },
//     { day: 'Quarta-feira', hour: '07:00-23:00' },
//     { day: 'Quinta-feira', hour: '07:00-23:00' },
//   ],
// }
import { getPlace } from '@/server/repositories/places'
import { useAuth } from '@/server/services/auth'
import { validateParams } from '@/server/services/schemaValidation'

import {
  type ParamsUUIDSchema,
  paramsUUIDSchema,
} from '@/server/schemas/endpoints'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsUUIDSchema>(
    event,
    paramsUUIDSchema,
  )

  const isUuid = /^[0-9A-Za-z_]{12}$/.test(uuid)

  const identifier = isUuid
    ? ({ uuid } as { uuid: string })
    : ({ slug: uuid } as { slug: string })

  const place = await getPlace(identifier)

  if (!place) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Place not found',
      data: undefined,
      stack: undefined,
    })
  }

  return place
})
