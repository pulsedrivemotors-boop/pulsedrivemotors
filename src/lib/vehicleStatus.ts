// Single source of truth for vehicle statuses, shared by the public site,
// the inventory admin and the accounting section so they always match.

export type VehicleStatus = 'available' | 'reserved' | 'in-process' | 'sold'

export interface StatusDef {
  value: VehicleStatus
  label: string
  /** Whether the public site is allowed to show vehicles with this status (in-process is owner-only). */
  publicListed: boolean
  /** Badge style: background + text + border. */
  badge: string
  /** Text-only colour. */
  text: string
  /** Dot/indicator background colour. */
  dot: string
}

export const VEHICLE_STATUSES: StatusDef[] = [
  { value: 'available',  label: 'Available',  publicListed: true,  badge: 'bg-lime-500/20 text-lime-400 border-lime-500/30',     text: 'text-lime-400',   dot: 'bg-lime-400' },
  { value: 'reserved',   label: 'Reserved',   publicListed: true,  badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  { value: 'in-process', label: 'In Process', publicListed: false, badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',     text: 'text-blue-400',   dot: 'bg-blue-400' },
  { value: 'sold',       label: 'Sold',       publicListed: true,  badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',     text: 'text-gray-400',   dot: 'bg-gray-400' },
]

/** Statuses the public site may expose (used to clamp the public API). */
export const PUBLIC_STATUSES: VehicleStatus[] = VEHICLE_STATUSES.filter(s => s.publicListed).map(s => s.value)

export function isPublicStatus(status: string): boolean {
  return (PUBLIC_STATUSES as string[]).includes(status)
}

export const STATUS_LABEL: Record<string, string> = Object.fromEntries(VEHICLE_STATUSES.map(s => [s.value, s.label]))
export const STATUS_BADGE: Record<string, string> = Object.fromEntries(VEHICLE_STATUSES.map(s => [s.value, s.badge]))
export const STATUS_TEXT: Record<string, string> = Object.fromEntries(VEHICLE_STATUSES.map(s => [s.value, s.text]))
export const STATUS_DOT: Record<string, string> = Object.fromEntries(VEHICLE_STATUSES.map(s => [s.value, s.dot]))
