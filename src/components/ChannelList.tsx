import React, { useState, useMemo } from 'react';
import { Search, Star, Tv, LayoutGrid, List, Play, Radio, Sparkles } from 'lucide-react';
import { Channel } from '../types/iptv';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  categories: string[];
  isTvMode: boolean;
}

export const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  favorites,
  onToggleFavorite,
  categories,
  isTvMode,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter channels
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // Category filter
      if (activeCategory === 'Favoritos') {
        if (!favorites.includes(ch.id)) return false;
      } else if (activeCategory !== 'Todos') {
        if (ch.category !== activeCategory && ch.groupTitle !== activeCategory) {
          return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = ch.name.toLowerCase().includes(query);
        const matchesCat = ch.category?.toLowerCase().includes(query);
        const matchesProg = ch.currentProgram?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesProg) return false;
      }

      return true;
    });
  }, [channels, activeCategory, searchQuery, favorites]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: channels.length,
      Favoritos: favorites.length,
    };
    channels.forEach((ch) => {
      const cat = ch.category || 'Geral';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [channels, favorites]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar canal, emissora ou programa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              Limpar
            </button>
          )}
        </div>

        {/* View switcher and stats */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-xs text-slate-400">
            <strong className="text-slate-200 font-mono">{filteredChannels.length}</strong> canais
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Visualização em Lista Compacta"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs (Interactive buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 border border-slate-800/70 hover:border-slate-700'
              }`}
            >
              {cat === 'Favoritos' && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
              <span>{cat}</span>
              <span className={`text-[10px] font-mono ${isActive ? 'text-sky-200' : 'text-slate-500'}`}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Channels Display */}
      {filteredChannels.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center">
          <Tv className="w-10 h-10 text-slate-600 mb-3" />
          <h4 className="text-sm font-semibold text-slate-200 mb-1">Nenhum canal encontrado</h4>
          <p className="text-xs text-slate-500 max-w-xs mb-4">
            Tente mudar a categoria ou termo de busca, ou adicione canais através da sua lista M3U.
          </p>
          {activeCategory !== 'Todos' && (
            <button
              onClick={() => {
                setActiveCategory('Todos');
                setSearchQuery('');
              }}
              className="text-xs text-sky-400 hover:underline"
            >
              Voltar para todos os canais
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredChannels.map((channel, idx) => {
            const isSelected = selectedChannel?.id === channel.id;
            const isFav = favorites.includes(channel.id);

            return (
              <div
                key={channel.id}
                tabIndex={0}
                onClick={() => onSelectChannel(channel)}
                className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-200 cursor-pointer tv-focusable ${
                  isSelected
                    ? 'bg-sky-950/40 border-2 border-sky-500 shadow-lg shadow-sky-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Channel Preview Banner / Logo */}
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <Tv className="w-8 h-8 text-sky-400/70" />
                    </div>
                  )}

                  {/* Channel Number Badge */}
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono text-slate-300 font-bold border border-white/10">
                    #{idx + 1}
                  </span>

                  {/* Favorite button on card */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(channel.id);
                    }}
                    className={`absolute top-2 right-2 p-1.5 rounded-md backdrop-blur-md transition-colors ${
                      isFav 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                        : 'bg-black/60 text-slate-400 hover:text-white border border-white/10 opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* Playing Equalizer Overlay if selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-sky-950/60 backdrop-blur-xs flex items-center justify-center gap-1">
                      <span className="w-1 h-5 bg-sky-400 animate-pulse"></span>
                      <span className="w-1 h-7 bg-sky-400 animate-pulse delay-75"></span>
                      <span className="w-1 h-3 bg-sky-400 animate-pulse delay-150"></span>
                      <span className="text-xs font-mono font-bold text-white ml-1">TOCANDO</span>
                    </div>
                  )}
                </div>

                {/* Channel Details */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100 truncate group-hover:text-sky-400 transition-colors">
                      {channel.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <Radio className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                      <span>{channel.currentProgram || channel.category}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60 font-mono">
                    <span className="truncate max-w-[90px]">{channel.category}</span>
                    {channel.resolution && (
                      <span className="text-sky-400">{channel.resolution}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="flex flex-col gap-1.5">
          {filteredChannels.map((channel, idx) => {
            const isSelected = selectedChannel?.id === channel.id;
            const isFav = favorites.includes(channel.id);

            return (
              <div
                key={channel.id}
                tabIndex={0}
                onClick={() => onSelectChannel(channel)}
                className={`group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer tv-focusable ${
                  isSelected
                    ? 'bg-sky-950/40 border border-sky-500 text-white shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] font-mono font-bold text-slate-500 w-6 text-center">
                    {idx + 1}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center border border-slate-800">
                    {channel.logo ? (
                      <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
                    ) : (
                      <Tv className="w-4 h-4 text-sky-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
                      <span>{channel.name}</span>
                      {isSelected && (
                        <span className="text-[9px] font-mono text-sky-400 bg-sky-950 px-1 rounded border border-sky-800">
                          AO VIVO
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                      <span>{channel.currentProgram || channel.category}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500">{channel.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {channel.resolution && (
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {channel.resolution}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(channel.id);
                    }}
                    className={`p-1.5 rounded-md transition-colors ${
                      isFav ? 'text-amber-400' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
