import { useCallback, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type SectionId = 'experience' | 'projects';

export function useSectionNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToSection = useCallback(
    (sectionId: SectionId, e?: MouseEvent) => {
      e?.preventDefault();

      if (isHome && location.hash === `#${sectionId}`) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      navigate({ pathname: '/', hash: `#${sectionId}` });
    },
    [isHome, location.hash, navigate],
  );

  const goHomeTop = useCallback(
    (e?: MouseEvent) => {
      if (!isHome) return;

      e?.preventDefault();

      if (location.hash) {
        navigate('/', { replace: true });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [isHome, location.hash, navigate],
  );

  return { scrollToSection, goHomeTop, isHome };
}
