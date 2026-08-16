import { createId } from '@/lib/utils';
import { importAppState } from '@/lib/api/remote';
import { hasLocalDataToImport, loadState } from '@/lib/persist';
import type { AppState, MaintenanceItem, Motorcycle } from '@/types/maintenance';

const IMPORT_FLAG_PREFIX = 'moto-maintenance:imported:';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asUuid(id: string): string {
  return UUID_RE.test(id) ? id : createId();
}

export function hasImportedForUser(userId: string): boolean {
  try {
    return localStorage.getItem(`${IMPORT_FLAG_PREFIX}${userId}`) === '1';
  } catch {
    return false;
  }
}

export function markImportedForUser(userId: string): void {
  try {
    localStorage.setItem(`${IMPORT_FLAG_PREFIX}${userId}`, '1');
  } catch {
    // ignore
  }
}

function remapLocalState(state: AppState): AppState {
  const customIdMap = new Map<string, string>();
  const customCatalogItems = state.customCatalogItems.map((item) => {
    const id = asUuid(item.id);
    customIdMap.set(item.id, id);
    return { ...item, id };
  });

  const motorcycles: Motorcycle[] = state.motorcycles.map((bike) => {
    const bikeId = asUuid(bike.id);
    const maintenanceItems: MaintenanceItem[] = bike.maintenanceItems.map((item) => ({
      ...item,
      id: asUuid(item.id),
      customCatalogId: item.customCatalogId ? (customIdMap.get(item.customCatalogId) ?? item.customCatalogId) : null,
    }));
    return { ...bike, id: bikeId, maintenanceItems };
  });

  return { version: 1, motorcycles, customCatalogItems };
}

export function shouldOfferImport(userId: string, remote: AppState): boolean {
  if (hasImportedForUser(userId)) return false;
  if (!hasLocalDataToImport()) return false;
  return remote.motorcycles.length === 0 && remote.customCatalogItems.length === 0;
}

export async function importLocalDataToSupabase(userId: string): Promise<void> {
  const remapped = remapLocalState(loadState());
  await importAppState(userId, remapped);
  markImportedForUser(userId);
}
