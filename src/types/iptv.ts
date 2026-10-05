export interface Channel {
  id: string;
  name: string;
  logo?: string;
  url: string;
  category: string;
  groupTitle?: string;
  tvgId?: string;
  isFavorite?: boolean;
  resolution?: string;
  currentProgram?: string;
  nextProgram?: string;
}

export interface EpgProgram {
  id: string;
  title: string;
  start: string; // HH:mm
  end: string;   // HH:mm
  description: string;
  progress: number; // 0 to 100
}

export interface PlaylistSource {
  id: string;
  name: string;
  type: 'default' | 'm3u_url' | 'm3u_file' | 'xtream';
  url?: string;
  username?: string;
  password?: string;
  channelCount: number;
  addedAt: string;
}

export type AspectRatio = '16:9' | '4:3' | 'fit' | 'fill' | 'stretch';

export interface PlayerSettings {
  aspectRatio: AspectRatio;
  autoPlay: boolean;
  bufferLengthSec: number;
  enableHardwareAcceleration: boolean;
  tvMode: boolean; // 10-foot UI for Android TV / TV Box
  volume: number;
  brightness: number; // 0.2 to 1.5
  sleepTimerMinutes: number | null; // null or minutes remaining
}
