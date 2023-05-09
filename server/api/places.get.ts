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
  ratingLevel: number
  priceLevel: number
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

  // Return ResourcesResponse

  const resources: Resource[] = [
    // {
    //   id: 3,
    //   title: 'Churrascaria',
    //   label: 'Aproveite o incrível sabor da tradicional carne assada! ',
    //   description: 'Selecionamos as melhores churrascarias da cidade para você',
    //   places: [],
    // },

    {
      id: 1,
      title: 'Hamburgueria',
      label: 'Delícias de carne e sabores incríveis! 🤤',
      description: 'Aqui algumas recomendações de hamburguerias na cidade',
      places: [
        {
          id: 1,
          title: 'Dom Catulo Burguer',
          slug: 'dom-catulo-burguer',
          available: false,
          description:
            'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
          avatar: {
            id: 1,
            name: 'perfil (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/perfil_1_d094a3a7b0.jpg',
          },
          medias: [
            {
              id: 2,
              alternativeText: '',
              url: 'http://localhost:1337/uploads/capa_1_926e746052.jpg',
            },
          ],
          ratingLevel: 4.5,
          priceLevel: 2,
        },
        {
          id: 1,
          title: 'Dom Catulo Burguer',
          slug: 'dom-catulo-burguer',
          available: false,
          description:
            'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
          avatar: {
            id: 1,
            name: 'perfil (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/perfil_1_d094a3a7b0.jpg',
          },
          medias: [
            {
              id: 2,
              alternativeText: '',
              url: 'http://localhost:1337/uploads/capa_1_926e746052.jpg',
            },
          ],
          ratingLevel: 4.5,
          priceLevel: 1,
        },
        {
          id: 1,
          title: 'Dom Catulo Burguer',
          slug: 'dom-catulo-burguer',
          available: false,
          description:
            'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
          avatar: {
            id: 1,
            name: 'perfil (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/perfil_1_d094a3a7b0.jpg',
          },
          ratingLevel: 4.5,
          priceLevel: 4,
        },
        {
          id: 1,
          title: 'Dom Catulo Burguer',
          slug: 'dom-catulo-burguer',
          available: false,
          description:
            'Lorem ipsum dolor sit amet consectetur. Venenatis egestas',
          avatar: {
            id: 1,
            name: 'perfil (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/perfil_1_d094a3a7b0.jpg',
          },
          medias: [
            {
              id: 2,
              alternativeText: '',
              url: 'http://localhost:1337/uploads/capa_1_926e746052.jpg',
            },
          ],
          ratingLevel: 4.5,
          priceLevel: 4,
        },
      ],
    },
    {
      id: 2,
      title: 'Doces & Guloseimas',
      label: 'Delícias de doces e guloseimas com sabores incríveis! 🤤',
      description: 'Aqui algumas recomendações de docerias na cidade',
      places: [
        {
          id: 2,
          title: 'American Cookies',
          slug: 'american-cookies',
          available: false,
          description: '',
          avatar: {
            id: 3,
            name: '313930098_1127866654511395_3232089528329223134_n (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/313930098_1127866654511395_3232089528329223134_n_1_7abcca5f34.jpg',
          },
          medias: [
            {
              id: 4,
              alternativeText: '',
              url: 'http://localhost:1337/uploads/319674489_1103638540300327_6411484005350141602_n_1_1d87cc4508.jpg',
            },
          ],
          ratingLevel: 4.5,
          priceLevel: 4,
        },
        {
          id: 2,
          title: 'American Cookies',
          slug: 'american-cookies',
          available: false,
          description: '',
          avatar: {
            id: 3,
            name: '313930098_1127866654511395_3232089528329223134_n (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/313930098_1127866654511395_3232089528329223134_n_1_7abcca5f34.jpg',
          },
          ratingLevel: 4.5,
          priceLevel: 4,
        },
        {
          id: 2,
          title: 'American Cookies',
          slug: 'american-cookies',
          available: false,
          description: '',
          avatar: {
            id: 3,
            name: '313930098_1127866654511395_3232089528329223134_n (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/313930098_1127866654511395_3232089528329223134_n_1_7abcca5f34.jpg',
          },
          medias: [
            {
              id: 4,
              alternativeText: '',
              url: 'http://localhost:1337/uploads/319674489_1103638540300327_6411484005350141602_n_1_1d87cc4508.jpg',
            },
          ],
          ratingLevel: 4.5,
          priceLevel: 4,
        },
        {
          id: 2,
          title: 'American Cookies',
          slug: 'american-cookies',
          available: false,
          description: '',
          avatar: {
            id: 3,
            name: '313930098_1127866654511395_3232089528329223134_n (1).jpg',
            alternativeText: '',
            url: 'http://localhost:1337/uploads/313930098_1127866654511395_3232089528329223134_n_1_7abcca5f34.jpg',
          },
          medias: [
            {
              id: 4,
              alternativeText: '',
              url: 'http://localhost:1337/uploads/319674489_1103638540300327_6411484005350141602_n_1_1d87cc4508.jpg',
            },
          ],
          ratingLevel: 4.5,
          priceLevel: 4,
        },
      ],
    },
    // {
    //   id: 4,
    //   title: 'Japanese Food',
    //   label: 'Delicie-se com a autêntica culinária japonesa!',
    //   description:
    //     'Confira as nossas sugestões das melhores opções de comida japonesa na cidade',
    //   places: [],
    // },
    // {
    //   id: 5,
    //   title: 'Pizzaria',
    //   label: 'Desfrute de deliciosas pizzas preparadas artesanalmente!',
    //   description:
    //     'Aqui estão as nossas recomendações das melhores pizzarias na cidade',
    //   places: [],
    // },
    // {
    //   id: 6,
    //   title: 'Sorveteria',
    //   label: 'Refresque-se com uma grande variedade de sorvetes e gelatos!',
    //   description:
    //     'Encontre as sorveterias mais deliciosas e famosas da cidade',
    //   places: [],
    // },
  ]
  return {
    data: resources,
    // meta,
  } as ResourcesResponse
})
