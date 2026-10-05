import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, Star, Tv, Maximize, Play, Pause, 
  Radio, Calendar, Sliders, Volume2, ShieldCheck, Key
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
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('Todos');
    set.add('Favoritos');
    channels.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [channels]);

  // Filter channels
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      if (activeCategory === 'Favoritos') {
        if (!favorites.includes(ch.id)) return false;
      } else if (activeCategory !== 'Todos') {
        if (ch.category !== activeCategory && ch.groupTitle !== activeCategory) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ch.name.toLowerCase().includes(q) ||
          ch.category?.toLowerCase().includes(q) ||
          ch.currentProgram?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [channels, activeCategory, searchQuery, favorites]);

  // EPG info for currently selected channel
  const epgPrograms = useMemo(() => {
    return getMockEpgForChannel(selectedChannel);
  }, [selectedChannel]);

  const currentProgram = epgPrograms[0];
  const nextProgram = epgPrograms[1];

  return (
    <div className="flex-1 flex flex-col h-full max-w-[1600px] w-full mx-auto p-3 sm:p-5 gap-3 animate-fade-in">
      {/* Top Bar inside Live TV */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 text-xs font-semibold shadow transition-colors active:scale-95 tv-focusable"
          >
            <ArrowLeft className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Menu Principal</span>
          </button>
          <CashMovieLogo size="sm" />
          <span className="hidden md:inline-flex text-[10px] font-mono uppercase bg-red-600/90 text-white font-bold px-2 py-0.5 rounded">
            AO VIVO
          </span>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar canal ou emissora..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-red-500"
          />
        </div>

        <button
          onClick={onOpenActivation}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5"
          title="Ver MAC e Ativação"
        >
          <Key className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">MAC ID</span>
        </button>
      </div>

      {/* Signature IBO Pro 3-Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden min-h-[580px]">
        {/* Column 1: Categories (lg: col-span-3) */}
        <div className="lg:col-span-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col overflow-hidden max-h-[220px] lg:max-h-full">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
            <span>Categorias</span>
            <span className="font-mono text-red-400">{categories.length}</span>
          </div>

          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto scrollbar-thin flex-1 pr-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-between tv-focusable ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {cat === 'Favoritos' && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    <span className="truncate">{cat}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${isActive ? 'text-red-200' : 'text-slate-500'}`}>
                    {cat === 'Todos' ? channels.length : cat === 'Favoritos' ? favorites.length : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Channels List (lg: col-span-4) */}
        <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 flex flex-col overflow-hidden max-h-[300px] lg:max-h-full">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
            <span>Canais ({filteredChannels.length})</span>
            <span className="text-[10px] font-mono text-sky-400">IBO Guide</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
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
                    className={`group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer tv-focusable ${
                      isSelected
                        ? 'bg-red-950/50 border border-red-500 text-white shadow-md'
                        : 'bg-slate-900/40 hover:bg-slate-900/90 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-slate-500 w-6 text-center">
                        {String(idx + 1).padStart(3, '0')}
                      </span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        {channel.logo ? (
                          <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
                        ) : (
                          <Tv className="w-3.5 h-3.5 text-sky-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                          <span>{channel.name}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {channel.currentProgram || channel.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(channel.id);
                        }}
                        className={`p-1 rounded transition-colors ${
                          isFav ? 'text-amber-400' : 'text-slate-600 hover:text-white'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Live Video Player + EPG Synopsis Matrix (lg: col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-3 overflow-hidden">
          {/* Top: Video Player Frame */}
          <div className="w-full shrink-0">
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

          {/* Bottom: Channel EPG and Program Info Details */}
          <div className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                    NO AR AGORA
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-400">
                    {currentProgram.start} - {currentProgram.end}
                  </span>
                </div>
                <button
                  onClick={onOpenEpg}
                  className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Calendar className="w-3.5 h-3.5" /> Grade Completa
                </button>
              </div>

              <h4 className="text-sm font-bold text-white mt-2 mb-1">
                {currentProgram.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {currentProgram.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Progresso do Programa</span>
                  <span className="text-red-400 font-bold">{currentProgram.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${currentProgram.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Next Show Preview */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                A Seguir: <strong className="text-white">{nextProgram.title}</strong>
              </span>
              <span className="font-mono text-slate-500">{nextProgram.start}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
