const MockedPlace = {
  cover: {
    url: '/images/375x165.png',
    alt: '',
  },
  title: 'Dom Catulo Burguer',
  avatar: '/images/100x100.png',
  available: true,
  address: 'Rod. Hélio Smidt, Check-in B - Aeroporto, Guarulhos - SP',
  description: 'Lorem ipsum dolor sit amet consectetur. Venenatis egestas.',
  rating: 3,
  price: 3,
  veganOptions: true,
  petFriendly: true,
  featuredMedias: Array(3).fill({
    type: 'image',
    src: '/images/270x338.png',
    alt: '',
  }),
  actions: [
    {
      icon: 'map-pin-outline',
      label: 'Como chegar',
      href: 'https://www.google.com/maps?q=',
    },
    {
      icon: 'instagram',
      label: '@pedrohenri.ms',
      href: 'https://www.instagram.com/pedrohenri.ms',
    },
    {
      icon: 'whatsapp',
      label: '(44) 99144-1919',
      href: 'https://wa.me/+5544991441919',
    },
  ],
  mainAttractions: Array(2).fill({
    image: {
      src: '/images/270x338.png',
      alt: '',
    },
    title: 'Deliciosos Cookies',
    description: 'A partir de R$00,00',
  }),
  openNow: false,
  openingHours: [
    { day: 'Segunda-feira', hour: '07:00-23:00' },
    { day: 'Terça-feira', hour: '07:00-23:00' },
    { day: 'Quarta-feira', hour: '07:00-23:00' },
    { day: 'Quinta-feira', hour: '07:00-23:00' },
  ],
}

export default eventHandler((event) => {
  const { slug } = event.context.params as { slug: string }
  console.log(slug)

  return MockedPlace
})
