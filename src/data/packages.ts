import { type PackageStatus, STATUS_META, STATUS_ORDER } from '@/components/atoms/StatusBadge'

/** Filtres de la page Colis : "Tous" + les 6 statuts du cahier des charges. */
export const statusFilters: { value: PackageStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous' },
  ...STATUS_ORDER.map((value) => ({ value, label: STATUS_META[value].label })),
]
