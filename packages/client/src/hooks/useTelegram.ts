import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
          };
          start_param?: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: Record<string, string>;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        ready: () => void;
        expand: () => void;
        close: () => void;
        requestFullscreen?: () => void;
        enableClosingConfirmation: () => void;
        disableVerticalSwipes: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
      };
    };
  }
}

export function useTelegram() {
  const [tgUser, setTgUser] = useState<{
    id?: number;
    username?: string;
    displayName: string;
    photoUrl?: string;
  }>({
    displayName: 'Omon Qoluvchi'
  });
  const [startParam, setStartParam] = useState<string | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (wa && wa.initData) {
      setIsTelegram(true);
      try {
        wa.ready();
        wa.expand();
        wa.disableVerticalSwipes?.();
        wa.enableClosingConfirmation?.();
        wa.setHeaderColor?.('#0b0d12');
        wa.setBackgroundColor?.('#07080c');
        
        const user = wa.initDataUnsafe?.user;
        if (user) {
          const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'Omon Qoluvchi';
          setTgUser({
            id: user.id,
            username: user.username,
            displayName: fullName,
            photoUrl: user.photo_url
          });
        }

        if (wa.initDataUnsafe?.start_param) {
          setStartParam(wa.initDataUnsafe.start_param);
        }
      } catch (err) {
        console.warn('Telegram WebApp initialization error:', err);
      }
    }
  }, []);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light') => {
    try {
      const haptic = window.Telegram?.WebApp?.HapticFeedback;
      if (!haptic) return;

      if (type === 'success' || type === 'error' || type === 'warning') {
        haptic.notificationOccurred(type);
      } else {
        haptic.impactOccurred(type);
      }
    } catch {
      // Ignore if not in Telegram
    }
  };

  return {
    isTelegram,
    tgUser,
    startParam,
    triggerHaptic,
    webApp: window.Telegram?.WebApp
  };
}
