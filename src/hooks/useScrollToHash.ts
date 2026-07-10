import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToSectionId } from '@/lib/scrollToSection';

/** Scrolls to the section referenced by the URL hash whenever it changes — used to land on
 *  the right section after a cross-page nav click routes here via `/#section`. */
export const useScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    scrollToSectionId(hash.slice(1));
  }, [hash]);
};
