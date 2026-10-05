import React, { useState } from 'react';
import { X, Plus, Link, Upload, Server, Trash2, Check, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { PlaylistSource, Channel } from '../types/iptv';
import { parseM3U } from '../utils/m3uParser';
import { fetchXtreamChannels } from '../utils/xtreamClient';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannels: (playlist: PlaylistSource, channels: Channel[]) => void;
  savedPlaylists: PlaylistSource[];
  activePlaylistId: string;
  onSwitchPlaylist: (playlistId: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onRestoreDefaults: () => void;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  onAddChannels,
  savedPlaylists,
  activePlaylistId,
  onSwitchPlaylist,
  onDeletePlaylist,
  onRestoreDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'xtream' | 'manage'>('url');
  
  // URL form state
  const [playlistName, setPlaylistName] = useState<string>('');
  const [m3uUrl, setM3uUrl] = useState<string>('');
  
  // Xtream Codes form state
  const [xtreamServer, setXtreamServer] = useState<string>('');
  const [xtreamUser, setXtreamUser] = useState<string>('');
  const [xtreamPass, setXtreamPass] = useState<string>('');

  // Status state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  // Handle URL import
  const handleImportUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!m3uUrl.trim()) {
      setErrorMsg('Por favor insira a URL da lista M3U.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(m3uUrl.trim());
      if (!response.ok) {
        throw new Error(`Falha ao baixar lista HTTP (${response.status})`);
      }
      const text = await response.text();
      const channels = parseM3U(text, `pl-${Date.now()}`);

      if (channels.length === 0) {
        throw new Error('Nenhum canal válido encontrado no arquivo M3U.');
      }

      const newPl: PlaylistSource = {
        id: `pl-${Date.now()}`,
        name: playlistName.trim() || `Lista M3U (${channels.length} canais)`,
        type: 'm3u_url',
        url: m3uUrl.trim(),
        channelCount: channels.length,
        addedAt: new Date().toLocaleDateString('pt-BR'),
      };

      onAddChannels(newPl, channels);
      setSuccessMsg(`Lista carregada com sucesso! ${channels.length} canais adicionados.`);
      setPlaylistName('');
      setM3uUrl('');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(
        err.message?.includes('Failed to fetch')
          ? 'Erro de CORS ou rede ao acessar a URL. Se o servidor da lista bloquear acesso direto do navegador, utilize a opção "Upload de Arquivo".'
          : err.message || 'Falha ao processar lista M3U.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const channels = parseM3U(text, `file-${Date.now()}`);

        if (channels.length === 0) {
          throw new Error('Nenhum canal válido identificado no arquivo.');
        }

        const newPl: PlaylistSource = {
          id: `file-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '') || 'Lista M3U Local',
          type: 'm3u_file',
          channelCount: channels.length,
          addedAt: new Date().toLocaleDateString('pt-BR'),
        };

        onAddChannels(newPl, channels);
        setSuccessMsg(`Arquivo processado! ${channels.length} canais prontos para reproduzir.`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch (err: any) {
        setErrorMsg(err.message || 'Erro ao ler arquivo M3U.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Falha ao ler o arquivo do dispositivo.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  // Handle Xtream Codes import
  const handleImportXtream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xtreamServer.trim() || !xtreamUser.trim() || !xtreamPass.trim()) {
      setErrorMsg('Preencha o servidor, usuário e senha do Xtream Codes.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const channels = await fetchXtreamChannels({
        serverUrl: xtreamServer,
        username: xtreamUser,
        password: xtreamPass,
      });

      const newPl: PlaylistSource = {
        id: `xtream-${Date.now()}`,
        name: playlistName.trim() || `Xtream (${xtreamUser})`,
        type: 'xtream',
        url: xtreamServer.trim(),
        username: xtreamUser.trim(),
        password: xtreamPass.trim(),
        channelCount: channels.length,
        addedAt: new Date().toLocaleDateString('pt-BR'),
      };

      onAddChannels(newPl, channels);
      setSuccessMsg(`Conectado ao Xtream Codes! ${channels.length} canais sincronizados.`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao autenticar no servidor Xtream Codes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gerenciar Listas IPTV</h3>
              <p className="text-xs text-slate-400">Adicione listas M3U, M3U8 ou credenciais Xtream Codes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-2 bg-slate-950/40 border-b border-slate-800 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab('url'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'url' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>URL M3U / M3U8</span>
          </button>
          <button
            onClick={() => { setActiveTab('file'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'file' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Arquivo Local (.m3u)</span>
          </button>
          <button
            onClick={() => { setActiveTab('xtream'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'xtream' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Xtream Codes</span>
          </button>
          <button
            onClick={() => { setActiveTab('manage'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === 'manage' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Minhas Listas ({savedPlaylists.length})</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-4 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
            <Check className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {activeTab === 'url' && (
            <form onSubmit={handleImportUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome da Lista (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Minha Lista de TV"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  URL da Lista M3U / M3U8 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/lista.m3u"
                  required
                  value={m3uUrl}
                  onChange={(e) => setM3uUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Suporta links diretos HTTP/HTTPS contendo marcações #EXTM3U e streams HLS (.m3u8).
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Carregando Canais...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Importar Lista M3U
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'file' && (
            <div className="space-y-4 text-center py-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-2xl p-8 transition-colors flex flex-col items-center justify-center gap-3 bg-slate-950/30">
                <div className="p-3 bg-sky-600/20 text-sky-400 rounded-2xl">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Selecione o arquivo .m3u do seu celular ou PC</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Ideal para listas salvas no armazenamento do dispositivo Android (sem restrições de CORS da web).
                  </p>
                </div>
                <label className="cursor-pointer mt-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md">
                  <span>Procurar Arquivo M3U</span>
                  <input
                    type="file"
                    accept=".m3u,.m3u8,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'xtream' && (
            <form onSubmit={handleImportXtream} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Servidor / Host URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="http://iptv-server.com:8080"
                  required
                  value={xtreamServer}
                  onChange={(e) => setXtreamServer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Usuário <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Seu usuário"
                    required
                    value={xtreamUser}
                    onChange={(e) => setXtreamUser(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Senha <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Sua senha"
                    required
                    value={xtreamPass}
                    onChange={(e) => setXtreamPass(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Apelido da Conexão (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Servidor Principal"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Conectando ao Xtream...
                    </>
                  ) : (
                    <>
                      <Server className="w-4 h-4" /> Conectar Xtream Codes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="font-semibold text-slate-300">Listas Salvas</span>
                <button
                  onClick={onRestoreDefaults}
                  className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Restaurar Canais Padrão
                </button>
              </div>

              <div className="space-y-2">
                {savedPlaylists.map((pl) => {
                  const isActive = pl.id === activePlaylistId;
                  return (
                    <div
                      key={pl.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-sky-950/40 border-sky-500/80 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-semibold text-white truncate">{pl.name}</h4>
                          {isActive && (
                            <span className="text-[10px] bg-sky-500 text-white px-1.5 py-0.2 rounded font-mono">
                              Ativa
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {pl.channelCount} canais · {pl.type.toUpperCase()} · Adicionada em {pl.addedAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isActive && (
                          <button
                            onClick={() => onSwitchPlaylist(pl.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors"
                          >
                            Ativar
                          </button>
                        )}
                        {pl.id !== 'default-playlist' && (
                          <button
                            onClick={() => onDeletePlaylist(pl.id)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/40 transition-colors"
                            title="Remover Lista"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
