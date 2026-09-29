// Business details shown across the site. Values marked TODO are placeholders
// until the client confirms them (see planning repo: zoomserie_kristal/CLAUDE.md).
export const site = {
  name: 'Zoomserie', // TODO: placeholder brand name
  url: 'https://zoomserie.ro', // TODO: real domain once the brand name is confirmed
  phone: '+40 700 000 000', // TODO
  whatsappNumber: '40755041450', // international format, no "+" (used in wa.me links)
  email: 'contact@zoomserie.ro', // TODO
  address: 'Bloc C5, Grand Kristal Residence, Sector 4, București', // TODO: full address
  instagramUrl: 'https://www.instagram.com/', // TODO
  freeDeliveryThresholdRon: 200,
  legal: {
    companyName: 'TODO SRL',
    cui: 'TODO',
    regCom: 'TODO',
  },
} as const;
