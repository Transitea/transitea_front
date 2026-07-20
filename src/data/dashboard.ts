import type { PackageStatus } from '@/components/atoms/StatusBadge'

export interface Package {
  trackingCode: string
  destination: string
  via: string
  client: string
  status: PackageStatus
  date: string
}
