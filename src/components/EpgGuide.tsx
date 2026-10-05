import React from 'react';
import { X, Clock, Calendar, Tv, Play, Radio } from 'lucide-react';
import { Channel } from '../types/iptv';
import { getMockEpgForChannel } from '../data/defaultChannels';

interface EpgGuideProps {
  channel: Channel | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectChannel: (channel: Channel) => void;
  allChannels: Channel[];
}

export const EpgGuide: React.FC<EpgGuideProps> = ({
  channel,
  isOpen,
  onClose,
  onSelectChannel,
  allChannels,
}) => {
  if (!isOpen || !channel) return null;

  const programs = getMockEpgForChannel(channel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
              {channel.logo ? (
                <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
              ) : (
                <Tv className="w-5 h-5 text-sky-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{channel.name}</h3>
                <span className="text-[10px] font-mono uppercase bg-red-600/90 text-white font-bold px-1.5 py-0.5 rounded">
                  AO VIVO
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Guia Eletrônico de Programação (EPG) - Hoje</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Program Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span className="font-semibold text-slate-300">Grade Horária</span>
            <span className="font-mono text-sky-400">Fuso Horário Local</span>
          </div>

          <div className="space-y-3">
            {programs.map((prog, index) => {
              const isCurrent = index === 0;

              return (
                <div
                  key={prog.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-sky-950/40 border-sky-500/80 shadow-md shadow-sky-500/10'
                      : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {prog.start} - {prog.end}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] font-mono uppercase bg-sky-500 text-white font-bold px-1 rounded">
                          No Ar Agora
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-white mb-1">
                    {prog.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-2.5">
                    {prog.description}
                  </p>

                  {/* Progress bar for currently running show */}
                  {isCurrent && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Progresso da transmissão</span>
                        <span className="text-sky-400">{prog.progress}% concluído</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                          style={{ width: `${prog.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick channel switch strip inside EPG */}
          <div className="pt-3 border-t border-slate-800">
            <h5 className="text-xs font-semibold text-slate-300 mb-2">Outros Canais Rápidos</h5>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {allChannels.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectChannel(c);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border flex items-center gap-1.5 transition-colors ${
                    c.id === channel.id
                      ? 'bg-sky-600 text-white border-sky-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
