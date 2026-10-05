import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  RotateCcw, Sliders, Tv, ChevronLeft, ChevronRight,
  Sun, PictureInPicture2, Radio, Check, RefreshCw, AlertCircle
} from 'lucide-react';
import { Channel, AspectRatio, PlayerSettings } from '../types/iptv';

interface VideoPlayerProps {
  channel: Channel;
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
  onNextChannel: () => void;
  onPrevChannel: () => void;
  allChannels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  isFavorite: boolean;
  onOpenEpg: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  channel,
  settings,
  onUpdateSettings,
  onNextChannel,
  onPrevChannel,
  allChannels,
  onSelectChannel,
  onToggleFavorite,
  isFavorite,
  onOpenEpg
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [availableQualities, setAvailableQualities] = useState<{ id: number; height: number; name: string }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 is Auto
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [showQuickList, setShowQuickList] = useState<boolean>(false);

  // Gesture indicators
  const [gestureType, setGestureType] = useState<'volume' | 'brightness' | null>(null);
  const [gestureValue, setGestureValue] = useState<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchActiveType = useRef<'volume' | 'brightness' | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls
  const triggerControls = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showQualityMenu && !showQuickList) {
        setShowControls(false);
      }
    }, 4000);
  };

  // Video stream initialization
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
    setAvailableQualities([]);

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = channel.url;
    const isHls = streamUrl.includes('.m3u8') || streamUrl.includes('/hls') || streamUrl.includes('/live/');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: settings.bufferLengthSec || 30,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsLoading(false);
        const qualities = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height || 0,
          name: lvl.height ? `${lvl.height}p` : `Qualidade ${index + 1}`
        }));
        setAvailableQualities(qualities);

        video.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage('Falha na conexão de rede do canal. Tentando recuperar...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setErrorMessage('Erro de decodificação no canal. Recuperando mídia...');
              hls.recoverMediaError();
              break;
            default:
              setHasError(true);
              setErrorMessage('Não foi possível carregar este canal no momento.');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || !isHls) {
      // Native Safari / Android Chrome HLS or MP4 fallback
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
        });
      });
      video.addEventListener('error', () => {
        setHasError(true);
        setErrorMessage('Este canal não pôde ser reproduzido ou o servidor bloqueou CORS.');
        setIsLoading(false);
      });
    } else {
      setHasError(true);
      setErrorMessage('Formato de streaming não suportado neste navegador.');
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.url]);

  // Handle Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    triggerControls();
  };

  // Handle Mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
    triggerControls();
  };

  // Fullscreen
  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      try {
        await container.requestFullscreen();
        setIsFullscreen(true);
        // Attempt orientation lock on Android Chrome if available
        if ('orientation' in screen && 'lock' in screen.orientation) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch {
            // Orientation lock permission might be denied or unsupported
          }
        }
      } catch (e) {
        console.warn('Fullscreen request denied', e);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (e) {
        console.warn('Exit fullscreen failed', e);
      }
    }
  };

  // Picture in Picture
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      await video.requestPictureInPicture();
    }
  };

  // Aspect Ratio Styling
  const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case '16:9': return 'aspect-video object-contain';
      case '4:3': return 'aspect-[4/3] object-contain';
      case 'fit': return 'w-full h-full object-contain';
      case 'fill': return 'w-full h-full object-cover';
      case 'stretch': return 'w-full h-full object-fill';
      default: return 'w-full h-full object-contain';
    }
  };

  const cycleAspectRatio = () => {
    const ratios: AspectRatio[] = ['fit', 'fill', '16:9', '4:3', 'stretch'];
    const next = ratios[(ratios.indexOf(settings.aspectRatio) + 1) % ratios.length];
    onUpdateSettings({ aspectRatio: next });
    triggerControls();
  };

  // Quality Changer
  const handleSelectQuality = (id: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = id;
      setCurrentQuality(id);
    }
    setShowQualityMenu(false);
    triggerControls();
  };

  // Mobile Touch Gestures for Volume & Brightness
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;

    // Left half = Brightness, Right half = Volume
    const isLeftHalf = touch.clientX - rect.left < rect.width / 2;
    touchActiveType.current = isLeftHalf ? 'brightness' : 'volume';
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchActiveType.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaY = touchStartY.current - touch.clientY;
    touchStartY.current = touch.clientY;

    const step = deltaY / 200; // sensitivity

    if (touchActiveType.current === 'volume') {
      const currentVol = videoRef.current ? videoRef.current.volume : settings.volume;
      const newVol = Math.max(0, Math.min(1, currentVol + step));
      if (videoRef.current) videoRef.current.volume = newVol;
      onUpdateSettings({ volume: newVol });
      setGestureType('volume');
      setGestureValue(Math.round(newVol * 100));
    } else {
      const newBright = Math.max(0.3, Math.min(1.5, settings.brightness + step));
      onUpdateSettings({ brightness: newBright });
      setGestureType('brightness');
      setGestureValue(Math.round(((newBright - 0.3) / 1.2) * 100));
    }
  };

  const handleTouchEnd = () => {
    touchActiveType.current = null;
    setTimeout(() => {
      setGestureType(null);
    }, 1200);
  };

  const retryStream = () => {
    setHasError(false);
    setIsLoading(true);
    const video = videoRef.current;
    if (video) {
      video.load();
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      // Re-trigger load by re-mounting or calling play
      const src = channel.url;
      channel.url = '';
      setTimeout(() => {
        channel.url = src;
      }, 50);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black overflow-hidden flex items-center justify-center select-none ${
        isFullscreen ? 'h-screen w-screen fixed inset-0 z-50' : 'h-[240px] sm:h-[380px] md:h-[460px] lg:h-[520px] rounded-2xl shadow-2xl border border-slate-800'
      }`}
      onMouseMove={triggerControls}
      onClick={triggerControls}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        style={{ filter: `brightness(${settings.brightness})` }}
        className={`transition-all duration-200 ${getAspectRatioClass(settings.aspectRatio)}`}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onEnded={onNextChannel}
      />

      {/* Loading Spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs pointer-events-none z-20">
          <div className="w-12 h-12 border-3 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-sky-300 font-mono tracking-wide animate-pulse">
            Sincronizando sinal de IPTV...
          </p>
        </div>
      )}

      {/* Stream Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm z-30 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">Erro de Transmissão</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">{errorMessage}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={retryStream}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg shadow-lg active:scale-95 transition-transform"
            >
              <RefreshCw className="w-4 h-4" /> Tentar Reconectar
            </button>
            <button
              onClick={onNextChannel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
            >
              Próximo Canal <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Touch Gesture HUD (Volume & Brightness feedback) */}
      {gestureType && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/75 backdrop-blur-md px-6 py-4 rounded-2xl flex flex-col items-center gap-2 pointer-events-none z-40 border border-white/10 shadow-2xl animate-fade-in">
          {gestureType === 'volume' ? (
            <Volume2 className="w-8 h-8 text-sky-400" />
          ) : (
            <Sun className="w-8 h-8 text-amber-400" />
          )}
          <span className="text-lg font-mono font-bold text-white">{gestureValue}%</span>
          <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${gestureType === 'volume' ? 'bg-sky-500' : 'bg-amber-400'}`} 
              style={{ width: `${gestureValue}%` }} 
            />
          </div>
        </div>
      )}

      {/* Sleep Timer Indicator if active */}
      {settings.sleepTimerMinutes !== null && (
        <div className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-[10px] text-amber-400 font-mono flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          Timer: {settings.sleepTimerMinutes} min
        </div>
      )}

      {/* Channel Header (Always visible or visible with controls) */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 z-20 flex items-center justify-between pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0">
            {channel.logo ? (
              <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
            ) : (
              <Tv className="w-5 h-5 text-sky-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight drop-shadow-sm">
                {channel.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-red-600/90 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                AO VIVO
              </span>
              {channel.resolution && (
                <span className="text-[10px] font-mono text-sky-400 bg-sky-950/80 border border-sky-800/50 px-1 rounded">
                  {channel.resolution}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 truncate max-w-[280px] sm:max-w-md">
              <Radio className="w-3 h-3 text-sky-400 shrink-0" />
              <span>{channel.currentProgram || channel.category}</span>
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => onToggleFavorite(channel.id)}
            title="Favoritar Canal"
            className={`p-2 rounded-lg backdrop-blur-md border transition-colors ${
              isFavorite 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                : 'bg-black/40 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            ★
          </button>
          <button
            onClick={() => setShowQuickList(!showQuickList)}
            title="Lista Rápida de Canais"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-xs text-slate-200 transition-colors"
          >
            <Tv className="w-3.5 h-3.5 text-sky-400" />
            <span>Guia Rápido</span>
          </button>
        </div>
      </div>

      {/* Quick Channel Drawer Overlay */}
      {showQuickList && (
        <div className="absolute top-0 bottom-0 right-0 w-72 sm:w-80 bg-slate-950/95 backdrop-blur-xl border-l border-slate-800 z-40 flex flex-col p-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">Trocar de Canal</h3>
            <button 
              onClick={() => setShowQuickList(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Fechar
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {allChannels.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectChannel(c);
                  setShowQuickList(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-all ${
                  c.id === channel.id 
                    ? 'bg-sky-600/30 border border-sky-500/50 text-white font-semibold' 
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-transparent'
                }`}
              >
                <div className="w-7 h-7 rounded bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                  {c.logo ? (
                    <img src={c.logo} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <Tv className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <div className="truncate flex-1">
                  <div className="truncate text-white">{c.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.category}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Bottom Controls Bar */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 z-20 flex flex-col gap-2 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top line: Program info and EPG button */}
        <div className="flex items-center justify-between text-xs text-slate-300 px-1">
          <div className="flex items-center gap-2 truncate">
            <span className="text-sky-400 font-semibold">{channel.currentProgram}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Próximo: {channel.nextProgram}</span>
          </div>
          <button
            onClick={onOpenEpg}
            className="text-[11px] font-medium text-sky-400 hover:text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 px-2 py-0.5 rounded transition-colors"
          >
            Guia EPG Completo
          </button>
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Left: Playback controls & Channel Zapping */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onPrevChannel}
              title="Canal Anterior (Left Arrow / [)"
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span className="hidden sm:inline text-xs">{isPlaying ? 'Pausar' : 'Assistir'}</span>
            </button>

            <button
              onClick={onNextChannel}
              title="Próximo Canal (Right Arrow / ])"
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Mute/Volume */}
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={toggleMute}
                title="Silenciar / Ativar Som"
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
              </button>
            </div>
          </div>

          {/* Right: Aspect Ratio, Qualities, PiP, Fullscreen */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Aspect Ratio Cycler */}
            <button
              onClick={cycleAspectRatio}
              title={`Proporção da Tela: ${settings.aspectRatio.toUpperCase()}`}
              className="px-2 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-[11px] font-mono flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span className="uppercase">{settings.aspectRatio}</span>
            </button>

            {/* Quality Selector */}
            {availableQualities.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="px-2 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 text-[11px] font-mono transition-colors"
                >
                  {currentQuality === -1 ? 'AUTO' : availableQualities.find(q => q.id === currentQuality)?.name || 'QUALIDADE'}
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-slate-900 border border-slate-700 rounded-lg p-1 shadow-2xl z-50">
                    <button
                      onClick={() => handleSelectQuality(-1)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded flex items-center justify-between ${
                        currentQuality === -1 ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>Automático</span>
                      {currentQuality === -1 && <Check className="w-3.5 h-3.5" />}
                    </button>
                    {availableQualities.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleSelectQuality(q.id)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded flex items-center justify-between ${
                          currentQuality === q.id ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span>{q.name}</span>
                        {currentQuality === q.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Picture in Picture */}
            <button
              onClick={togglePiP}
              title="Mini Player (Picture in Picture)"
              className="hidden sm:inline-flex p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title="Tela Inteira"
              className="p-2 rounded-lg bg-sky-600/80 hover:bg-sky-500 text-white border border-sky-400/30 transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
