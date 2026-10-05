import { Channel } from '../types/iptv';

export function parseM3U(content: string, playlistPrefix: string = 'pl'): Channel[] {
  const lines = content.split(/\r?\n/);
  const channels: Channel[] = [];
  
  let currentInfo: Partial<Channel> | null = null;
  let counter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      currentInfo = {};
      
      // Parse tvg attributes using regex
      const tvgIdMatch = line.match(/tvg-id=["'](.*?)["']/i);
      const tvgNameMatch = line.match(/tvg-name=["'](.*?)["']/i);
      const tvgLogoMatch = line.match(/tvg-logo=["'](.*?)["']/i);
      const groupTitleMatch = line.match(/group-title=["'](.*?)["']/i);

      if (tvgIdMatch) currentInfo.tvgId = tvgIdMatch[1];
      if (tvgLogoMatch) currentInfo.logo = tvgLogoMatch[1];
      
      // Extract Category from group-title or default
      const category = groupTitleMatch ? groupTitleMatch[1].trim() : 'Geral';
      currentInfo.category = category;
      currentInfo.groupTitle = category;

      // Extract channel name (everything after the last comma)
      const commaIndex = line.lastIndexOf(',');
      let channelName = '';
      if (commaIndex !== -1) {
        channelName = line.substring(commaIndex + 1).trim();
      } else if (tvgNameMatch) {
        channelName = tvgNameMatch[1];
      } else {
        channelName = `Canal ${counter}`;
      }

      currentInfo.name = channelName;
      currentInfo.id = `${playlistPrefix}-${counter}`;
      counter++;
    } else if (line.startsWith('http://') || line.startsWith('https://') || line.endsWith('.m3u8') || line.endsWith('.ts')) {
      if (currentInfo) {
        currentInfo.url = line;
        channels.push({
          id: currentInfo.id || `${playlistPrefix}-${counter++}`,
          name: currentInfo.name || `Canal ${channels.length + 1}`,
          logo: currentInfo.logo,
          url: line,
          category: currentInfo.category || 'Geral',
          groupTitle: currentInfo.groupTitle || 'Geral',
          tvgId: currentInfo.tvgId,
          isFavorite: false,
          currentProgram: 'Transmissão Ao Vivo',
          nextProgram: 'Programação Sequencial',
        });
        currentInfo = null;
      }
    }
  }

  return channels;
}
