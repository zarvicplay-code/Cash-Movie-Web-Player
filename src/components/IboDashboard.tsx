import React, { useState, useEffect } from 'react';
import { 
  Tv, Film, Clapperboard, Calendar, Star, History, 
  Settings, Key, RefreshCw, Search, ShieldCheck, Download, 
  Radio, Play, ArrowRight, Sparkles, Layers
} from 'lucide-react';
import { CashMovieLogo } from './CashMovieLogo';
import { DeviceActivationInfo, VodItem } from '../types/activation';
import { Channel } from '../types/iptv';

import cardAoVivoImg from '../assets/images/card_esportes_live_1790912629092.jpg';
import cardFilmesImg from '../assets/images/card_vingadores_1790912650472.jpg';
import cardSeriesImg from '../assets/images/card_got_series_1790912662817.jpg';
import cardGuiaTvImg from '../assets/images/card_jornal_guia_1790912671988.jpg';

interface IboDashboardProps {
  deviceInfo: DeviceActivationInfo;
  channelsCount: number;
  moviesCount: number;
  seriesCount: number;
  onOpenLiveTv: () => void;
  onOpenMovies: () => void;
  onOpenSeries: () => void;
  onOpenEpg: () => void;
  onOpenActivation: () => void;
  onOpenSettings: () => void;
  onOpenPlaylists: () => void;
  onOpenInstall: () => void;
  onReload: () => void;
  favoritesCount: number;
  recentChannels: Channel[];
  onPlayChannel: (channel: Channel) => void;
}

