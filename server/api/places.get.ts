import { zh } from 'h3-zod'
import { z } from 'zod'
import type { H3Event } from 'h3'

// import * as qs from 'qs'
// import { ofetch } from 'ofetch'

// type StrapiMediaFormatsContent = {
//   ext: string
//   url: string
//   hash: string
//   mime: string
//   name: string
//   path: string
//   size: number
//   width: number
//   height: number
// }

// type StrapiMediaFormats = {
//   large: StrapiMediaFormatsContent
//   small: StrapiMediaFormatsContent
//   medium: StrapiMediaFormatsContent
//   thumbnail: StrapiMediaFormatsContent
// }

// type StrapiPlaces = {
//   data: {
//     id: number
//     attributes: {
//       title: string
//       slug: string
//       available: boolean
//       description: string
//       createdAt: string
//       updatedAt: string
//       publishedAt: string
//       avatar?: {
//         data: {
//           id: 1
//           attributes: {
//             name: string
//             alternativeText: string
//             caption: string
//             width: number
//             height: number
//             formats: any
//             hash: string
//             ext: string
//             mime: string
//             size: number
//             url: string
//             previewUrl: string
//             provider: string
//             provider_metadata: any
//             createdAt: string
//             updatedAt: string
//           }
//         }
//       }
//       medias: {
//         data: {
//           id: number
//           attributes: {
//             name: string
//             alternativeText?: string
//             caption?: string
//             width: number
//             height: number
//             formats: StrapiMediaFormats
//             hash: string
//             ext: string
//             mime: string
//             size: number
//             url: string
//             previewUrl: string
//             provider: string
//             provider_metadata: any
//             createdAt: string
//             updatedAt: string
//           }
//         }[]
//       }
//       ratingLevel: number
//       priceLevel: number
//     }
//   }[]
// }

// type StrapiApiResources = {
//   data: {
//     id: number
//     attributes: {
//       slug: string
//       title: string
//       label: string
//       description: string
//       createdAt: string
//       updatedAt: string
//       places: StrapiPlaces
//     }
//   }[]
//   meta: {
//     pagination: {
//       page: number
//       pageSize: number
//       pageCount: number
//       total: number
//     }
//   }
// }

type Avatar = {
  id: number
  name: string
  alternativeText: string
  url: string
}

type Media = {
  id: number
  alternativeText?: string
  url: string
}

type Place = {
  id: number
  title: string
  slug: string
  available: boolean
  description?: string
  avatar?: Avatar
  medias?: Media[]
  ratingLevel?: number | null
  priceLevel?: number | null
}

type Resource = {
  id: number
  title: string
  label: string
  description?: string
  places?: Place[]
}

type ResourcesResponse = {
  data: Resource[] | Place[]
  meta?: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
const tagsAllowed = ['pet-friendly', 'opcoes-veganas']
const pricingLevelAllowed = [0, 3.5, 4, 4.5]

const tagSchema = z.string().transform((val, ctx) => {
  const parsed = [...val.split(',')].filter((el) => tagsAllowed.includes(el))
  if (!parsed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Tag not allowed',
    })
    return z.NEVER
  }
  return parsed
})

const ratingLevelSchema = z.coerce.number().transform((val, ctx) => {
  const parsed = pricingLevelAllowed.includes(val)
  if (!parsed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Pricing level not allowed',
    })
    return z.NEVER
  }
  return val
})

const QuerySchema = z.object({
  q: z.string().optional(),
  tags: z.optional(tagSchema),
  openingHours: z.nullable(z.enum(['opened-now']).optional()),
  pricingLevel: z.optional(z.coerce.number().int().min(0).max(4)),
  ratingLevel: z.optional(ratingLevelSchema),
})

async function parseQuery(event: H3Event) {
  const query = await zh.useSafeValidatedQuery(event as any, QuerySchema)
  if (query.success) {
    return Promise.resolve(query.data)
  }

  return Promise.reject(query.error)
}

