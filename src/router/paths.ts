/** Chemins de routes centralisés, pour éviter les chaînes en dur. */
export const paths = {
  login: '/login',
  dashboard: '/',
  colis: '/colis',
  colisNouveau: '/colis/nouveau',
  colisDetail: (id = ':id') => `/colis/${id}`,
  clients: '/clients',
  itineraires: '/itineraires',
  notifications: '/notifications',
  rapports: '/rapports',
  parametres: '/parametres',
} as const
