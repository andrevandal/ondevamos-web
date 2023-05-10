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

type Places = {
  id: number
  title: string
  slug: string
  available: boolean
  description?: string
  avatar?: Avatar
  medias?: Media[]
  ratingLevel?: number | null
  priceLevel?: number | null
}[]

type Resource = {
  id: number
  title: string
  label: string
  description?: string
  places?: Places
}

type ResourcesResponse = {
  data: Resource[]
  meta?: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export default defineEventHandler(() => {
  // const runtimeConfig = useRuntimeConfig()

  // const fullUrl = (string = '') =>
  //   new URL(string, runtimeConfig?.public?.strapi?.url).toString()

  // const { data: strapiResources, meta } = await ofetch<StrapiApiResources>(
  //   fullUrl(
  //     `/api/resources?${qs.stringify(
  //       {
  //         sort: ['title:asc'],
  //         populate: {
  //           places: {
  //             populate: ['avatar', 'medias'],
  //           },
  //         },
  //       },
  //       {
  //         encodeValuesOnly: true,
  //       },
  //     )}`,
  //   ),
  // )

  // Convert StrapiApiResources to ResourcesResponse
  // const resources: Resource[] = strapiResources.map((resource) => ({
  //   id: resource.id,
  //   title: resource.attributes.title,
  //   label: resource.attributes.label,
  //   description: resource.attributes.description,
  //   places: resource.attributes.places.data.map((place) => ({
  //     id: place?.id,
  //     title: place.attributes.title,
  //     slug: place.attributes.slug,
  //     available: place.attributes.available,
  //     description: place.attributes.description,
  //     avatar:
  //       (place.attributes.avatar?.data?.id && {
  //         id: place.attributes.avatar?.data?.id,
  //         name: place.attributes.avatar?.data?.attributes.name,
  //         alternativeText:
  //           place.attributes.avatar?.data.attributes?.alternativeText,
  //         url: fullUrl(place.attributes.avatar?.data.attributes?.url),
  //       }) ||
  //       undefined,
  //     medias: place.attributes?.medias.data?.map((media) => ({
  //       id: media.id,
  //       alternativeText: media.attributes?.alternativeText,
  //       url: fullUrl(media.attributes?.url),
  //     })),
  //     ratingLevel: place.attributes.ratingLevel,
  //     priceLevel: place.attributes.priceLevel,
  //   })),
  // }))

  // console.log(JSON.stringify(resources, null, 2))

  // Return ResourcesResponse

  const resources: Resource[] = [
    {
      id: 3,
      title: 'Carnes',
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

  return {
    data: resources,
    // meta,
  } as ResourcesResponse
})