export const IboDashboard: React.FC<IboDashboardProps> = ({
  deviceInfo,
  channelsCount,
  moviesCount,
  seriesCount,
  onOpenLiveTv,
  onOpenMovies,
  onOpenSeries,
  onOpenEpg,
  onOpenActivation,
  onOpenSettings,
  onOpenPlaylists,
  onOpenInstall,
  onReload,
  favoritesCount,
  recentChannels,
  onPlayChannel,
}) => {
  // Live Clock & Date
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Top Header Bar (IBO Pro Header) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <CashMovieLogo size="lg" />
        </div>

        {/* Center: Live Digital Clock */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-widest drop-shadow-md">
            {currentTime}
          </div>
          <div className="text-xs text-slate-400 capitalize font-medium mt-0.5">
            {currentDate}
          </div>
        </div>

        {/* Right: Device MAC Badge & Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* MAC ID Button */}
          <button
            onClick={onOpenActivation}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-200 transition-all shadow-md group"
            title="Ver MAC ID e Chave do Dispositivo"
          >
            <Key className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white hidden md:inline">MAC:</span>
            <span className="text-sky-300">{deviceInfo.macAddress}</span>
            <span className={`w-2 h-2 rounded-full ${deviceInfo.isActivated ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></span>
          </button>

          {/* Reload Button */}
          <button
            onClick={onReload}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
            title="Recarregar Listas e Canais"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
            title="Configurações Gerais"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main IBO Pro Big Tiles Hub (4 Signature Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6">
        {/* 1. AO VIVO / LIVE TV */}
        <div
          tabIndex={0}
          onClick={onOpenLiveTv}
          className="group relative h-52 sm:h-64 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl border border-red-500/40 hover:border-red-400 bg-slate-950 tv-focusable"
        >
          {/* Background Cinematic Image with zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={cardAoVivoImg} 
              alt="Ao Vivo" 
              className="w-full h-full object-cover object-center transform group-hover:scale-110 group-hover:rotate-0.5 transition-transform duration-700 ease-out"
            />
            {/* Dark gradient overlay for text readability & glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/75 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-transparent to-transparent"></div>
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/30 rounded-full blur-2xl group-hover:bg-red-600/50 transition-all"></div>
            {/* Glass reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-red-600/40 backdrop-blur-md border border-red-500/60 flex items-center justify-center text-red-300 shadow-lg shadow-red-950/50 group-hover:scale-110 transition-transform">
                <Tv className="w-6 h-6 drop-shadow" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide group-hover:text-red-400 transition-colors drop-shadow-md">
                AO VIVO
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1 font-medium drop-shadow">
                {channelsCount} Canais Transmitindo
              </p>
            </div>
          </div>
        </div>

        {/* 2. FILMES / MOVIES */}
        <div
          tabIndex={0}
          onClick={onOpenMovies}
          className="group relative h-52 sm:h-64 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl border border-purple-500/40 hover:border-purple-400 bg-slate-950 tv-focusable"
        >
          {/* Background Cinematic Image with zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={cardFilmesImg} 
              alt="Filmes" 
              className="w-full h-full object-cover object-center transform group-hover:scale-110 group-hover:rotate-0.5 transition-transform duration-700 ease-out"
            />
            {/* Dark gradient overlay for text readability & glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/75 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-transparent to-transparent"></div>
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/30 rounded-full blur-2xl group-hover:bg-purple-600/50 transition-all"></div>
            {/* Glass reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-purple-600/40 backdrop-blur-md border border-purple-500/60 flex items-center justify-center text-purple-300 shadow-lg shadow-purple-950/50 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6 drop-shadow" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide group-hover:text-purple-400 transition-colors drop-shadow-md">
                FILMES
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1 font-medium drop-shadow">
                {moviesCount} Filmes em Alta Definição
              </p>
            </div>
          </div>
        </div>

        {/* 3. SÉRIES / SERIES */}
        <div
          tabIndex={0}
          onClick={onOpenSeries}
          className="group relative h-52 sm:h-64 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl border border-sky-500/40 hover:border-sky-400 bg-slate-950 tv-focusable"
        >
          {/* Background Cinematic Image with zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={cardSeriesImg} 
              alt="Séries" 
              className="w-full h-full object-cover object-center transform group-hover:scale-110 group-hover:rotate-0.5 transition-transform duration-700 ease-out"
            />
            {/* Dark gradient overlay for text readability & glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/75 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-sky-950/40 via-transparent to-transparent"></div>
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-sky-600/30 rounded-full blur-2xl group-hover:bg-sky-600/50 transition-all"></div>
            {/* Glass reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-sky-600/40 backdrop-blur-md border border-sky-500/60 flex items-center justify-center text-sky-300 shadow-lg shadow-sky-950/50 group-hover:scale-110 transition-transform">
                <Clapperboard className="w-6 h-6 drop-shadow" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide group-hover:text-sky-400 transition-colors drop-shadow-md">
                SÉRIES
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1 font-medium drop-shadow">
                {seriesCount} Séries e Temporadas
              </p>
            </div>
          </div>
        </div>

        {/* 4. GUIA EPG */}
        <div
          tabIndex={0}
          onClick={onOpenEpg}
          className="group relative h-52 sm:h-64 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl border border-amber-500/40 hover:border-amber-400 bg-slate-950 tv-focusable"
        >
          {/* Background Cinematic Image with zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={cardGuiaTvImg} 
              alt="Guia de TV" 
              className="w-full h-full object-cover object-center transform group-hover:scale-110 group-hover:rotate-0.5 transition-transform duration-700 ease-out"
            />
            {/* Dark gradient overlay for text readability & glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/75 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-transparent to-transparent"></div>
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-600/30 rounded-full blur-2xl group-hover:bg-amber-600/50 transition-all"></div>
            {/* Glass reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-amber-600/40 backdrop-blur-md border border-amber-500/60 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-950/50 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 drop-shadow" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide group-hover:text-amber-400 transition-colors drop-shadow-md">
                GUIA DE TV
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-1 font-medium drop-shadow">
                Grade de Programação Ao Vivo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom IBO Pro Quick Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800/80">
        {/* Ativação & MAC */}
        <button
          onClick={onOpenActivation}
          className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center gap-3 transition-colors tv-focusable"
        >
          <div className="p-2 rounded-xl bg-red-600/20 text-red-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Ativação MAC</div>
            <div className="text-[11px] text-slate-400 truncate">Ver Chave & MAC</div>
          </div>
        </button>

        {/* Gerenciar Listas */}
        <button
          onClick={onOpenPlaylists}
          className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center gap-3 transition-colors tv-focusable"
        >
          <div className="p-2 rounded-xl bg-sky-600/20 text-sky-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Minhas Listas</div>
            <div className="text-[11px] text-slate-400 truncate">M3U & Xtream</div>
          </div>
        </button>

        {/* Favoritos */}
        <button
          onClick={onOpenLiveTv}
          className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center gap-3 transition-colors tv-focusable"
        >
          <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Favoritos</div>
            <div className="text-[11px] text-slate-400 truncate">{favoritesCount} salvos</div>
          </div>
        </button>

        {/* Instalar App Android */}
        <button
          onClick={onOpenInstall}
          className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center gap-3 transition-colors tv-focusable"
        >
          <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Instalar no Android</div>
            <div className="text-[11px] text-slate-400 truncate">APK / PWA TV Box</div>
          </div>
        </button>

        {/* Ajustes */}
        <button
          onClick={onOpenSettings}
          className="p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 text-left flex items-center gap-3 transition-colors tv-focusable col-span-2 sm:col-span-1"
        >
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Configurações</div>
            <div className="text-[11px] text-slate-400 truncate">Player & TV Mode</div>
          </div>
        </button>
      </div>
    </div>
  );
};
