import { Channel } from '../types/iptv';

export interface XtreamCredentials {
  serverUrl: string;
  username: string;
  password: string;
}

export async function fetchXtreamChannels(creds: XtreamCredentials): Promise<Channel[]> {
  let baseUrl = creds.serverUrl.trim();
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `http://${baseUrl}`;
  }

  // 1. Authenticate and get live categories
  const authUrl = `${baseUrl}/player_api.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
  
  const authRes = await fetch(authUrl);
  if (!authRes.ok) {
    throw new Error(`Falha ao conectar no servidor Xtream (${authRes.status})`);
  }
  const authData = await authRes.json();
  if (authData.user_info?.auth === 0 || authData.user_info?.status === 'Disabled') {
    throw new Error(authData.user_info?.message || 'Credenciais inválidas ou conta expirada no Xtream Codes');
  }

  // 2. Fetch live streams
  const liveUrl = `${baseUrl}/player_api.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}&action=get_live_streams`;
  const liveRes = await fetch(liveUrl);
  if (!liveRes.ok) {
    throw new Error('Falha ao carregar lista de canais do servidor Xtream');
  }
  const streams = await liveRes.json();

  if (!Array.isArray(streams)) {
    throw new Error('Resposta de canais em formato inválido do servidor');
  }

  return streams.map((item: any) => {
    const streamId = item.stream_id;
    // Xtream stream format is usually http://server:port/live/user/pass/stream_id.m3u8 or .ts
    const streamUrl = `${baseUrl}/live/${creds.username}/${creds.password}/${streamId}.m3u8`;
    
    return {
      id: `xtream-${streamId}`,
      name: item.name || `Canal ${streamId}`,
      logo: item.stream_icon || undefined,
      url: streamUrl,
      category: item.category_name || 'Geral',
      groupTitle: item.category_name || 'Geral',
      tvgId: item.epg_channel_id || String(streamId),
      isFavorite: false,
      currentProgram: 'Transmissão Ao Vivo',
      nextProgram: 'Próximo Programa',
    };
  });
}
