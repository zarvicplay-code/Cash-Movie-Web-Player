import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, Search, Star, Tv, Calendar, Sliders, Key,
  ChevronLeft, ChevronRight, LayoutGrid, MonitorPlay, Film, Clapperboard,
  Sparkles, Check, Radio
} from 'lucide-react';
import { Channel, PlayerSettings } from '../types/iptv';
import { VideoPlayer } from './VideoPlayer';
import { CashMovieLogo } from './CashMovieLogo';
import { getMockEpgForChannel } from '../data/defaultChannels';

interface IboLiveTvViewProps {
  channels: Channel[];
  selectedChannel: Channel;
  onSelectChannel: (channel: Channel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  onBackToDashboard: () => void;
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
  onNextChannel: () => void;
  onPrevChannel: () => void;
  onOpenEpg: () => void;
  onOpenActivation: () => void;
  onOpenMovies?: () => void;
  onOpenSeries?: () => void;
}

export const IboLiveTvView: React.FC<IboLiveTvViewProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  favorites,
  onToggleFavorite,
  onBackToDashboard,
  settings,
  onUpdateSettings,
  onNextChannel,
  onPrevChannel,
  onOpenEpg,
  onOpenActivation,
  onOpenMovies,
  onOpenSeries,
}) => {
  // Mode: 'grid' (Blink Player m3u-live-tv) or 'player' (Blink Player m3u-live-main)
  const [viewMode, setViewMode] = useState<'grid' | 'player'>('grid');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [channelSearch, setChannelSearch] = useState<string>('');

  // Extract all categories with count
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {
      'Todos': channels.length,
      'Favoritos': favorites.length,
    };
    const catSet = new Set<string>();

    channels.forEach((ch) => {
      const cat = ch.category || ch.groupTitle || 'Geral';
      catSet.add(cat);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return {
      categories: ['Todos', 'Favoritos', ...Array.from(catSet)],
      categoryCounts: counts,
    };
  }, [channels, favorites]);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase();
    return categories.filter((cat) => cat.toLowerCase().includes(q));
  }, [categories, categorySearch]);

  // Filter channels based on active category & search
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // Category filter
      if (activeCategory === 'Favoritos') {
        if (!favorites.includes(ch.id)) return false;
      } else if (activeCategory !== 'Todos') {
        const cat = ch.category || ch.groupTitle;
        if (cat !== activeCategory) return false;
      }

      // Channel search filter
      if (channelSearch.trim()) {
        const q = channelSearch.toLowerCase();
        return (
          ch.name.toLowerCase().includes(q) ||
          ch.category?.toLowerCase().includes(q) ||
          ch.groupTitle?.toLowerCase().includes(q) ||
          ch.currentProgram?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [channels, activeCategory, channelSearch, favorites]);

  // Category cycling for player mode (Blink Player style: < Categoria >)
  const handlePrevCategory = () => {
    const currentIndex = categories.indexOf(activeCategory);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
    setActiveCategory(categories[prevIndex]);
  };

  const handleNextCategory = () => {
    const currentIndex = categories.indexOf(activeCategory);
    const nextIndex = currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
    setActiveCategory(categories[nextIndex]);
  };

  // When clicking a channel in grid mode, select and switch to player
  const handleSelectChannelAndPlay = (channel: Channel) => {
    onSelectChannel(channel);
    setViewMode('player');
  };

  // EPG programs for selected channel
  const epgPrograms = useMemo(() => {
    return getMockEpgForChannel(selectedChannel);
  }, [selectedChannel]);

  const currentProgram = epgPrograms[0];
  const nextProgram = epgPrograms[1];

  return (
    <div className="flex-1 flex flex-col h-full max-w-[1700px] w-full mx-auto p-2.5 sm:p-4 gap-3 animate-fade-in select-none">
      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR (Blink Player Web TV Style)                             */}
      {/* ========================================================================= */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md rounded-2xl p-3 px-4">
        {/* Left: Back + Cash Movie Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-xs font-semibold shadow transition-all active:scale-95 tv-focusable"
            title="Voltar ao Painel Principal"
          >
            <ArrowLeft className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Início</span>
          </button>

          <CashMovieLogo size="sm" />

          {/* Quick Hub Navigation Links (Live TV, Movies, Series, EPG) */}
          <div className="hidden lg:flex items-center gap-1.5 ml-2 border-l border-slate-800 pl-3">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Ao Vivo</span>
            </button>

            {onOpenMovies && (
              <button
                onClick={onOpenMovies}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 transition-colors"
              >
                <Film className="w-3.5 h-3.5 text-rose-400" />
                <span>Filmes</span>
              </button>
            )}

            {onOpenSeries && (
              <button
                onClick={onOpenSeries}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 transition-colors"
              >
                <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Séries</span>
              </button>
            )}

            <button
              onClick={onOpenEpg}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Guia EPG</span>
            </button>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Buscar canal ou programa..."
            value={channelSearch}
            onChange={(e) => setChannelSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors font-sans"
          />
        </div>

        {/* Right: View Mode Toggle & MAC ID */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* View Mode Toggle: Grid (/m3u-live-tv) vs Player (/m3u-live-main) */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Grade de Canais (Blink m3u-live-tv)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grade</span>
            </button>

            <button
              onClick={() => setViewMode('player')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'player'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Player Dividido (Blink m3u-live-main)"
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Player</span>
            </button>
          </div>

          <button
            onClick={onOpenActivation}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Ver MAC ID e Ativação"
          >
            <Key className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">MAC ID</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MODE 1: BLINK PLAYER M3U-LIVE-TV (Categories Left + Channels Grid Right)  */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden min-h-[600px]">
          {/* Left Column: Categories Column */}
          <aside className="lg:w-80 w-full bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col shrink-0 max-h-[220px] lg:max-h-full">
            {/* Category Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Buscar nas categorias..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Category Cards List */}
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto scrollbar-thin flex-1 pr-1">
              {filteredCategories.map((cat) => {
                const isActive = activeCategory === cat;
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer tv-focusable shrink-0 lg:shrink ${
                      isActive
                        ? 'bg-red-950/50 border-red-500 text-white shadow-md shadow-red-950/40 ring-1 ring-red-500/50'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {cat === 'Favoritos' ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-400 animate-pulse' : 'bg-slate-600 group-hover:bg-slate-400'}`}></div>
                      )}
                      <span className="text-xs sm:text-sm font-semibold truncate uppercase tracking-wide">
                        {cat}
                      </span>
                    </div>

                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                      isActive 
                        ? 'bg-red-600 text-white border-red-400/50' 
                        : 'bg-slate-950/80 text-slate-400 border-slate-800'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Channels Cards Grid */}
          <main className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col overflow-hidden">
            {/* Category Header Bar */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  {activeCategory}
                </h2>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                  {filteredChannels.length} canais
                </span>
              </div>

              <div className="text-xs text-slate-400 hidden sm:block">
                Clique em um canal para reproduzir
              </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-y-auto scrollbar-thin pr-1">
              {filteredChannels.length === 0 ? (
                <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Tv className="w-12 h-12 text-slate-600" />
                  <p className="text-sm font-semibold">Nenhum canal encontrado nesta categoria.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('Todos');
                      setChannelSearch('');
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    Ver Todos os Canais
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                  {filteredChannels.map((channel, idx) => {
                    const isSelected = selectedChannel.id === channel.id;
                    const isFav = favorites.includes(channel.id);

                    return (
                      <div
                        key={channel.id}
                        tabIndex={0}
                        onClick={() => handleSelectChannelAndPlay(channel)}
                        className={`group relative flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-md select-none tv-focusable aspect-[1.15/1] ${
                          isSelected
                            ? 'bg-red-950/50 border-red-500 shadow-red-950/50 ring-2 ring-red-500/60 scale-[1.02]'
                            : 'bg-slate-900/60 hover:bg-slate-800/90 border-slate-800 hover:border-red-500/70 hover:scale-[1.03]'
                        }`}
                      >
                        {/* Channel Number / Favorite Star on Top Row */}
                        <div className="w-full flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            #{String(idx + 1).padStart(2, '0')}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(channel.id);
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              isFav ? 'text-amber-400 hover:text-amber-300' : 'text-slate-600 hover:text-white'
                            }`}
                            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                          </button>
                        </div>

                        {/* Centered Channel Logo */}
                        <div className="h-16 w-full flex items-center justify-center p-1">
                          {channel.logo ? (
                            <img
                              src={channel.logo}
                              alt={channel.name}
                              className="max-h-full max-w-[85%] object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <Tv className="w-8 h-8 text-slate-500 group-hover:text-red-400 transition-colors" />
                          )}
                        </div>

                        {/* Channel Name Bottom Label */}
                        <div className="w-full text-center mt-1">
                          <div className="text-xs font-bold text-white uppercase truncate tracking-wide group-hover:text-red-400 transition-colors">
                            {channel.name}
                          </div>
                          {channel.currentProgram && (
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {channel.currentProgram}
                            </div>
                          )}
                        </div>

                        {/* Playing Active Indicator Badge */}
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full shadow-lg border border-red-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                            NO AR
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: BLINK PLAYER M3U-LIVE-MAIN (Split Screen: Channels List + Player)  */}
      {/* ========================================================================= */}
      {viewMode === 'player' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-[600px]">
          {/* Left Column (lg: col-span-4): Numbered Channel List with Category Cycler */}
          <aside className="lg:col-span-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col overflow-hidden max-h-[340px] lg:max-h-full">
            {/* Blink Category Switcher Header (< Category Name >) */}
            <div className="flex items-center justify-between p-2.5 mb-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={handlePrevCategory}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Categoria Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-center truncate px-2">
                <div className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-bold">
                  Categoria
                </div>
                <div className="text-xs sm:text-sm font-bold text-white uppercase truncate">
                  {activeCategory} ({filteredChannels.length})
                </div>
              </div>

              <button
                onClick={handleNextCategory}
                className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                title="Próxima Categoria"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Channel List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {filteredChannels.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  Nenhum canal encontrado nesta categoria.
                </div>
              ) : (
                filteredChannels.map((channel, idx) => {
                  const isSelected = selectedChannel.id === channel.id;
                  const isFav = favorites.includes(channel.id);

                  return (
                    <div
                      key={channel.id}
                      tabIndex={0}
                      onClick={() => onSelectChannel(channel)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer tv-focusable ${
                        isSelected
                          ? 'bg-red-950/60 border-red-500 text-white shadow-md ring-1 ring-red-500/50'
                          : 'bg-slate-900/40 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Channel Number (Blink index) */}
                        <span className="text-xs font-mono font-bold text-slate-400 w-7 text-center">
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        {/* Channel Logo */}
                        <div className="w-9 h-7 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                          {channel.logo ? (
                            <img
                              src={channel.logo}
                              alt={channel.name}
                              className="w-full h-full object-contain p-0.5"
                              loading="lazy"
                            />
                          ) : (
                            <Tv className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </div>

                        {/* Channel Name */}
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate uppercase flex items-center gap-1.5">
                            <span>{channel.name}</span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {channel.currentProgram || channel.category || 'Transmissão Ao Vivo'}
                          </div>
                        </div>
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(channel.id);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFav ? 'text-amber-400' : 'text-slate-600 hover:text-white'
                        }`}
                        title={isFav ? 'Remover dos favoritos' : 'Favoritar canal'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right Column (lg: col-span-8): Video Player + Blink EPG Box */}
          <main className="lg:col-span-8 flex flex-col gap-3 overflow-hidden">
            {/* Top Bar for Current Channel Info */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-2 py-0.5 rounded shadow">
                  AO VIVO
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide truncate">
                  {selectedChannel.name}
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline font-mono">
                  · {selectedChannel.category || 'Geral'}
                </span>
              </div>

              <button
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-red-400" />
                <span>Ver Grade</span>
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="w-full shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <VideoPlayer
                channel={selectedChannel}
                settings={settings}
                onUpdateSettings={onUpdateSettings}
                onNextChannel={onNextChannel}
                onPrevChannel={onPrevChannel}
                allChannels={channels}
                onSelectChannel={onSelectChannel}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(selectedChannel.id)}
                onOpenEpg={onOpenEpg}
              />
            </div>

            {/* Bottom: Blink TV Guide / EPG Info Card */}
            <div className="flex-1 bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                      NO AR AGORA
                    </span>
                    <span className="text-xs font-mono font-bold text-sky-400">
                      {currentProgram.start} - {currentProgram.end}
                    </span>
                  </div>
                  <button
                    onClick={onOpenEpg}
                    className="text-xs text-sky-400 hover:underline flex items-center gap-1.5 font-semibold"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Grade Completa</span>
                  </button>
                </div>

                <h4 className="text-base font-bold text-white mt-2.5 mb-1">
                  {currentProgram.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {currentProgram.description}
                </p>

                {/* Program Timeline Progress */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Progresso da Transmissão</span>
                    <span className="text-red-400 font-bold">{currentProgram.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${currentProgram.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Next Program Preview */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  A Seguir: <strong className="text-white">{nextProgram.title}</strong>
                </span>
                <span className="font-mono text-slate-500">{nextProgram.start}</span>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};
