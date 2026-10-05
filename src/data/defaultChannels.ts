import { Channel, EpgProgram } from '../types/iptv';

export const DEFAULT_CHANNELS: Channel[] = [
  {
    id: 'ch-tvbrasil',
    name: 'TV Brasil HD',
    logo: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=128&auto=format&fit=crop&q=80',
    url: 'https://tvbrasil-stream.ebc.com.br/index.m3u8',
    category: 'Notícias & Aberta',
    groupTitle: 'Brasil',
    resolution: '1080p',
    currentProgram: 'Repórter Brasil Noite',
    nextProgram: 'Sem Censura',
  },
  {
    id: 'ch-camara',
    name: 'TV Câmara Brasil',
    logo: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=128&auto=format&fit=crop&q=80',
    url: 'https://stream3.camara.gov.br/tv5/manifest.m3u8',
    category: 'Notícias & Aberta',
    groupTitle: 'Brasil',
    resolution: '720p',
    currentProgram: 'Sessão Plenária Ao Vivo',
    nextProgram: 'Jornal da Câmara',
  },
  {
    id: 'ch-senado',
    name: 'TV Senado Federal',
    logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=128&auto=format&fit=crop&q=80',
    url: 'https://streaming.senado.gov.br/tv1/manifest.m3u8',
    category: 'Notícias & Aberta',
    groupTitle: 'Brasil',
    resolution: '720p',
    currentProgram: 'Comissão de Constituição e Justiça',
    nextProgram: 'Em Discussão',
  },
  {
    id: 'ch-nasa-public',
    name: 'NASA TV Live HD',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    category: 'Documentários & Ciência',
    groupTitle: 'Ciência',
    resolution: '1080p',
    currentProgram: 'ISS Live Feed & Space Walks',
    nextProgram: 'Artemis Lunar Mission Updates',
  },
  {
    id: 'ch-redbull',
    name: 'Red Bull TV Extreme Sports',
    logo: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=128&auto=format&fit=crop&q=80',
    url: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
    category: 'Esportes',
    groupTitle: 'Ação',
    resolution: '1080p',
    currentProgram: 'UCI Mountain Bike World Cup',
    nextProgram: 'Red Bull Cliff Diving Championship',
  },
  {
    id: 'ch-euronews-pt',
    name: 'Euronews em Português',
    logo: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=128&auto=format&fit=crop&q=80',
    url: 'https://euronews-euronews-portuguese-1-us.samsung.wurl.tv/playlist.m3u8',
    category: 'Notícias & Aberta',
    groupTitle: 'Internacional',
    resolution: '1080p',
    currentProgram: 'Euronews Hoje - Plantão Mundial',
    nextProgram: 'No Agenda & Ciência Global',
  },
  {
    id: 'ch-dw-news',
    name: 'DW News HD (Deutsche Welle)',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=128&auto=format&fit=crop&q=80',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    category: 'Notícias & Aberta',
    groupTitle: 'Internacional',
    resolution: '1080p',
    currentProgram: 'DW News Global Hourly',
    nextProgram: 'Conflict Zone & Eco Africa',
  },
  {
    id: 'ch-france24',
    name: 'France 24 HD Internacional',
    logo: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=128&auto=format&fit=crop&q=80',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    category: 'Notícias & Aberta',
    groupTitle: 'Internacional',
    resolution: '1080p',
    currentProgram: 'Live World News & Paris Live',
    nextProgram: 'Eye on Africa & The Debate',
  },
  {
    id: 'ch-aljazeera',
    name: 'Al Jazeera English HD',
    logo: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=128&auto=format&fit=crop&q=80',
    url: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
    category: 'Notícias & Aberta',
    groupTitle: 'Internacional',
    resolution: '1080p',
    currentProgram: 'Al Jazeera Live News Hour',
    nextProgram: 'Inside Story & Witness',
  },
  {
    id: 'ch-cartoons',
    name: 'Retro Toons Clássicos',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=128&auto=format&fit=crop&q=80',
    url: 'https://amg01448-cinedigm-retrocartoons-samsungus-e8wvh.amagi.tv/playlist.m3u8',
    category: 'Infantil & Desenhos',
    groupTitle: 'Animação',
    resolution: '720p',
    currentProgram: 'As Aventuras de Popeye & Betty Boop',
    nextProgram: 'Superman Clássico dos Anos 40',
  },
  {
    id: 'ch-lofigirl',
    name: 'Lofi Chillhop Radio 24/7',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=128&auto=format&fit=crop&q=80',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    category: 'Música & Lazer',
    groupTitle: 'Música',
    resolution: '1080p',
    currentProgram: 'Relaxing Beats to Relax / Study to',
    nextProgram: 'Midnight Chillhop Lounge',
  },
  {
    id: 'ch-bigbuck',
    name: 'Cine Cinema 4K Demo',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=128&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Filmes & Séries',
    groupTitle: 'Cinema',
    resolution: '4K HDR',
    currentProgram: 'Open Source Cinema: Big Buck Bunny',
    nextProgram: 'Tears of Steel Sci-Fi',
  },
  {
    id: 'ch-tears-steel',
    name: 'Sci-Fi Action TV',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=128&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    category: 'Filmes & Séries',
    groupTitle: 'Cinema',
    resolution: '1080p',
    currentProgram: 'Tears of Steel: Operação Amsterdã',
    nextProgram: 'Cosmos Odyssey Episódio 3',
  },
  {
    id: 'ch-sintel',
    name: 'Anime & Fantasia HD',
    logo: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=128&auto=format&fit=crop&q=80',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    category: 'Infantil & Desenhos',
    groupTitle: 'Animação',
    resolution: '1080p',
    currentProgram: 'Sintel: O Resgate do Dragão',
    nextProgram: 'Elephants Dream Fantasy',
  }
];

export const CATEGORIES = [
  'Todos',
  'Favoritos',
  'Notícias & Aberta',
  'Esportes',
  'Filmes & Séries',
  'Infantil & Desenhos',
  'Documentários & Ciência',
  'Música & Lazer',
];

export function getMockEpgForChannel(channel: Channel): EpgProgram[] {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  const h1 = currentHour;
  const h2 = (currentHour + 1) % 24;
  const h3 = (currentHour + 2) % 24;
  const h4 = (currentHour + 3) % 24;

  const currentProgress = Math.round((currentMinute / 60) * 100);

  return [
    {
      id: 'epg-1',
      title: channel.currentProgram || `${channel.name} - Ao Vivo`,
      start: `${pad(h1)}:00`,
      end: `${pad(h2)}:00`,
      description: `Transmissão em alta definição com as últimas novidades, matérias exclusivas e cobertura de ${channel.category}.`,
      progress: currentProgress,
    },
    {
      id: 'epg-2',
      title: channel.nextProgram || 'Programa Especial em Destaque',
      start: `${pad(h2)}:00`,
      end: `${pad(h3)}:00`,
      description: 'Análises aprofundadas, debates e entretenimento para toda a família.',
      progress: 0,
    },
    {
      id: 'epg-3',
      title: 'Edição Noturna / Melhores Momentos',
      start: `${pad(h3)}:00`,
      end: `${pad(h4)}:00`,
      description: 'Resumo completo das atrações diárias com conteúdos especiais arquivados.',
      progress: 0,
    },
    {
      id: 'epg-4',
      title: 'Sessão da Madrugada',
      start: `${pad(h4)}:00`,
      end: `${pad((h4 + 1) % 24)}:00`,
      description: 'Músicas, documentários relaxantes e programação contínua sem comerciais.',
      progress: 0,
    }
  ];
}
