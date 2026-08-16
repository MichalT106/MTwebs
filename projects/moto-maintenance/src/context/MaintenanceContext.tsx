import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { ImportLocalDialog } from '@/components/auth/ImportLocalDialog';
import { useAuth } from '@/context/AuthContext';
import {
  deleteCustomTypeRow,
  deleteMaintenanceItemRow,
  deleteMotorcycleRow,
  fetchAppState,
  insertCustomType,
  insertMaintenanceItem,
  insertMotorcycle,
  updateCustomTypeRow,
  updateMaintenanceItemRow,
  updateMotorcycleRow,
} from '@/lib/api/remote';
import { shouldOfferImport } from '@/lib/api/import-local';
import { createInitialState, loadCachedState, saveCachedState } from '@/lib/persist';
import { supabase } from '@/lib/supabase';
import { createId, todayIsoDate } from '@/lib/utils';
import type {
  AppState,
  CustomCatalogItem,
  MaintenanceItem,
  MaintenanceItemInput,
  Motorcycle,
  MotorcycleInput,
} from '@/types/maintenance';

export type SyncStatus = 'synced' | 'syncing' | 'offline';

type Action =
  | { type: 'SET_STATE'; state: AppState }
  | { type: 'ADD_MOTORCYCLE'; motorcycle: Motorcycle }
  | { type: 'UPDATE_MOTORCYCLE'; id: string; patch: Partial<Omit<Motorcycle, 'id' | 'maintenanceItems'>> }
  | { type: 'DELETE_MOTORCYCLE'; id: string }
  | { type: 'ADD_ITEM'; motorcycleId: string; item: MaintenanceItem }
  | { type: 'UPDATE_ITEM'; motorcycleId: string; itemId: string; patch: Partial<MaintenanceItem> }
  | { type: 'DELETE_ITEM'; motorcycleId: string; itemId: string }
  | {
      type: 'COMPLETE_ITEM';
      motorcycleId: string;
      itemId: string;
      lastMaintenanceDate?: string;
      lastMaintenanceMileage?: number;
    }
  | { type: 'ADD_CUSTOM'; item: CustomCatalogItem }
  | { type: 'UPDATE_CUSTOM'; id: string; name: string }
  | { type: 'DELETE_CUSTOM'; id: string };

function touchMotorcycle(motorcycle: Motorcycle, patch: Partial<Motorcycle> = {}): Motorcycle {
  return { ...motorcycle, ...patch, updatedAt: Date.now() };
}

function mapMotorcycle(
  state: AppState,
  id: string,
  updater: (motorcycle: Motorcycle) => Motorcycle,
): AppState {
  return {
    ...state,
    motorcycles: state.motorcycles.map((motorcycle) =>
      motorcycle.id === id ? updater(motorcycle) : motorcycle,
    ),
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.state;
    case 'ADD_MOTORCYCLE':
      return { ...state, motorcycles: [...state.motorcycles, action.motorcycle] };
    case 'UPDATE_MOTORCYCLE':
      return mapMotorcycle(state, action.id, (motorcycle) => touchMotorcycle(motorcycle, action.patch));
    case 'DELETE_MOTORCYCLE':
      return { ...state, motorcycles: state.motorcycles.filter((motorcycle) => motorcycle.id !== action.id) };
    case 'ADD_ITEM':
      return mapMotorcycle(state, action.motorcycleId, (motorcycle) =>
        touchMotorcycle(motorcycle, {
          maintenanceItems: [...motorcycle.maintenanceItems, action.item],
        }),
      );
    case 'UPDATE_ITEM':
      return mapMotorcycle(state, action.motorcycleId, (motorcycle) =>
        touchMotorcycle(motorcycle, {
          maintenanceItems: motorcycle.maintenanceItems.map((item) =>
            item.id === action.itemId ? { ...item, ...action.patch } : item,
          ),
        }),
      );
    case 'DELETE_ITEM':
      return mapMotorcycle(state, action.motorcycleId, (motorcycle) =>
        touchMotorcycle(motorcycle, {
          maintenanceItems: motorcycle.maintenanceItems.filter((item) => item.id !== action.itemId),
        }),
      );
    case 'COMPLETE_ITEM':
      return mapMotorcycle(state, action.motorcycleId, (motorcycle) =>
        touchMotorcycle(motorcycle, {
          maintenanceItems: motorcycle.maintenanceItems.map((item) => {
            if (item.id !== action.itemId) return item;
            if (item.trackingMethod === 'date') {
              return { ...item, lastMaintenanceDate: action.lastMaintenanceDate ?? todayIsoDate() };
            }
            return {
              ...item,
              lastMaintenanceMileage: action.lastMaintenanceMileage ?? motorcycle.currentMileage,
            };
          }),
        }),
      );
    case 'ADD_CUSTOM':
      return { ...state, customCatalogItems: [...state.customCatalogItems, action.item] };
    case 'UPDATE_CUSTOM':
      return {
        ...state,
        customCatalogItems: state.customCatalogItems.map((item) =>
          item.id === action.id ? { ...item, name: action.name } : item,
        ),
        motorcycles: state.motorcycles.map((motorcycle) => ({
          ...motorcycle,
          maintenanceItems: motorcycle.maintenanceItems.map((item) =>
            item.customCatalogId === action.id ? { ...item, name: action.name } : item,
          ),
        })),
      };
    case 'DELETE_CUSTOM':
      return {
        ...state,
        customCatalogItems: state.customCatalogItems.filter((item) => item.id !== action.id),
      };
    default:
      return state;
  }
}

