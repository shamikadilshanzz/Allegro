'use client';

import { useState, useEffect, useMemo } from 'react';
import { SheetMusicFilters } from './SheetMusicFilters';
import { SheetMusicGrid } from './SheetMusicGrid';
import type { SheetMusic } from '@/lib/types';

export function SheetMusicClientPage() {
  const [sheetMusic, setSheetMusic] = useState<SheetMusic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [composerFilter, setComposerFilter] = useState('');

  // Fetch data dynamically from API at runtime
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sheet-music', { cache: 'no-store' });
        const data = await res.json();
        setSheetMusic(data);
      } catch (error) {
        console.error('Error fetching sheet music:', error);
      }
    }
    fetchData();
  }, []);

  // Apply filters
  const filteredItems = useMemo(() => {
    return sheetMusic.filter((item) => {
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
