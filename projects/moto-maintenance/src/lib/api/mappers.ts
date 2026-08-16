import type { Database } from '@/types/database';
import type {
  CustomCatalogItem,
  IntervalUnit,
  MaintenanceItem,
  Motorcycle,
  TrackingMethod,
} from '@/types/maintenance';
import { isPredefinedCatalogKey } from '@/lib/catalog';

type MotorcycleRow = Database['public']['Tables']['moto_motorcycles']['Row'];
type ItemRow = Database['public']['Tables']['moto_maintenance_items']['Row'];
type CustomRow = Database['public']['Tables']['moto_custom_maintenance_types']['Row'];

export function motorcycleFromRow(row: MotorcycleRow, items: MaintenanceItem[] = []): Motorcycle {
  return {
    id: row.id,
    manufacturer: row.manufacturer,
    model: row.model,
    year: row.year,
    currentMileage: row.current_mileage,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    maintenanceItems: items,
  };
}

export function itemFromRow(row: ItemRow): MaintenanceItem {
  const catalogKey = isPredefinedCatalogKey(row.catalog_key) ? row.catalog_key : 'custom';
  return {
    id: row.id,
    name: row.name,
    catalogKey,
    customCatalogId: row.custom_type_id,
    trackingMethod: row.tracking_method as TrackingMethod,
    lastMaintenanceDate: row.last_maintenance_date,
    lastMaintenanceMileage: row.last_maintenance_mileage,
    intervalValue: row.interval_value,
    intervalUnit: row.interval_unit as IntervalUnit,
    enabled: row.enabled,
  };
}

export function customFromRow(row: CustomRow): CustomCatalogItem {
  return { id: row.id, name: row.name };
}

export function motorcycleToInsert(motorcycle: Motorcycle, userId: string) {
  return {
    id: motorcycle.id,
    user_id: userId,
    manufacturer: motorcycle.manufacturer,
    model: motorcycle.model,
    year: motorcycle.year,
    current_mileage: motorcycle.currentMileage,
  };
}

export function itemToInsert(item: MaintenanceItem, motorcycleId: string, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    motorcycle_id: motorcycleId,
    custom_type_id: item.customCatalogId,
    name: item.name,
    catalog_key: item.catalogKey,
    tracking_method: item.trackingMethod,
    last_maintenance_date: item.lastMaintenanceDate,
    last_maintenance_mileage: item.lastMaintenanceMileage,
    interval_value: item.intervalValue,
    interval_unit: item.intervalUnit,
    enabled: item.enabled,
  };
}

export function customToInsert(item: CustomCatalogItem, userId: string) {
  return {
    id: item.id,
    user_id: userId,
    name: item.name,
  };
}

export function assembleState(
  bikes: MotorcycleRow[],
  items: ItemRow[],
  customs: CustomRow[],
): { motorcycles: Motorcycle[]; customCatalogItems: CustomCatalogItem[] } {
  const grouped = new Map<string, MaintenanceItem[]>();
  for (const item of items) {
    const list = grouped.get(item.motorcycle_id) ?? [];
    list.push(itemFromRow(item));
    grouped.set(item.motorcycle_id, list);
  }

  return {
    motorcycles: bikes.map((bike) => motorcycleFromRow(bike, grouped.get(bike.id) ?? [])),
    customCatalogItems: customs.map(customFromRow),
  };
}