interface MaintenanceContextValue {
  motorcycles: Motorcycle[];
  customCatalogItems: CustomCatalogItem[];
  loading: boolean;
  syncStatus: SyncStatus;
  syncError: string | null;
  getMotorcycle: (id: string) => Motorcycle | undefined;
  addMotorcycle: (input: MotorcycleInput) => string;
  updateMotorcycle: (id: string, input: MotorcycleInput) => void;
  deleteMotorcycle: (id: string) => void;
  updateMileage: (id: string, currentMileage: number) => void;
  addMaintenanceItem: (motorcycleId: string, input: MaintenanceItemInput) => void;
  updateMaintenanceItem: (motorcycleId: string, itemId: string, input: MaintenanceItemInput) => void;
  deleteMaintenanceItem: (motorcycleId: string, itemId: string) => void;
  completeMaintenanceItem: (
    motorcycleId: string,
    itemId: string,
    override?: { lastMaintenanceDate?: string; lastMaintenanceMileage?: number },
  ) => void;
  addCustomCatalogItem: (name: string) => CustomCatalogItem;
  updateCustomCatalogItem: (id: string, name: string) => void;
  deleteCustomCatalogItem: (id: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextValue | null>(null);

export function MaintenanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('syncing');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const persistOk = useCallback(() => {
    setSyncStatus('synced');
    setSyncError(null);
    if (userId) saveCachedState(userId, stateRef.current);
  }, [userId]);

  const persistFail = useCallback((error: unknown) => {
    setSyncStatus('offline');
    setSyncError(error instanceof Error ? error.message : 'Sync failed');
    if (userId) saveCachedState(userId, stateRef.current);
  }, [userId]);

  const run = useCallback(
    async (operation: () => Promise<void>) => {
      setSyncStatus('syncing');
      try {
        await operation();
        persistOk();
      } catch (error) {
        persistFail(error);
      }
    },
    [persistFail, persistOk],
  );

  const loadRemote = useCallback(async () => {
    if (!userId) return;
    setSyncStatus('syncing');
    try {
      const remote = await fetchAppState(userId);
      dispatch({ type: 'SET_STATE', state: remote });
      saveCachedState(userId, remote);
      setSyncStatus('synced');
      setSyncError(null);
      if (shouldOfferImport(userId, remote)) setImportOpen(true);
    } catch (error) {
      const cached = loadCachedState(userId);
      if (cached) dispatch({ type: 'SET_STATE', state: cached });
      persistFail(error);
    } finally {
      setLoading(false);
    }
  }, [persistFail, userId]);

  useEffect(() => {
    if (!userId) {
      dispatch({ type: 'SET_STATE', state: createInitialState() });
      setLoading(false);
      return;
    }
    const cached = loadCachedState(userId);
    if (cached) dispatch({ type: 'SET_STATE', state: cached });
    setLoading(true);
    void loadRemote();
  }, [loadRemote, userId]);

  useEffect(() => {
    if (!userId) return;
    let timer: number | undefined;
    const channel = supabase
      .channel(`moto-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'moto_motorcycles', filter: `user_id=eq.${userId}` }, () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => void loadRemote(), 400);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'moto_maintenance_items', filter: `user_id=eq.${userId}` }, () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => void loadRemote(), 400);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'moto_custom_maintenance_types', filter: `user_id=eq.${userId}` }, () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => void loadRemote(), 400);
      })
      .subscribe();

    const onOnline = () => void loadRemote();
    window.addEventListener('online', onOnline);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('online', onOnline);
      void supabase.removeChannel(channel);
    };
  }, [loadRemote, userId]);

  const getMotorcycle = useCallback(
    (id: string) => state.motorcycles.find((motorcycle) => motorcycle.id === id),
    [state.motorcycles],
  );

  const addMotorcycle = useCallback(
    (input: MotorcycleInput) => {
      const now = Date.now();
      const motorcycle: Motorcycle = {
        ...input,
        id: createId(),
        createdAt: now,
        updatedAt: now,
        maintenanceItems: [],
      };
      dispatch({ type: 'ADD_MOTORCYCLE', motorcycle });
      if (userId) void run(() => insertMotorcycle(userId, motorcycle));
      return motorcycle.id;
    },
    [run, userId],
  );

  const updateMotorcycle = useCallback(
    (id: string, input: MotorcycleInput) => {
      dispatch({ type: 'UPDATE_MOTORCYCLE', id, patch: input });
      void run(() => updateMotorcycleRow(id, input));
    },
    [run],
  );

  const deleteMotorcycle = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_MOTORCYCLE', id });
      void run(() => deleteMotorcycleRow(id));
    },
    [run],
  );

  const updateMileage = useCallback(
    (id: string, currentMileage: number) => {
      dispatch({ type: 'UPDATE_MOTORCYCLE', id, patch: { currentMileage } });
      void run(() => updateMotorcycleRow(id, { currentMileage }));
    },
    [run],
  );

  const addMaintenanceItem = useCallback(
    (motorcycleId: string, input: MaintenanceItemInput) => {
      const item: MaintenanceItem = { ...input, id: createId(), enabled: true };
      dispatch({ type: 'ADD_ITEM', motorcycleId, item });
      if (userId) void run(() => insertMaintenanceItem(userId, motorcycleId, item));
    },
    [run, userId],
  );

  const updateMaintenanceItem = useCallback(
    (motorcycleId: string, itemId: string, input: MaintenanceItemInput) => {
      dispatch({ type: 'UPDATE_ITEM', motorcycleId, itemId, patch: input });
      const next = { ...input, id: itemId, enabled: true };
      void run(() => updateMaintenanceItemRow(itemId, next));
    },
    [run],
  );

  const deleteMaintenanceItem = useCallback(
    (motorcycleId: string, itemId: string) => {
      dispatch({ type: 'DELETE_ITEM', motorcycleId, itemId });
      void run(() => deleteMaintenanceItemRow(itemId));
    },
    [run],
  );

  const completeMaintenanceItem = useCallback(
    (
      motorcycleId: string,
      itemId: string,
      override?: { lastMaintenanceDate?: string; lastMaintenanceMileage?: number },
    ) => {
      dispatch({ type: 'COMPLETE_ITEM', motorcycleId, itemId, ...override });
      const bike = stateRef.current.motorcycles.find((entry) => entry.id === motorcycleId);
      const item = bike?.maintenanceItems.find((entry) => entry.id === itemId);
      if (!item) return;
      const completed: MaintenanceItem =
        item.trackingMethod === 'date'
          ? { ...item, lastMaintenanceDate: override?.lastMaintenanceDate ?? todayIsoDate() }
          : { ...item, lastMaintenanceMileage: override?.lastMaintenanceMileage ?? bike?.currentMileage ?? 0 };
      void run(() => updateMaintenanceItemRow(itemId, completed));
    },
    [run],
  );

  const addCustomCatalogItem = useCallback(
    (name: string) => {
      const item = { id: createId(), name: name.trim() };
      dispatch({ type: 'ADD_CUSTOM', item });
      if (userId) void run(() => insertCustomType(userId, item));
      return item;
    },
    [run, userId],
  );

  const updateCustomCatalogItem = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      dispatch({ type: 'UPDATE_CUSTOM', id, name: trimmed });
      void run(() => updateCustomTypeRow(id, trimmed));
    },
    [run],
  );

  const deleteCustomCatalogItem = useCallback(
    (id: string) => {
      dispatch({ type: 'DELETE_CUSTOM', id });
      void run(() => deleteCustomTypeRow(id));
    },
    [run],
  );

  const value = useMemo(
    () => ({
      motorcycles: state.motorcycles,
      customCatalogItems: state.customCatalogItems,
      loading,
      syncStatus,
      syncError,
      getMotorcycle,
      addMotorcycle,
      updateMotorcycle,
      deleteMotorcycle,
      updateMileage,
      addMaintenanceItem,
      updateMaintenanceItem,
      deleteMaintenanceItem,
      completeMaintenanceItem,
      addCustomCatalogItem,
      updateCustomCatalogItem,
      deleteCustomCatalogItem,
    }),
    [
      state.motorcycles,
      state.customCatalogItems,
      loading,
      syncStatus,
      syncError,
      getMotorcycle,
      addMotorcycle,
      updateMotorcycle,
      deleteMotorcycle,
      updateMileage,
      addMaintenanceItem,
      updateMaintenanceItem,
      deleteMaintenanceItem,
      completeMaintenanceItem,
      addCustomCatalogItem,
      updateCustomCatalogItem,
      deleteCustomCatalogItem,
    ],
  );

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
      {userId ? (
        <ImportLocalDialog
          open={importOpen}
          userId={userId}
          onComplete={() => {
            setImportOpen(false);
            void loadRemote();
          }}
          onDismiss={() => setImportOpen(false)}
        />
      ) : null}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) throw new Error('useMaintenance must be used within MaintenanceProvider');
  return context;
}
