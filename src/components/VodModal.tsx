import React, { useState, useMemo } from 'react';
import { X, Search, Star, Play, Film, Clapperboard, Calendar, Clock } from 'lucide-react';
import { VodItem } from '../types/activation';

interface VodModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'movie' | 'series';
  items: VodItem[];
  onPlayVod: (item: VodItem) => void;
}

export const VodModal: React.FC<VodModalProps> = ({
  isOpen,
  onClose,
  type,
  items,
  onPlayVod,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<VodItem | null>(null);

  if (!isOpen) return null;

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('Todos');
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [items]);

  // Filter items
  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'Todos' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.synopsis.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${type === 'movie' ? 'bg-purple-600/20 text-purple-400' : 'bg-sky-600/20 text-sky-400'}`}>
              {type === 'movie' ? <Film className="w-6 h-6" /> : <Clapperboard className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {type === 'movie' ? 'Catálogo de Filmes (VOD)' : 'Catálogo de Séries'}
              </h3>
              <p className="text-xs text-slate-400">
                {filtered.length} títulos disponíveis em alta definição
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Buscar ${type === 'movie' ? 'filme' : 'série'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Posters */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              Nenhum título encontrado com os filtros atuais.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 hover:border-red-500/80 transition-all cursor-pointer flex flex-col hover:-translate-y-1 shadow-lg tv-focusable"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono text-amber-400 font-bold flex items-center gap-1 border border-white/10">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.rating}</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800/60">
                      <span>{item.year}</span>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col sm:flex-row">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full sm:w-1/3 aspect-[2/3] sm:aspect-auto relative shrink-0">
                <img
                  src={selectedItem.poster}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                      {selectedItem.category}
                    </span>
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedItem.rating}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedItem.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono my-2">
                    <span>{selectedItem.year}</span>
                    <span>•</span>
                    <span>{selectedItem.duration}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-3">
                    {selectedItem.synopsis}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <button
                    onClick={() => {
                      onPlayVod(selectedItem);
                      setSelectedItem(null);
                      onClose();
                    }}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-transform active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-white" /> Assistir Agora
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
