import { type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useSectionNavigation, type SectionId } from '../hooks/useSectionNavigation';

interface SectionLinkProps {
  sectionId: SectionId;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
}

export function SectionLink({ sectionId, className, children, onNavigate }: SectionLinkProps) {
  const { scrollToSection, isHome } = useSectionNavigation();

  const handleClick = (e: MouseEvent) => {
    onNavigate?.();
    scrollToSection(sectionId, e);
  };

  if (isHome) {
    return (
      <a href={`#${sectionId}`} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={{ pathname: '/', hash: `#${sectionId}` }} onClick={onNavigate} className={className}>
      {children}
    </Link>
  );
}
