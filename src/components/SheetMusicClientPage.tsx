'use client';

import { useEffect, useState, useMemo } from 'react';
import { SheetMusicFilters } from './SheetMusicFilters';
import { SheetMusicGrid } from './SheetMusicGrid';
import type { SheetMusic } from '@/lib/types';

export function SheetMusicClientPage() {
  const [sheetMusic, setSheetMusic] = useState<SheetMusic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [composerFilter, setComposerFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/sheet-music', { cache: 'no-store' });
      const data = await res.json();
      setSheetMusic(data);
    }
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    return sheetMusic.filter(item => {
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const instrumentMatch = instrumentFilter ? item.instrument === instrumentFilter : true;
      const composerMatch = composerFilter ? item.composer === composerFilter : true;
      return searchMatch && instrumentMatch && composerMatch;
    });
  }, [sheetMusic, searchQuery, instrumentFilter, composerFilter]);

  return (
    <div>
      <SheetMusicFilters
        onSearchChange={setSearchQuery}
        onInstrumentChange={setInstrumentFilter}
        onComposerChange={setComposerFilter}
      />
      <SheetMusicGrid items={filteredItems} />
    </div>
  );
}
