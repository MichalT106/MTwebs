import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { createId, todayIsoDate } from '@/lib/utils';
import { createInitialState, loadState, saveState } from '@/lib/persist';
import type {
  AppState,
  CustomCatalogItem,
  MaintenanceItem,
  MaintenanceItemInput,
  Motorcycle,
  MotorcycleInput,
} from '@/types/maintenance';

type Action =
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
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    if (typeof window === 'undefined') return createInitialState();
    return loadState();
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const getMotorcycle = useCallback(
    (id: string) => state.motorcycles.find((motorcycle) => motorcycle.id === id),
    [state.motorcycles],
  );

  const addMotorcycle = useCallback((input: MotorcycleInput) => {
    const now = Date.now();
    const motorcycle: Motorcycle = {
      ...input,
      id: createId(),
      createdAt: now,
      updatedAt: now,
      maintenanceItems: [],
    };
    dispatch({ type: 'ADD_MOTORCYCLE', motorcycle });
    return motorcycle.id;
  }, []);

  const updateMotorcycle = useCallback((id: string, input: MotorcycleInput) => {
    dispatch({ type: 'UPDATE_MOTORCYCLE', id, patch: input });
  }, []);

  const deleteMotorcycle = useCallback((id: string) => {
    dispatch({ type: 'DELETE_MOTORCYCLE', id });
  }, []);

  const updateMileage = useCallback((id: string, currentMileage: number) => {
    dispatch({ type: 'UPDATE_MOTORCYCLE', id, patch: { currentMileage } });
  }, []);

  const addMaintenanceItem = useCallback((motorcycleId: string, input: MaintenanceItemInput) => {
    dispatch({
      type: 'ADD_ITEM',
      motorcycleId,
      item: { ...input, id: createId(), enabled: true },
    });
  }, []);

  const updateMaintenanceItem = useCallback(
    (motorcycleId: string, itemId: string, input: MaintenanceItemInput) => {
      dispatch({ type: 'UPDATE_ITEM', motorcycleId, itemId, patch: input });
    },
    [],
  );

  const deleteMaintenanceItem = useCallback((motorcycleId: string, itemId: string) => {
    dispatch({ type: 'DELETE_ITEM', motorcycleId, itemId });
  }, []);

  const completeMaintenanceItem = useCallback(
    (
      motorcycleId: string,
      itemId: string,
      override?: { lastMaintenanceDate?: string; lastMaintenanceMileage?: number },
    ) => {
      dispatch({ type: 'COMPLETE_ITEM', motorcycleId, itemId, ...override });
    },
    [],
  );

  const addCustomCatalogItem = useCallback((name: string) => {
    const item = { id: createId(), name: name.trim() };
    dispatch({ type: 'ADD_CUSTOM', item });
    return item;
  }, []);

  const updateCustomCatalogItem = useCallback((id: string, name: string) => {
    dispatch({ type: 'UPDATE_CUSTOM', id, name: name.trim() });
  }, []);

  const deleteCustomCatalogItem = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CUSTOM', id });
  }, []);

  const value = useMemo(
    () => ({
      motorcycles: state.motorcycles,
      customCatalogItems: state.customCatalogItems,
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

  return <MaintenanceContext.Provider value={value}>{children}</MaintenanceContext.Provider>;
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (!context) throw new Error('useMaintenance must be used within MaintenanceProvider');
  return context;
}
