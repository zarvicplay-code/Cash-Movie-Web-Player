import React from 'react';
import { 
  X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  Volume2, VolumeX, Maximize2, Radio, Info, Home, ArrowLeft
} from 'lucide-react';

interface VirtualRemoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNextChannel: () => void;
  onPrevChannel: () => void;
  onTogglePlay: () => void;
  onOpenEpg: () => void;
  onToggleFullscreen: () => void;
}

export const VirtualRemoteModal: React.FC<VirtualRemoteModalProps> = ({
  isOpen,
  onClose,
  onNextChannel,
  onPrevChannel,
  onTogglePlay,
  onOpenEpg,
  onToggleFullscreen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-72 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center gap-4">
        {/* Remote Header */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-slate-300">CONTROLE REMOTO</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Function Buttons */}
        <div className="w-full grid grid-cols-3 gap-2">
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-[10px] text-slate-400 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 mb-0.5 text-slate-300" />
            <span>Voltar</span>
          </button>
          <button
            onClick={onOpenEpg}
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-[10px] text-sky-400 active:scale-95"
          >
            <Info className="w-4 h-4 mb-0.5" />
            <span>Guia EPG</span>
          </button>
          <button
            onClick={onToggleFullscreen}
            className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 flex flex-col items-center justify-center text-[10px] text-slate-400 active:scale-95"
          >
            <Maximize2 className="w-4 h-4 mb-0.5 text-slate-300" />
            <span>Tela</span>
          </button>
        </div>

        {/* Circular D-Pad */}
        <div className="relative w-48 h-48 rounded-full bg-slate-950 border-2 border-slate-800 shadow-inner flex items-center justify-center">
          {/* Up */}
          <button
            onClick={onPrevChannel}
            title="Canal Anterior (Up)"
            className="absolute top-2 left-1/2 -translate-x-1/2 p-3 text-slate-400 hover:text-white active:scale-90 transition-transform"
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          {/* Down */}
          <button
            onClick={onNextChannel}
            title="Próximo Canal (Down)"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 p-3 text-slate-400 hover:text-white active:scale-90 transition-transform"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          {/* Left */}
          <button
            onClick={onPrevChannel}
            title="Anterior (Left)"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-white active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right */}
          <button
            onClick={onNextChannel}
            title="Próximo (Right)"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-white active:scale-90 transition-transform"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Center OK Button */}
          <button
            onClick={onTogglePlay}
            title="OK / Play / Pause"
            className="w-16 h-16 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center active:scale-95 transition-all"
          >
            OK
          </button>
        </div>

        {/* Channel & Volume Rockers */}
        <div className="w-full grid grid-cols-2 gap-3 pt-2">
          {/* Channel CH+/CH- */}
          <div className="flex flex-col items-center bg-slate-950/70 border border-slate-800 rounded-2xl p-1">
            <button
              onClick={onNextChannel}
              className="w-full py-2 flex items-center justify-center text-xs font-bold text-slate-200 hover:text-white active:scale-95"
            >
              CH +
            </button>
            <span className="text-[10px] text-slate-500 uppercase font-mono py-0.5">Canal</span>
            <button
              onClick={onPrevChannel}
              className="w-full py-2 flex items-center justify-center text-xs font-bold text-slate-200 hover:text-white active:scale-95"
            >
              CH -
            </button>
          </div>

          {/* Quick Zapping helper */}
          <div className="flex flex-col items-center justify-center bg-slate-950/70 border border-slate-800 rounded-2xl p-2 text-center">
            <Radio className="w-5 h-5 text-sky-400 mb-1" />
            <span className="text-[11px] font-semibold text-slate-300">Zapping Rápido</span>
            <span className="text-[10px] text-slate-500">Troca instantânea</span>
          </div>
        </div>
      </div>
    </div>
  );
};
