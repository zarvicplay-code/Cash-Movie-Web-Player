import React from 'react';
import { X, Tv, Moon, Zap, Keyboard, Smartphone, Sliders } from 'lucide-react';
import { PlayerSettings } from '../types/iptv';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlayerSettings;
  onUpdateSettings: (newSettings: Partial<PlayerSettings>) => void;
  onOpenInstallGuide: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenInstallGuide,
}) => {
  if (!isOpen) return null;

  const sleepTimerOptions = [null, 15, 30, 45, 60, 120];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configurações & Android TV</h3>
              <p className="text-xs text-slate-400">Personalize o reprodutor, performance e controles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* Section: Interface & Layout Mode */}
          <div>
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tv className="w-4 h-4" /> Modo de Visualização
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ tvMode: false })}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  !settings.tvMode
                    ? 'bg-sky-950/40 border-sky-500 text-white shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-2 text-sky-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Modo Celular / Tablet</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Otimizado para toque, gestos de brilho/volume e rolagem rápida.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ tvMode: true })}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  settings.tvMode
                    ? 'bg-sky-950/40 border-sky-500 text-white shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Tv className="w-5 h-5 mb-2 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Modo Android TV / TV Box</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Interface 10-foot, botões ampliados e navegação por controle remoto (D-Pad).
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Section: Sleep Timer */}
          <div>
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Moon className="w-4 h-4" /> Timer de Desligamento (Sleep Timer)
            </h4>
            <p className="text-xs text-slate-400 mb-2.5">
              Pausa a transmissão automaticamente após o tempo escolhido para economizar dados e bateria.
            </p>
            <div className="flex flex-wrap gap-2">
              {sleepTimerOptions.map((time) => {
                const isSelected = settings.sleepTimerMinutes === time;
                return (
                  <button
                    key={time === null ? 'off' : time}
                    type="button"
                    onClick={() => onUpdateSettings({ sleepTimerMinutes: time })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      isSelected
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {time === null ? 'Desativado' : `${time} min`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Buffer Size & Performance */}
          <div>
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Memória de Buffer (HLS Buffer)
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { sec: 15, label: '15 seg (Rápido)', desc: 'Menor atraso de sinal' },
                { sec: 30, label: '30 seg (Padrão)', desc: 'Equilibrado e estável' },
                { sec: 60, label: '60 seg (Robusto)', desc: 'Ideal para conexões lentas' },
              ].map((opt) => (
                <button
                  key={opt.sec}
                  type="button"
                  onClick={() => onUpdateSettings({ bufferLengthSec: opt.sec })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    settings.bufferLengthSec === opt.sec
                      ? 'bg-sky-950/40 border-sky-500 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Remote Control and Keyboard Shortcuts Cheatsheet */}
          <div>
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4" /> Atalhos do Controle Remoto / Teclado
            </h4>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Próximo Canal:</span>
                <span className="font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400">
                  Seta Direita / ]
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Canal Anterior:</span>
                <span className="font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400">
                  Seta Esquerda / [
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Pausar / Play:</span>
                <span className="font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400">
                  Espaço / OK
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Tela Inteira:</span>
                <span className="font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400">
                  F
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Mudo:</span>
                <span className="font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400">
                  M
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Navegar Canais:</span>
                <span className="font-mono bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] text-sky-400">
                  D-Pad Cima / Baixo
                </span>
              </div>
            </div>
          </div>

          {/* Install on Android Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-800/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-sky-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white">Instalar no Android (APK / PWA)</div>
                <div className="text-[11px] text-slate-300">
                  Execute em tela cheia na sua TV Box ou smartphone sem barras de navegador.
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenInstallGuide();
              }}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shrink-0 shadow transition-colors"
            >
              Ver Como Instalar
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Salvar e Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
