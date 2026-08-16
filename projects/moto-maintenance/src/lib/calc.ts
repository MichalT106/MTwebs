import type {
  DateIntervalUnit,
  MaintenanceItem,
  MaintenanceProjection,
  MaintenanceStatus,
} from '@/types/maintenance';
import { addDays, addMonths, addYears, daysBetween, parseIsoDate, startOfToday, toIsoDate } from '@/lib/utils';

const STATUS_RANK: Record<MaintenanceStatus, number> = {
  overdue: 0,
  due: 1,
  dueSoon: 2,
  ok: 3,
};

function statusFromRemaining(remaining: number, soonThreshold: number): MaintenanceStatus {
  if (remaining < 0) return 'overdue';
  if (remaining === 0) return 'due';
  if (remaining <= soonThreshold) return 'dueSoon';
  return 'ok';
}

function soonThreshold(intervalSize: number, cap: number): number {
  const tenPercent = intervalSize * 0.1;
  return Math.max(1, Math.min(cap, tenPercent));
}

function addInterval(last: Date, value: number, unit: DateIntervalUnit): Date {
  if (unit === 'years') return addYears(last, value);
  if (unit === 'months') return addMonths(last, value);
  return addDays(last, value);
}

export function projectMaintenance(
  item: MaintenanceItem,
  currentMileage: number,
  today = startOfToday(),
): MaintenanceProjection | null {
  if (item.trackingMethod === 'date') {
    if (!item.lastMaintenanceDate || item.intervalValue <= 0) return null;
    const unit: DateIntervalUnit =
      item.intervalUnit === 'years' || item.intervalUnit === 'months' ? item.intervalUnit : 'days';

    const last = parseIsoDate(item.lastMaintenanceDate);
    const next = addInterval(last, item.intervalValue, unit);
    const remainingDays = daysBetween(today, next);
    const intervalDays = Math.max(1, daysBetween(last, next));

    return {
      trackingMethod: 'date',
      lastDate: item.lastMaintenanceDate,
      nextDate: toIsoDate(next),
      remainingDays,
      intervalValue: item.intervalValue,
      intervalUnit: unit,
      status: statusFromRemaining(remainingDays, soonThreshold(intervalDays, 14)),
    };
  }

  if (item.lastMaintenanceMileage == null || item.intervalValue <= 0) return null;

  const nextMileage = item.lastMaintenanceMileage + item.intervalValue;
  const remainingKm = nextMileage - currentMileage;

  return {
    trackingMethod: 'mileage',
    lastMileage: item.lastMaintenanceMileage,
    nextMileage,
    remainingKm,
    intervalValue: item.intervalValue,
    intervalUnit: 'km',
    status: statusFromRemaining(remainingKm, soonThreshold(item.intervalValue, 500)),
  };
}

export function enabledItems(items: MaintenanceItem[]): MaintenanceItem[] {
  return items.filter((item) => item.enabled);
}

export function summarizeStatuses(
  items: MaintenanceItem[],
  currentMileage: number,
): Record<MaintenanceStatus, number> {
  const summary: Record<MaintenanceStatus, number> = {
    ok: 0,
    dueSoon: 0,
    due: 0,
    overdue: 0,
  };

  for (const item of enabledItems(items)) {
    const projection = projectMaintenance(item, currentMileage);
    if (projection) summary[projection.status] += 1;
  }

  return summary;
}

export function sortByUrgency(
  items: MaintenanceItem[],
  currentMileage: number,
): MaintenanceItem[] {
  return [...enabledItems(items)].sort((a, b) => {
    const pa = projectMaintenance(a, currentMileage);
    const pb = projectMaintenance(b, currentMileage);
    const ra = pa ? STATUS_RANK[pa.status] : 99;
    const rb = pb ? STATUS_RANK[pb.status] : 99;
    if (ra !== rb) return ra - rb;

    const remainingA = pa?.trackingMethod === 'date' ? pa.remainingDays : (pa?.remainingKm ?? 0);
    const remainingB = pb?.trackingMethod === 'date' ? pb.remainingDays : (pb?.remainingKm ?? 0);
    return remainingA - remainingB;
  });
}
