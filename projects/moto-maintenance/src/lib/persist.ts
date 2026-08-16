import type { AppState, CustomCatalogItem, MaintenanceItem, Motorcycle } from '@/types/maintenance';
import { isPredefinedCatalogKey } from '@/lib/catalog';
import { createId } from '@/lib/utils';

export const STORAGE_KEY = 'moto-maintenance:v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function parseItem(value: unknown): MaintenanceItem | null {
  if (!isRecord(value)) return null;

  const trackingMethod = value.trackingMethod === 'date' || value.trackingMethod === 'mileage'
    ? value.trackingMethod
    : null;
  const intervalValue = asNumber(value.intervalValue);
  const intervalUnit =
    value.intervalUnit === 'days' ||
    value.intervalUnit === 'months' ||
    value.intervalUnit === 'years' ||
    value.intervalUnit === 'km'
      ? value.intervalUnit
      : null;
  const id = asString(value.id);
  const name = asString(value.name);

  if (!id || !name || !trackingMethod || intervalValue == null || !intervalUnit) return null;

  const catalogKey = asString(value.catalogKey);
  const resolvedKey = catalogKey && isPredefinedCatalogKey(catalogKey) ? catalogKey : 'custom';

  return {
    id,
    name,
    catalogKey: resolvedKey,
    customCatalogId: asString(value.customCatalogId),
    trackingMethod,
    lastMaintenanceDate: asString(value.lastMaintenanceDate),
    lastMaintenanceMileage: asNumber(value.lastMaintenanceMileage),
    intervalValue,
    intervalUnit,
    enabled: value.enabled !== false,
  };
}

function parseMotorcycle(value: unknown): Motorcycle | null {
  if (!isRecord(value)) return null;

  const id = asString(value.id);
  const manufacturer = asString(value.manufacturer);
  const model = asString(value.model);
  const year = asNumber(value.year);
  const currentMileage = asNumber(value.currentMileage);
  const createdAt = asNumber(value.createdAt) ?? Date.now();
  const updatedAt = asNumber(value.updatedAt) ?? createdAt;

  if (!id || !manufacturer || !model || year == null || currentMileage == null) return null;
  if (!Array.isArray(value.maintenanceItems)) return null;

  return {
    id,
    manufacturer,
    model,
    year,
    currentMileage,
    createdAt,
    updatedAt,
    maintenanceItems: value.maintenanceItems
      .map(parseItem)
      .filter((item): item is MaintenanceItem => item !== null),
  };
}

function parseCustomItem(value: unknown): CustomCatalogItem | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const name = asString(value.name)?.trim();
  if (!id || !name) return null;
  return { id, name };
}

function migrateLegacyCustomItems(
  motorcycles: Motorcycle[],
  customCatalogItems: CustomCatalogItem[],
): Pick<AppState, 'motorcycles' | 'customCatalogItems'> {
  const nextCustom = [...customCatalogItems];

  const nextMotorcycles = motorcycles.map((motorcycle) => ({
    ...motorcycle,
    maintenanceItems: motorcycle.maintenanceItems.map((item) => {
      if (item.catalogKey !== 'custom' || item.customCatalogId) return item;
      const existing = nextCustom.find(
        (entry) => entry.name.localeCompare(item.name, undefined, { sensitivity: 'accent' }) === 0,
      );
      if (existing) return { ...item, customCatalogId: existing.id };
      const created = { id: createId(), name: item.name };
      nextCustom.push(created);
      return { ...item, customCatalogId: created.id };
    }),
  }));

  return { motorcycles: nextMotorcycles, customCatalogItems: nextCustom };
}

export function createInitialState(): AppState {
  return { version: 1, motorcycles: [], customCatalogItems: [] };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();

    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || !Array.isArray(parsed.motorcycles)) {
      return createInitialState();
    }

    return loadStateFromRaw(parsed);
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

export function hasLocalDataToImport(): boolean {
  const state = loadState();
  return state.motorcycles.length > 0 || state.customCatalogItems.length > 0;
}

function cacheKey(userId: string): string {
  return `moto-maintenance:cache:${userId}`;
}

export function loadCachedState(userId: string): AppState | null {
  try {
    const raw = localStorage.getItem(cacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed) || !Array.isArray(parsed.motorcycles)) return null;
    return loadStateFromRaw(parsed);
  } catch {
    return null;
  }
}

export function saveCachedState(userId: string, state: AppState): void {
  try {
    localStorage.setItem(cacheKey(userId), JSON.stringify(state));
  } catch {
    // ignore
  }
}

function loadStateFromRaw(parsed: Record<string, unknown>): AppState {
  const motorcycles = Array.isArray(parsed.motorcycles)
    ? parsed.motorcycles.map(parseMotorcycle).filter((bike): bike is Motorcycle => bike !== null)
    : [];
  const customCatalogItems = Array.isArray(parsed.customCatalogItems)
    ? parsed.customCatalogItems
        .map(parseCustomItem)
        .filter((item): item is CustomCatalogItem => item !== null)
    : [];
  return { version: 1, ...migrateLegacyCustomItems(motorcycles, customCatalogItems) };
}
