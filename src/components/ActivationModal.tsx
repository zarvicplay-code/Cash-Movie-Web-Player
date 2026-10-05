import React, { useState } from 'react';
import { 
  X, ShieldCheck, Copy, Check, QrCode, Key, Smartphone, 
  ExternalLink, Sparkles, RefreshCw, AlertCircle, Send, Plus
} from 'lucide-react';
import { DeviceActivationInfo } from '../types/activation';
import { saveDeviceInfo } from '../utils/deviceActivation';
import { CashMovieLogo } from './CashMovieLogo';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceInfo: DeviceActivationInfo;
  onUpdateDeviceInfo: (newInfo: DeviceActivationInfo) => void;
  onAddPlaylistFromActivation: (name: string, url: string) => void;
}

export const ActivationModal: React.FC<ActivationModalProps> = ({
  isOpen,
  onClose,
  deviceInfo,
  onUpdateDeviceInfo,
  onAddPlaylistFromActivation,
}) => {
  const [copiedField, setCopiedField] = useState<'mac' | 'key' | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Custom Playlist via MAC form
  const [playlistUrl, setPlaylistUrl] = useState<string>('');
  const [playlistName, setPlaylistName] = useState<string>('');
  const [showAddPlaylistForm, setShowAddPlaylistForm] = useState<boolean>(false);

  // Edit MAC toggle
  const [isEditingMac, setIsEditingMac] = useState<boolean>(false);
  const [customMacInput, setCustomMacInput] = useState<string>(deviceInfo.macAddress);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: 'mac' | 'key') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveCustomMac = () => {
    const cleanMac = customMacInput.trim().toUpperCase();
    if (!cleanMac) return;
    const updated = { ...deviceInfo, macAddress: cleanMac };
    saveDeviceInfo(updated);
    onUpdateDeviceInfo(updated);
    setIsEditingMac(false);
    setStatusMessage({ text: 'Endereço MAC atualizado com sucesso!', type: 'success' });
  };

  const handleSendPlaylistToMac = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;
    onAddPlaylistFromActivation(
      playlistName.trim() || `Lista MAC (${deviceInfo.macAddress})`,
      playlistUrl.trim()
    );
    setStatusMessage({ text: 'Playlist vinculada e enviada para este MAC com sucesso!', type: 'success' });
    setPlaylistUrl('');
    setPlaylistName('');
    setShowAddPlaylistForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800/80 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <CashMovieLogo size="sm" />
            <div className="h-4 w-px bg-slate-700"></div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Ativação do Dispositivo
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Message */}
          {statusMessage && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* IBO Pro Style Dual Credential Boxes: MAC ADDRESS & DEVICE KEY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Box 1: MAC Address */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    MAC Address (ID)
                  </span>
                  <button
                    onClick={() => setIsEditingMac(!isEditingMac)}
                    className="text-[10px] text-sky-400 hover:underline"
                  >
                    {isEditingMac ? 'Cancelar' : 'Alterar MAC'}
                  </button>
                </div>

                {isEditingMac ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <input
                      type="text"
                      value={customMacInput}
                      onChange={(e) => setCustomMacInput(e.target.value)}
                      placeholder="00:1A:79:..."
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white"
                    />
                    <button
                      onClick={handleSaveCustomMac}
                      className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-lg"
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-white tracking-wider my-1">
                    {deviceInfo.macAddress}
                  </div>
                )}
                <p className="text-[10px] text-slate-500">
                  Identificador exclusivo do seu aplicativo para ativação.
                </p>
              </div>

              <button
                onClick={() => handleCopy(deviceInfo.macAddress, 'mac')}
                className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors active:scale-98"
              >
                {copiedField === 'mac' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">MAC Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                    <span>Copiar MAC Address</span>
                  </>
                )}
              </button>
            </div>

            {/* Box 2: Device Key */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Chave do Dispositivo (Device Key)
                  </span>
                  <Key className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="font-mono text-lg sm:text-xl font-extrabold text-red-400 tracking-widest my-1">
                  {deviceInfo.deviceKey}
                </div>
                <p className="text-[10px] text-slate-500">
                  Código de segurança de 6 dígitos para o portal de ativação.
                </p>
              </div>

              <button
                onClick={() => handleCopy(deviceInfo.deviceKey, 'key')}
                className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors active:scale-98"
              >
                {copiedField === 'key' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Chave Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-red-400" />
                    <span>Copiar Chave</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            deviceInfo.isActivated
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${deviceInfo.isActivated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase font-mono font-bold">
                  Status: {deviceInfo.isActivated ? 'Dispositivo Ativado' : 'Período de Teste'}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {deviceInfo.isActivated 
                    ? (deviceInfo.activationType === 'lifetime' ? 'Licença Vitalícia (Ilimitada)' : `Válido até: ${deviceInfo.expirationDate}`)
                    : `${deviceInfo.daysRemaining} dias restantes de teste grátis`}
                </div>
              </div>
            </div>

            {deviceInfo.isActivated && (
              <span className="text-[10px] font-mono uppercase bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">
                PRO ACTIVE
              </span>
            )}
          </div>

          {/* How to Activate Instructions / Web Portal */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            {/* Mock QR Code for quick scan */}
            <div className="w-24 h-24 bg-white rounded-xl p-2 shrink-0 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="white" />
                {/* QR corners */}
                <rect x="5" y="5" width="30" height="30" fill="black" />
                <rect x="10" y="10" width="20" height="20" fill="white" />
                <rect x="15" y="15" width="10" height="10" fill="black" />
                <rect x="65" y="5" width="30" height="30" fill="black" />
                <rect x="70" y="10" width="20" height="20" fill="white" />
                <rect x="75" y="15" width="10" height="10" fill="black" />
                <rect x="5" y="65" width="30" height="30" fill="black" />
                <rect x="10" y="70" width="20" height="20" fill="white" />
                <rect x="15" y="75" width="10" height="10" fill="black" />
                {/* Random QR pixels */}
                <rect x="45" y="10" width="10" height="10" fill="black" />
                <rect x="40" y="40" width="20" height="20" fill="#dc2626" />
                <rect x="65" y="45" width="10" height="10" fill="black" />
                <rect x="45" y="70" width="10" height="10" fill="black" />
                <rect x="75" y="75" width="15" height="15" fill="black" />
              </svg>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 flex-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Ativação via Painel Web</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Envie o <strong className="text-white">MAC Address</strong> e a <strong className="text-white">Chave do Dispositivo</strong> para o seu revendedor para ativar e sincronizar suas listas M3U remotamente.
              </p>
            </div>
          </div>

          {/* Link / Send Playlist Directly to this MAC */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Vincular Lista M3U a este MAC
              </div>
              <button
                onClick={() => setShowAddPlaylistForm(!showAddPlaylistForm)}
                className="text-xs text-sky-400 hover:underline"
              >
                {showAddPlaylistForm ? 'Ocultar' : '+ Adicionar Link M3U'}
              </button>
            </div>

            {showAddPlaylistForm && (
              <form onSubmit={handleSendPlaylistToMac} className="space-y-3 mt-3 pt-3 border-t border-slate-800">
                <div>
                  <input
                    type="text"
                    placeholder="Nome da Lista (ex: Meus Canais HD)"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    required
                    placeholder="URL M3U / M3U8"
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Vincular Lista ao Dispositivo
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
