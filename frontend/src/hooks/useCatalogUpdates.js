import { useEffect } from 'react';
import { useCatalogStore } from '../store/useCatalogStore.js';

export function useCatalogUpdates() {
  const refresh = useCatalogStore((state) => state.refresh);

  useEffect(() => {
    if (!window.EventSource) return undefined;

    const eventSource = new EventSource('/api/catalog-events');
    const handleUpdate = () => refresh();
    eventSource.addEventListener('catalog-update', handleUpdate);

    return () => {
      eventSource.removeEventListener('catalog-update', handleUpdate);
      eventSource.close();
    };
  }, [refresh]);
}
