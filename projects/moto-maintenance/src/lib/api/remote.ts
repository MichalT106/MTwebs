import { supabase } from '@/lib/supabase';
import { assembleState, customToInsert, itemToInsert, motorcycleToInsert } from '@/lib/api/mappers';
import type { AppState, CustomCatalogItem, MaintenanceItem, Motorcycle } from '@/types/maintenance';

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function fetchAppState(userId: string): Promise<AppState> {
  const [bikes, items, customs] = await Promise.all([
    supabase.from('moto_motorcycles').select('*').eq('user_id', userId).order('created_at'),
    supabase.from('moto_maintenance_items').select('*').eq('user_id', userId),
    supabase.from('moto_custom_maintenance_types').select('*').eq('user_id', userId).order('created_at'),
  ]);

  throwIfError(bikes.error);
  throwIfError(items.error);
  throwIfError(customs.error);

  return {
    version: 1,
    ...assembleState(bikes.data ?? [], items.data ?? [], customs.data ?? []),
  };
}

export async function insertMotorcycle(userId: string, motorcycle: Motorcycle) {
  const { error } = await supabase.from('moto_motorcycles').insert(motorcycleToInsert(motorcycle, userId));
  throwIfError(error);
}

export async function updateMotorcycleRow(
  id: string,
  patch: Partial<Pick<Motorcycle, 'manufacturer' | 'model' | 'year' | 'currentMileage'>>,
) {
  const { error } = await supabase
    .from('moto_motorcycles')
    .update({
      ...(patch.manufacturer !== undefined ? { manufacturer: patch.manufacturer } : {}),
      ...(patch.model !== undefined ? { model: patch.model } : {}),
      ...(patch.year !== undefined ? { year: patch.year } : {}),
      ...(patch.currentMileage !== undefined ? { current_mileage: patch.currentMileage } : {}),
    })
    .eq('id', id);
  throwIfError(error);
}

export async function deleteMotorcycleRow(id: string) {
  const { error } = await supabase.from('moto_motorcycles').delete().eq('id', id);
  throwIfError(error);
}

export async function insertMaintenanceItem(userId: string, motorcycleId: string, item: MaintenanceItem) {
  const { error } = await supabase.from('moto_maintenance_items').insert(itemToInsert(item, motorcycleId, userId));
  throwIfError(error);
}

export async function updateMaintenanceItemRow(id: string, item: MaintenanceItem) {
  const { error } = await supabase
    .from('moto_maintenance_items')
    .update({
      name: item.name,
      catalog_key: item.catalogKey,
      custom_type_id: item.customCatalogId,
      tracking_method: item.trackingMethod,
      last_maintenance_date: item.lastMaintenanceDate,
      last_maintenance_mileage: item.lastMaintenanceMileage,
      interval_value: item.intervalValue,
      interval_unit: item.intervalUnit,
      enabled: item.enabled,
    })
    .eq('id', id);
  throwIfError(error);
}

export async function deleteMaintenanceItemRow(id: string) {
  const { error } = await supabase.from('moto_maintenance_items').delete().eq('id', id);
  throwIfError(error);
}

export async function insertCustomType(userId: string, item: CustomCatalogItem) {
  const { error } = await supabase.from('moto_custom_maintenance_types').insert(customToInsert(item, userId));
  throwIfError(error);
}

export async function updateCustomTypeRow(id: string, name: string) {
  const { error } = await supabase.from('moto_custom_maintenance_types').update({ name }).eq('id', id);
  throwIfError(error);
}

export async function deleteCustomTypeRow(id: string) {
  const { error } = await supabase.from('moto_custom_maintenance_types').delete().eq('id', id);
  throwIfError(error);
}

export async function importAppState(userId: string, state: AppState) {
  if (state.customCatalogItems.length > 0) {
    const { error } = await supabase
      .from('moto_custom_maintenance_types')
      .upsert(state.customCatalogItems.map((item) => customToInsert(item, userId)), { onConflict: 'id' });
    throwIfError(error);
  }

  if (state.motorcycles.length > 0) {
    const { error } = await supabase
      .from('moto_motorcycles')
      .upsert(state.motorcycles.map((bike) => motorcycleToInsert(bike, userId)), { onConflict: 'id' });
    throwIfError(error);
  }

  const items = state.motorcycles.flatMap((bike) =>
    bike.maintenanceItems.map((item) => itemToInsert(item, bike.id, userId)),
  );
  if (items.length > 0) {
    const { error } = await supabase.from('moto_maintenance_items').upsert(items, { onConflict: 'id' });
    throwIfError(error);
  }
}
