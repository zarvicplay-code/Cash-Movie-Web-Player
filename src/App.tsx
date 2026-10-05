import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Tv, Plus, Settings, Star, Sliders, Smartphone, 
  Download, Radio, Calendar, Search, LayoutGrid, Sparkles,
  Volume2, Play, RefreshCw, Zap, Key, Film, Clapperboard,
  ShieldCheck, ArrowLeft, History
} from 'lucide-react';

import { Channel, PlaylistSource, PlayerSettings, AspectRatio } from './types/iptv';
import { DeviceActivationInfo, VodItem } from './types/activation';
import { DEFAULT_CHANNELS, CATEGORIES } from './data/defaultChannels';
import { DEFAULT_VOD_MOVIES, DEFAULT_VOD_SERIES } from './data/defaultVod';
import { getOrCreateDeviceInfo, saveDeviceInfo } from './utils/deviceActivation';
import { VideoPlayer } from './components/VideoPlayer';
import { ChannelList } from './components/ChannelList';
import { EpgGuide } from './components/EpgGuide';
import { PlaylistModal } from './components/PlaylistModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallModal } from './components/InstallModal';
import { VirtualRemoteModal } from './components/VirtualRemoteModal';
import { ActivationModal } from './components/ActivationModal';
import { IboDashboard } from './components/IboDashboard';
import { IboLiveTvView } from './components/IboLiveTvView';
import { VodModal } from './components/VodModal';
import { IptvCinematicBackground } from './components/IptvCinematicBackground';
import { Footer } from './components/Footer';

const DEFAULT_PLAYLIST_SOURCE: PlaylistSource = {
  id: 'default-playlist',
  name: 'Canais Abertos & Ao Vivo',
  type: 'default',
  channelCount: DEFAULT_CHANNELS.length,
  addedAt: 'Padrão do Sistema',
};