const resources: Resource[] = [
  {
    id: 3,
    title: 'Churrascaria',
    label: 'Suculentos e deliciosos cortes de carne esperando por você 🥩',
    description: 'A churrascaria dos seus sonhos está aqui!',
    places: [
      {
        id: 3,
        title: 'The Steak Factory',
        slug: 'the-steak-factory',
        available: true,
        description:
          'Steakhouse Premium com os melhores Burgers, Cortes e Chopp Heineken!',
        avatar: {
          id: 5,
          name: '299705042_2010635869124601_5584247212347922067_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/299705042_2010635869124601_5584247212347922067_n_2d3e6d2c44.jpg',
        },
        medias: [
          {
            id: 7,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/342737214_583218627120804_2772007424267394825_n_2c0d8e8a05.jpg',
          },
          {
            id: 6,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/329957366_518688333771985_5399712986759657693_n_d19d036c2a.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
      {
        id: 3,
        title: 'The Steak Factory',
        slug: 'the-steak-factory',
        available: true,
        description:
          'Steakhouse Premium com os melhores Burgers, Cortes e Chopp Heineken!',
        avatar: {
          id: 5,
          name: '299705042_2010635869124601_5584247212347922067_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/299705042_2010635869124601_5584247212347922067_n_2d3e6d2c44.jpg',
        },
        medias: [
          {
            id: 7,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/342737214_583218627120804_2772007424267394825_n_2c0d8e8a05.jpg',
          },
          {
            id: 6,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/329957366_518688333771985_5399712986759657693_n_d19d036c2a.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
      {
        id: 3,
        title: 'The Steak Factory',
        slug: 'the-steak-factory',
        available: true,
        description:
          'Steakhouse Premium com os melhores Burgers, Cortes e Chopp Heineken!',
        avatar: {
          id: 5,
          name: '299705042_2010635869124601_5584247212347922067_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/299705042_2010635869124601_5584247212347922067_n_2d3e6d2c44.jpg',
        },
        medias: [
          {
            id: 7,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/342737214_583218627120804_2772007424267394825_n_2c0d8e8a05.jpg',
          },
          {
            id: 6,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/329957366_518688333771985_5399712986759657693_n_d19d036c2a.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
      {
        id: 3,
        title: 'The Steak Factory',
        slug: 'the-steak-factory',
        available: true,
        description:
          'Steakhouse Premium com os melhores Burgers, Cortes e Chopp Heineken!',
        avatar: {
          id: 5,
          name: '299705042_2010635869124601_5584247212347922067_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/299705042_2010635869124601_5584247212347922067_n_2d3e6d2c44.jpg',
        },
        medias: [
          {
            id: 7,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/342737214_583218627120804_2772007424267394825_n_2c0d8e8a05.jpg',
          },
          {
            id: 6,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/329957366_518688333771985_5399712986759657693_n_d19d036c2a.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
    ],
  },
  {
    id: 2,
    title: 'Doces & Sobremesas',
    label: 'Descubra o sabor da felicidade em cada mordida 🍰',
    description:
      'Confira nossa seleção de doces e sobremesas para adoçar o seu dia!',
    places: [
      {
        id: 2,
        title: 'American Cookies',
        slug: 'american-cookies',
        available: true,
        description: '',
        avatar: {
          id: 3,
          name: '313930098_1127866654511395_3232089528329223134_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/313930098_1127866654511395_3232089528329223134_n_232ddc1e7f.jpg',
        },
        medias: [
          {
            id: 4,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/319674489_1103638540300327_6411484005350141602_n_3fcd383e26.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
      {
        id: 2,
        title: 'American Cookies',
        slug: 'american-cookies',
        available: true,
        description: '',
        avatar: {
          id: 3,
          name: '313930098_1127866654511395_3232089528329223134_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/313930098_1127866654511395_3232089528329223134_n_232ddc1e7f.jpg',
        },
        medias: [
          {
            id: 4,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/319674489_1103638540300327_6411484005350141602_n_3fcd383e26.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
      {
        id: 2,
        title: 'American Cookies',
        slug: 'american-cookies',
        available: true,
        description: '',
        avatar: {
          id: 3,
          name: '313930098_1127866654511395_3232089528329223134_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/313930098_1127866654511395_3232089528329223134_n_232ddc1e7f.jpg',
        },
        medias: [
          {
            id: 4,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/319674489_1103638540300327_6411484005350141602_n_3fcd383e26.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
      {
        id: 2,
        title: 'American Cookies',
        slug: 'american-cookies',
        available: true,
        description: '',
        avatar: {
          id: 3,
          name: '313930098_1127866654511395_3232089528329223134_n.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/313930098_1127866654511395_3232089528329223134_n_232ddc1e7f.jpg',
        },
        medias: [
          {
            id: 4,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/319674489_1103638540300327_6411484005350141602_n_3fcd383e26.jpg',
          },
        ],
        ratingLevel: null,
        priceLevel: null,
      },
    ],
  },
  {
    id: 1,
    title: 'Hamburgueria',
    label: 'A busca pelo hambúrguer perfeito acabou 🍔',
    description:
      'Descubra as melhores hamburguerias e sinta a suculência a cada mordida',
    places: [
      {
        id: 1,
        title: 'Dom Catulo Burguer',
        slug: 'dom-catulo-burguer',
        available: true,
        description:
          'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
        avatar: {
          id: 1,
          name: 'perfil.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/perfil_314cbddfae.jpg',
        },
        medias: [
          {
            id: 2,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/capa_6c5535bd85.jpg',
          },
        ],
        ratingLevel: 1.5,
        priceLevel: 2,
      },
      {
        id: 1,
        title: 'Dom Catulo Burguer',
        slug: 'dom-catulo-burguer',
        available: true,
        description:
          'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
        avatar: {
          id: 1,
          name: 'perfil.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/perfil_314cbddfae.jpg',
        },
        medias: [
          {
            id: 2,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/capa_6c5535bd85.jpg',
          },
        ],
        ratingLevel: 1.5,
        priceLevel: 2,
      },
      {
        id: 1,
        title: 'Dom Catulo Burguer',
        slug: 'dom-catulo-burguer',
        available: true,
        description:
          'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
        avatar: {
          id: 1,
          name: 'perfil.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/perfil_314cbddfae.jpg',
        },
        medias: [
          {
            id: 2,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/capa_6c5535bd85.jpg',
          },
        ],
        ratingLevel: 1.5,
        priceLevel: 2,
      },
      {
        id: 1,
        title: 'Dom Catulo Burguer',
        slug: 'dom-catulo-burguer',
        available: true,
        description:
          'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
        avatar: {
          id: 1,
          name: 'perfil.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/perfil_314cbddfae.jpg',
        },
        medias: [
          {
            id: 2,
            alternativeText: '',
            url: 'https://api.ondevamos.app/uploads/capa_6c5535bd85.jpg',
          },
        ],
        ratingLevel: 1,
        priceLevel: 4,
      },
    ],
  },
  {
    id: 4,
    title: 'Viagem Gastronômica',
    label: 'Explore sabores autênticos de diferentes regiões do mundo 🌎',
    description:
      'Esses lugares oferecem uma experiência gastronômica global sem sair da cidade!',
    places: [
      {
        id: 4,
        title: 'Restaurante e Pizzaria Nonnetto',
        slug: 'restaurante-e-pizzaria-nonnetto',
        available: false,
        description:
          'Saboreie o melhor da GASTRONOMIA ITALIANA com as melhores pizzas.',
        avatar: {
          id: 8,
          name: '202004051612_ddti_i.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/202004051612_ddti_i_95f0754e3b.jpg',
        },
        ratingLevel: 3.5,
        priceLevel: 4,
      },
      {
        id: 4,
        title: 'Restaurante e Pizzaria Nonnetto',
        slug: 'restaurante-e-pizzaria-nonnetto',
        available: false,
        description:
          'Saboreie o melhor da GASTRONOMIA ITALIANA com as melhores pizzas.',
        avatar: {
          id: 8,
          name: '202004051612_ddti_i.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/202004051612_ddti_i_95f0754e3b.jpg',
        },
        ratingLevel: 3.5,
        priceLevel: 4,
      },
      {
        id: 4,
        title: 'Restaurante e Pizzaria Nonnetto',
        slug: 'restaurante-e-pizzaria-nonnetto',
        available: false,
        description:
          'Saboreie o melhor da GASTRONOMIA ITALIANA com as melhores pizzas.',
        avatar: {
          id: 8,
          name: '202004051612_ddti_i.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/202004051612_ddti_i_95f0754e3b.jpg',
        },
        ratingLevel: 3.5,
        priceLevel: 4,
      },
      {
        id: 4,
        title: 'Restaurante e Pizzaria Nonnetto',
        slug: 'restaurante-e-pizzaria-nonnetto',
        available: false,
        description:
          'Saboreie o melhor da GASTRONOMIA ITALIANA com as melhores pizzas.',
        avatar: {
          id: 8,
          name: '202004051612_ddti_i.jpg',
          alternativeText: '',
          url: 'https://api.ondevamos.app/uploads/202004051612_ddti_i_95f0754e3b.jpg',
        },
        ratingLevel: 3.5,
        priceLevel: 4,
      },
    ],
  },
]

const searchPlaces = (
  resources: Resource[],
  options: z.infer<typeof QuerySchema>,
): Place[] => {
  const normalizedSearchTerm = options?.q?.toLowerCase()

  const matchingResources = normalizedSearchTerm
    ? resources.filter((resource) => {
        const resourceTitleMatch = resource.title
          .toLowerCase()
          .includes(normalizedSearchTerm)
        const placeMatch = (resource.places ?? []).some((place) =>
          (place.title.toLowerCase() + ' ' + (place.description ?? ''))
            .toLowerCase()
            .includes(normalizedSearchTerm),
        )
        return resourceTitleMatch || placeMatch
      })
    : resources

  return matchingResources.reduce<Place[]>((result, resource) => {
    return [...result, ...(resource.places ?? [])]
  }, [])
}

export default defineEventHandler(async (event) => {
  try {
    const { q, tags, openingHours, pricingLevel, ratingLevel } =
      await parseQuery(event)
    if (q) {
      const data = searchPlaces(resources, {
        q,
        tags,
        openingHours,
        pricingLevel,
        ratingLevel,
      })

      return {
        data,
        // meta,
      } as ResourcesResponse
    }

    return {
      data: resources,
      // meta,
    } as ResourcesResponse
  } catch (error) {
    console.error(error)
    return createError('Internal Server Error')
  }

  return {
    data: resources,
    // meta,
  } as ResourcesResponse
})
