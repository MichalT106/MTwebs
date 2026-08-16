import type { CatalogCategory, CatalogKey } from '@/types/maintenance';

export interface CatalogItem {
  key: Exclude<CatalogKey, 'custom'>;
  category: CatalogCategory;
}

export const CATALOG_CATEGORY_ORDER: CatalogCategory[] = [
  'engine',
  'fluids',
  'brakes',
  'tires',
  'drivetrain',
  'suspension',
  'electrical',
  'controls',
  'general',
];

export const MAINTENANCE_CATALOG: CatalogItem[] = [
  { key: 'engine_oil', category: 'engine' },
  { key: 'oil_filter', category: 'engine' },
  { key: 'air_filter', category: 'engine' },
  { key: 'spark_plugs', category: 'engine' },
  { key: 'valve_clearance', category: 'engine' },
  { key: 'coolant', category: 'fluids' },
  { key: 'brake_fluid', category: 'fluids' },
  { key: 'clutch_fluid', category: 'fluids' },
  { key: 'fork_oil', category: 'fluids' },
  { key: 'final_drive_oil', category: 'fluids' },
  { key: 'front_brake_pads', category: 'brakes' },
  { key: 'rear_brake_pads', category: 'brakes' },
  { key: 'front_brake_disc', category: 'brakes' },
  { key: 'rear_brake_disc', category: 'brakes' },
  { key: 'brake_lines', category: 'brakes' },
  { key: 'front_tire', category: 'tires' },
  { key: 'rear_tire', category: 'tires' },
  { key: 'wheel_bearings', category: 'tires' },
  { key: 'chain', category: 'drivetrain' },
  { key: 'chain_lubrication', category: 'drivetrain' },
  { key: 'chain_and_sprockets', category: 'drivetrain' },
  { key: 'drive_belt', category: 'drivetrain' },
  { key: 'fork_seals', category: 'suspension' },
  { key: 'suspension', category: 'suspension' },
  { key: 'steering_head_bearings', category: 'suspension' },
  { key: 'battery', category: 'electrical' },
  { key: 'clutch_cable', category: 'controls' },
  { key: 'throttle_cable', category: 'controls' },
  { key: 'general_inspection', category: 'general' },
];

export function isPredefinedCatalogKey(key: string): key is Exclude<CatalogKey, 'custom'> {
  return MAINTENANCE_CATALOG.some((item) => item.key === key);
}
