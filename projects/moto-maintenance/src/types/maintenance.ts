export type TrackingMethod = 'date' | 'mileage';

export type DateIntervalUnit = 'days' | 'months' | 'years';

export type IntervalUnit = DateIntervalUnit | 'km';

export type MaintenanceStatus = 'ok' | 'dueSoon' | 'due' | 'overdue';

export type CatalogCategory =
  | 'engine'
  | 'fluids'
  | 'brakes'
  | 'tires'
  | 'drivetrain'
  | 'suspension'
  | 'electrical'
  | 'controls'
  | 'general';

export type CatalogKey =
  | 'engine_oil'
  | 'oil_filter'
  | 'air_filter'
  | 'spark_plugs'
  | 'coolant'
  | 'brake_fluid'
  | 'clutch_fluid'
  | 'front_brake_pads'
  | 'rear_brake_pads'
  | 'front_brake_disc'
  | 'rear_brake_disc'
  | 'front_tire'
  | 'rear_tire'
  | 'chain'
  | 'chain_lubrication'
  | 'chain_and_sprockets'
  | 'battery'
  | 'valve_clearance'
  | 'fork_oil'
  | 'fork_seals'
  | 'brake_lines'
  | 'clutch_cable'
  | 'throttle_cable'
  | 'drive_belt'
  | 'final_drive_oil'
  | 'wheel_bearings'
  | 'steering_head_bearings'
  | 'suspension'
  | 'general_inspection'
  | 'custom';

export interface CustomCatalogItem {
  id: string;
  name: string;
}

export interface MaintenanceItem {
  id: string;
  name: string;
  catalogKey: CatalogKey;
  customCatalogId: string | null;
  trackingMethod: TrackingMethod;
  lastMaintenanceDate: string | null;
  lastMaintenanceMileage: number | null;
  intervalValue: number;
  intervalUnit: IntervalUnit;
  enabled: boolean;
}

export interface Motorcycle {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  currentMileage: number;
  createdAt: number;
  updatedAt: number;
  maintenanceItems: MaintenanceItem[];
}

export interface AppState {
  version: 1;
  motorcycles: Motorcycle[];
  customCatalogItems: CustomCatalogItem[];
}

export interface MotorcycleInput {
  manufacturer: string;
  model: string;
  year: number;
  currentMileage: number;
}

export interface MaintenanceItemInput {
  name: string;
  catalogKey: CatalogKey;
  customCatalogId: string | null;
  trackingMethod: TrackingMethod;
  lastMaintenanceDate: string | null;
  lastMaintenanceMileage: number | null;
  intervalValue: number;
  intervalUnit: IntervalUnit;
}

export interface DateProjection {
  trackingMethod: 'date';
  lastDate: string;
  nextDate: string;
  remainingDays: number;
  intervalValue: number;
  intervalUnit: DateIntervalUnit;
  status: MaintenanceStatus;
}

export interface MileageProjection {
  trackingMethod: 'mileage';
  lastMileage: number;
  nextMileage: number;
  remainingKm: number;
  intervalValue: number;
  intervalUnit: 'km';
  status: MaintenanceStatus;
}

export type MaintenanceProjection = DateProjection | MileageProjection;
