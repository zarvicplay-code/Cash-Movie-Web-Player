import React from 'react';
import { X, Smartphone, Download, CheckCircle, Tv, ArrowRight, Share2, Sparkles } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onTriggerInstall: () => void;
  isInstalled: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerInstall,
  isInstalled,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Instalar App no Android & TV Box</h3>
              <p className="text-xs text-slate-400">Tenha a experiência completa de aplicativo nativo</p>
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
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Direct Install Button if supported */}
          {deferredPrompt && !isInstalled && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-600/20 via-blue-600/20 to-indigo-600/20 border border-sky-500/40 text-center space-y-2.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Instalação com 1 Toque Disponível
              </span>
              <h4 className="text-sm font-semibold text-white">Instale o CineStream no seu Android</h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Cria o ícone direto na gaveta de aplicativos do seu celular ou TV Box.
              </p>
              <button
                onClick={onTriggerInstall}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Download className="w-4 h-4" /> Instalar Aplicativo Agora
              </button>
            </div>
          )}

          {isInstalled && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>O CineStream já está instalado no seu dispositivo como aplicativo autônomo!</span>
            </div>
          )}

          {/* Step-by-Step Android Guide */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
              Como Instalar Manualmente no Android:
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-white">Abra no Google Chrome do Android</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Toque no menu de três pontos verticais (<strong className="text-white">⋮</strong>) no canto superior direito do navegador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-white">Selecione "Instalar Aplicativo"</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Ou clique em <strong className="text-white">"Adicionar à tela inicial"</strong> na lista do menu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-sky-600/30 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-white">Pronto! Ícone criado no seu Android</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    O CineStream agora abre em tela inteira (Full Screen) sem a barra de endereços do navegador, como um APK nativo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Android TV & TV Box tip */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs">
            <Tv className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Dica para Android TV e TV Box:</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Utilize o navegador da sua TV Box (como TV Bro, Chrome ou JioPages) e adicione aos favoritos ou à tela inicial. Você pode alternar para o <strong>Modo Android TV</strong> nas configurações para uma interface adaptada ao controle remoto!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
