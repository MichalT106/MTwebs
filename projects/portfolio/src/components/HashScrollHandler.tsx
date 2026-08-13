import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function HashScrollHandler() {
  const { hash, pathname } = useLocation();
  const navigate = useNavigate();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');

      if (id === 'school-projects') {
        navigate({ pathname, hash: '#projects' }, { replace: true });
        return;
      }

      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      prevPathname.current = pathname;
      return () => window.clearTimeout(timer);
    }

    if (prevPathname.current !== pathname) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    prevPathname.current = pathname;
  }, [hash, pathname, navigate]);

  return null;
}
