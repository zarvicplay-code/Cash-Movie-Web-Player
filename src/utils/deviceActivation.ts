import { DeviceActivationInfo } from '../types/activation';

const STORAGE_KEY = 'cashmovie_device_activation';

function generateRandomHex(length: number): string {
  const chars = '0123456789ABCDEF';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}

function generateMacAddress(): string {
  // Classic IPTV MAG/IBO style prefix: 00:1A:79
  return `00:1A:79:${generateRandomHex(2)}:${generateRandomHex(2)}:${generateRandomHex(2)}`;
}

function generateDeviceKey(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOrCreateDeviceInfo(): DeviceActivationInfo {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (e) {
    console.warn('Could not read activation info from storage', e);
  }

  // Create new default initial device info
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7); // 7-day trial by default

  const initialInfo: DeviceActivationInfo = {
    macAddress: generateMacAddress(),
    deviceKey: generateDeviceKey(),
    isActivated: false,
    activationType: 'trial',
    expirationDate: futureDate.toLocaleDateString('pt-BR'),
    daysRemaining: 7,
    portalUrl: 'https://cashmovie.app/activate',
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInfo));
  } catch (e) {
    console.warn('Could not save activation info', e);
  }

  return initialInfo;
}

export function activateDeviceWithCode(
  code: string,
  currentInfo: DeviceActivationInfo
): { success: boolean; info: DeviceActivationInfo; message: string } {
  const cleanCode = code.trim().toUpperCase();

  if (!cleanCode) {
    return {
      success: false,
      info: currentInfo,
      message: 'Por favor, insira um código de ativação válido.',
    };
  }

  // Calculate new expiration based on code
  const isLifetime = cleanCode.includes('LIFE') || cleanCode.includes('VITAL') || cleanCode === 'CASH-PRO-LIFETIME';
  const newType = isLifetime ? 'lifetime' : 'annual';
  
  const exp = new Date();
  if (isLifetime) {
    exp.setFullYear(exp.getFullYear() + 20); // 20 years
  } else {
    exp.setFullYear(exp.getFullYear() + 1); // 1 year
  }

  const updated: DeviceActivationInfo = {
    ...currentInfo,
    isActivated: true,
    activationType: newType,
    expirationDate: isLifetime ? 'Vitalício (Sem Expiração)' : exp.toLocaleDateString('pt-BR'),
    daysRemaining: isLifetime ? 9999 : 365,
    activationCode: cleanCode,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save activation state', e);
  }

  return {
    success: true,
    info: updated,
    message: isLifetime
      ? 'Dispositivo ativado com sucesso em modo VITALÍCIO!'
      : 'Dispositivo ativado com sucesso por 1 ANO!',
  };
}

export function saveDeviceInfo(info: DeviceActivationInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch (e) {
    console.warn('Failed to save device info', e);
  }
}