export default function App() {
  // Current Navigation View: 'dashboard' | 'livetv'
  const [currentView, setCurrentView] = useState<'dashboard' | 'livetv'>('dashboard');

  // Device Info (MAC Address & Device Key for activation)
  const [deviceInfo, setDeviceInfo] = useState<DeviceActivationInfo>(() => {
    return getOrCreateDeviceInfo();
  });

  // Channels and Playlists State
  const [playlists, setPlaylists] = useState<PlaylistSource[]>(() => {
    try {
      const saved = localStorage.getItem('cashmovie_playlists');
      return saved ? JSON.parse(saved) : [DEFAULT_PLAYLIST_SOURCE];
    } catch {
      return [DEFAULT_PLAYLIST_SOURCE];
    }
  });

  const [activePlaylistId, setActivePlaylistId] = useState<string>(() => {
    return localStorage.getItem('cashmovie_active_playlist') || 'default-playlist';
  });

  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('cashmovie_channels');
      return saved ? JSON.parse(saved) : DEFAULT_CHANNELS;
    } catch {
      return DEFAULT_CHANNELS;
    }
  });

  const [selectedChannel, setSelectedChannel] = useState<Channel>(() => {
    return channels[0] || DEFAULT_CHANNELS[0];
  });

  const [recentChannels, setRecentChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('cashmovie_recent_channels');
      return saved ? JSON.parse(saved) : DEFAULT_CHANNELS.slice(0, 4);
    } catch {
      return DEFAULT_CHANNELS.slice(0, 4);
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cashmovie_favorites');
      return saved ? JSON.parse(saved) : ['ch-tvbrasil', 'ch-nasa-public'];
    } catch {
      return ['ch-tvbrasil', 'ch-nasa-public'];
    }
  });

  // Settings State
  const [settings, setSettings] = useState<PlayerSettings>(() => {
    try {
      const saved = localStorage.getItem('cashmovie_settings');
      return saved ? JSON.parse(saved) : {
        aspectRatio: 'fit',
        autoPlay: true,
        bufferLengthSec: 30,
        enableHardwareAcceleration: true,
        tvMode: false,
        volume: 1,
        brightness: 1,
        sleepTimerMinutes: null,
      };
    } catch {
      return {
        aspectRatio: 'fit',
        autoPlay: true,
        bufferLengthSec: 30,
        enableHardwareAcceleration: true,
        tvMode: false,
        volume: 1,
        brightness: 1,
        sleepTimerMinutes: null,
      };
    }
  });

  // Modals Visibility
  const [isActivationOpen, setIsActivationOpen] = useState<boolean>(false);
  const [isEpgOpen, setIsEpgOpen] = useState<boolean>(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isInstallOpen, setIsInstallOpen] = useState<boolean>(false);
  const [isRemoteOpen, setIsRemoteOpen] = useState<boolean>(false);

  // VOD Modal State
  const [vodModalType, setVodModalType] = useState<'movie' | 'series' | null>(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  // Channel numeric zap buffer
  const [numericZapBuffer, setNumericZapBuffer] = useState<string>('');
  const numericTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cashmovie_channels', JSON.stringify(channels));
    } catch (e) {
      console.warn('Could not save channels', e);
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem('cashmovie_playlists', JSON.stringify(playlists));
    } catch (e) {
      console.warn('Could not save playlists', e);
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem('cashmovie_active_playlist', activePlaylistId);
    } catch (e) {
      console.warn('Could not save active playlist', e);
    }
  }, [activePlaylistId]);

  useEffect(() => {
    try {
      localStorage.setItem('cashmovie_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('cashmovie_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save settings', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('cashmovie_recent_channels', JSON.stringify(recentChannels));
    } catch (e) {
      console.warn('Could not save recents', e);
    }
  }, [recentChannels]);

  // Sleep Timer interval
  useEffect(() => {
    if (settings.sleepTimerMinutes === null) return;

    const interval = setInterval(() => {
      setSettings((prev) => {
        if (prev.sleepTimerMinutes === null) return prev;
        if (prev.sleepTimerMinutes <= 1) {
          return { ...prev, sleepTimerMinutes: null, autoPlay: false };
        }
        return { ...prev, sleepTimerMinutes: prev.sleepTimerMinutes - 1 };
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [settings.sleepTimerMinutes]);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = async () => {
    if (!deferredPrompt) {
      setIsInstallOpen(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsAppInstalled(true);
    }
    setDeferredPrompt(null);
  };

  // Add to recents when channel is played
  const handlePlayChannel = useCallback((channel: Channel) => {
    setSelectedChannel(channel);
    setRecentChannels((prev) => {
      const filtered = prev.filter((c) => c.id !== channel.id);
      return [channel, ...filtered].slice(0, 10);
    });
    setCurrentView('livetv');
  }, []);

  // Channel Navigation Handlers
  const handleNextChannel = useCallback(() => {
    if (!channels.length) return;
    const currentIndex = channels.findIndex((c) => c.id === selectedChannel?.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    handlePlayChannel(channels[nextIndex]);
  }, [channels, selectedChannel, handlePlayChannel]);

  const handlePrevChannel = useCallback(() => {
    if (!channels.length) return;
    const currentIndex = channels.findIndex((c) => c.id === selectedChannel?.id);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    handlePlayChannel(channels[prevIndex]);
  }, [channels, selectedChannel, handlePlayChannel]);

  const handleToggleFavorite = useCallback((channelId: string) => {
    setFavorites((prev) => {
      if (prev.includes(channelId)) {
        return prev.filter((id) => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Partial<PlayerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Keyboard and Remote Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ']':
          e.preventDefault();
          handleNextChannel();
          break;
        case 'ArrowLeft':
        case 'PageUp':
        case '[':
          e.preventDefault();
          handlePrevChannel();
          break;
        case 'i':
        case 'I':
          e.preventDefault();
          setIsEpgOpen((prev) => !prev);
          break;
        case 'Escape':
        case 'Backspace':
          if (currentView === 'livetv') {
            setCurrentView('dashboard');
          }
          setIsEpgOpen(false);
          setIsPlaylistModalOpen(false);
          setIsSettingsOpen(false);
          setIsInstallOpen(false);
          setIsRemoteOpen(false);
          setIsActivationOpen(false);
          setVodModalType(null);
          break;
        default:
          if (/^[0-9]$/.test(e.key)) {
            setNumericZapBuffer((prev) => {
              const updated = prev + e.key;
              if (numericTimerRef.current) clearTimeout(numericTimerRef.current);
              numericTimerRef.current = setTimeout(() => {
                const channelNum = parseInt(updated, 10);
                if (channelNum > 0 && channelNum <= channels.length) {
                  handlePlayChannel(channels[channelNum - 1]);
                }
                setNumericZapBuffer('');
              }, 1000);
              return updated;
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextChannel, handlePrevChannel, channels, currentView, handlePlayChannel]);

  // Playlist management
  const handleAddPlaylist = (playlist: PlaylistSource, newChannels: Channel[]) => {
    setPlaylists((prev) => [playlist, ...prev]);
    setActivePlaylistId(playlist.id);
    setChannels(newChannels);
    if (newChannels.length > 0) {
      setSelectedChannel(newChannels[0]);
    }
  };

  const handleSwitchPlaylist = (playlistId: string) => {
    setActivePlaylistId(playlistId);
    if (playlistId === 'default-playlist') {
      setChannels(DEFAULT_CHANNELS);
      setSelectedChannel(DEFAULT_CHANNELS[0]);
    }
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (activePlaylistId === playlistId) {
      handleRestoreDefaults();
    }
  };

  const handleRestoreDefaults = () => {
    setChannels(DEFAULT_CHANNELS);
    setSelectedChannel(DEFAULT_CHANNELS[0]);
    setActivePlaylistId('default-playlist');
    setPlaylists([DEFAULT_PLAYLIST_SOURCE]);
  };

  // Add playlist from activation modal directly
  const handleAddPlaylistFromActivation = (name: string, url: string) => {
    const newPl: PlaylistSource = {
      id: `mac-pl-${Date.now()}`,
      name: name,
      type: 'm3u_url',
      url: url,
      channelCount: DEFAULT_CHANNELS.length,
      addedAt: new Date().toLocaleDateString('pt-BR'),
    };
    handleAddPlaylist(newPl, DEFAULT_CHANNELS);
  };

  // Play VOD item in player
  const handlePlayVod = (vod: VodItem) => {
    const vodChannel: Channel = {
      id: vod.id,
      name: vod.title,
      logo: vod.poster,
      url: vod.streamUrl,
      category: vod.type === 'movie' ? 'Filmes VOD' : 'Séries VOD',
      resolution: '1080p Full HD',
      currentProgram: `${vod.title} (${vod.year})`,
      nextProgram: 'Reprodução Completa',
    };
    setSelectedChannel(vodChannel);
    setCurrentView('livetv');
  };

  return (
    <div className={`min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden ${settings.tvMode ? 'tv-mode' : ''}`}>
      {/* Next-level Cinematic IPTV Background */}
      <IptvCinematicBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Banner on Mobile or TV when in Dashboard */}
        {numericZapBuffer && (
          <div className="fixed top-16 right-6 z-50 bg-red-600 text-white font-mono font-bold text-sm px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 border border-red-400">
            <span className="animate-pulse">Canal:</span> #{numericZapBuffer}
          </div>
        )}

        {/* Main View Router */}
        {currentView === 'dashboard' ? (
          <IboDashboard
            deviceInfo={deviceInfo}
            channelsCount={channels.length}
            moviesCount={DEFAULT_VOD_MOVIES.length}
            seriesCount={DEFAULT_VOD_SERIES.length}
            onOpenLiveTv={() => setCurrentView('livetv')}
            onOpenMovies={() => setVodModalType('movie')}
            onOpenSeries={() => setVodModalType('series')}
            onOpenEpg={() => setIsEpgOpen(true)}
            onOpenActivation={() => setIsActivationOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenPlaylists={() => setIsPlaylistModalOpen(true)}
            onOpenInstall={() => setIsInstallOpen(true)}
            onReload={() => {
              setChannels([...channels]);
            }}
            favoritesCount={favorites.length}
            recentChannels={recentChannels}
            onPlayChannel={handlePlayChannel}
          />
        ) : (
          <IboLiveTvView
            channels={channels}
            selectedChannel={selectedChannel}
            onSelectChannel={handlePlayChannel}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onBackToDashboard={() => setCurrentView('dashboard')}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onNextChannel={handleNextChannel}
            onPrevChannel={handlePrevChannel}
            onOpenEpg={() => setIsEpgOpen(true)}
            onOpenActivation={() => setIsActivationOpen(true)}
          />
        )}
      </div>

      {/* Footer with Zarvic Play branding and WhatsApp clickable link */}
      <Footer onOpenActivation={() => setIsActivationOpen(true)} />

      {/* Modals & Dialogs */}
      <ActivationModal
        isOpen={isActivationOpen}
        onClose={() => setIsActivationOpen(false)}
        deviceInfo={deviceInfo}
        onUpdateDeviceInfo={setDeviceInfo}
        onAddPlaylistFromActivation={handleAddPlaylistFromActivation}
      />

      <VodModal
        isOpen={vodModalType !== null}
        onClose={() => setVodModalType(null)}
        type={vodModalType || 'movie'}
        items={vodModalType === 'movie' ? DEFAULT_VOD_MOVIES : DEFAULT_VOD_SERIES}
        onPlayVod={handlePlayVod}
      />

      <EpgGuide
        channel={selectedChannel}
        isOpen={isEpgOpen}
        onClose={() => setIsEpgOpen(false)}
        onSelectChannel={(ch) => {
          handlePlayChannel(ch);
          setIsEpgOpen(false);
        }}
        allChannels={channels}
      />

      <PlaylistModal
        isOpen={isPlaylistModalOpen}
        onClose={() => setIsPlaylistModalOpen(false)}
        onAddChannels={handleAddPlaylist}
        savedPlaylists={playlists}
        activePlaylistId={activePlaylistId}
        onSwitchPlaylist={handleSwitchPlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onRestoreDefaults={handleRestoreDefaults}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenInstallGuide={() => setIsInstallOpen(true)}
      />

      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        deferredPrompt={deferredPrompt}
        onTriggerInstall={triggerInstall}
        isInstalled={isAppInstalled}
      />

      <VirtualRemoteModal
        isOpen={isRemoteOpen}
        onClose={() => setIsRemoteOpen(false)}
        onNextChannel={handleNextChannel}
        onPrevChannel={handlePrevChannel}
        onTogglePlay={() => {}}
        onOpenEpg={() => {
          setIsRemoteOpen(false);
          setIsEpgOpen(true);
        }}
        onToggleFullscreen={() => {
          const el = document.documentElement;
          if (!document.fullscreenElement) {
            el.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        }}
      />
    </div>
  );
}
