'use client';

import { useState, useMemo } from 'react';
import { SheetMusicFilters } from './SheetMusicFilters';
import { SheetMusicGrid } from './SheetMusicGrid';
import { RecommendationTool } from './RecommendationTool';
import type { SheetMusic } from '@/lib/types';

interface SheetMusicClientPageProps {
  initialItems: SheetMusic[];
}

export function SheetMusicClientPage({ initialItems }: SheetMusicClientPageProps) {
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [instrumentFilter, setInstrumentFilter] = useState('');
  const [composerFilter, setComposerFilter] = useState('');

  const handleNewMusic = (newItem: SheetMusic) => {
    setItems(prev => [newItem, ...prev]); // Add to beginning of list
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const instrumentMatch = instrumentFilter ? item.instrument === instrumentFilter : true;
      const composerMatch = composerFilter ? item.composer === composerFilter : true;
      return searchMatch && instrumentMatch && composerMatch;
    });
  }, [items, searchQuery, instrumentFilter, composerFilter]);

  return (
    <div>
      <RecommendationTool onMusicAdded={handleNewMusic} />
      
      <SheetMusicFilters
        onSearchChange={setSearchQuery}
        onInstrumentChange={setInstrumentFilter}
        onComposerChange={setComposerFilter}
      />
      <SheetMusicGrid items={filteredItems} />
    </div>
  );
}