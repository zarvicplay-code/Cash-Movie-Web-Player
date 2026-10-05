export interface DeviceActivationInfo {
  macAddress: string;
  deviceKey: string;
  isActivated: boolean;
  activationType: 'trial' | 'annual' | 'lifetime';
  expirationDate: string;
  daysRemaining: number;
  activationCode?: string;
  portalUrl: string;
}

export interface VodItem {
  id: string;
  title: string;
  category: string;
  rating: string;
  year: number;
  duration: string;
  poster: string;
  backdrop: string;
  synopsis: string;
  streamUrl: string;
  type: 'movie' | 'series';
  seasonsCount?: number;
  episodesCount?: number;
}
