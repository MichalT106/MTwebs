import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';
import { FadeIn } from '../ui/Motion';
import { useTranslation } from '../../hooks/useTranslation';

interface DetailPageLayoutProps {
  title: string;
  children: ReactNode;
  sidebar?: ReactNode;
  backLabel?: string;
}

export function DetailPageLayout({ title, children, sidebar, backLabel }: DetailPageLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="pb-20">
      <div className="detail-hero pt-[5.5rem] pb-6 sm:pb-8">
        <div className="relative mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-fg-muted transition-colors duration-150 hover:text-accent"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {backLabel ?? t('nav.home')}
            </Link>
            <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-fg sm:text-4xl lg:text-5xl">
              {title}
            </h1>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-10 ${sidebar ? 'lg:grid-cols-[1fr_380px] lg:gap-14 xl:grid-cols-[1fr_420px]' : 'max-w-4xl'}`}>
          <div className="min-w-0 space-y-6">{children}</div>
          {sidebar && (
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">{sidebar}</aside>
          )}
        </div>
      </div>
    </div>
  );
}

export function ContentBlock({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <article className={`panel p-6 sm:p-8 ${className}`}>{children}</article>;
}

export function BlockTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-border pb-3 text-xl font-semibold text-fg sm:text-2xl">
      {children}
    </h2>
  );
}
