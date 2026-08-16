import type { MaintenanceStatus } from '@/types/maintenance';
import { useLocale } from '@/context/LocaleContext';
import { cn } from '@/lib/utils';

const STATUS_CLASS: Record<MaintenanceStatus, string> = {
  ok: 'bg-accent-emerald-muted text-accent-emerald',
  dueSoon: 'bg-warning-muted text-warning',
  due: 'bg-warning-muted text-warning ring-1 ring-warning/40',
  overdue: 'bg-danger-muted text-danger',
};

const STATUS_KEY = {
  ok: 'status.ok',
  dueSoon: 'status.dueSoon',
  due: 'status.due',
  overdue: 'status.overdue',
} as const;

export function StatusBadge({ status }: { status: MaintenanceStatus }) {
  const { t } = useLocale();
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide',
        STATUS_CLASS[status],
      )}
    >
      {t(STATUS_KEY[status])}
    </span>
  );
}

export function CountBadge({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: MaintenanceStatus;
}) {
  return (
    <div className={cn('rounded-2xl border border-border px-4 py-3', STATUS_CLASS[tone])}>
      <p className="text-2xl font-bold leading-none">{count}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
    </div>
  );
}
