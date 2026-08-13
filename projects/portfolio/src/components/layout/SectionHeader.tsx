import { FadeIn } from '../ui/Motion';

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ label, title, description, align = 'left' }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl';

  return (
    <FadeIn className={`mb-12 ${alignClass}`}>
      {label && <p className="section-label mb-3">{label}</p>}
      <h2 className="section-heading">{title}</h2>
      {description && <p className="mt-4 prose-body">{description}</p>}
    </FadeIn>
  );
}
