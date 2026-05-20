import { create } from 'zustand';

export type SupportedLanguage = 'English' | 'Urdu' | 'Roman Urdu';

interface AppState {
  language: SupportedLanguage;
  isDarkMode: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'English',
  isDarkMode: false, // Defaulting to false, but we'll try to use system settings where possible
  
  setLanguage: (lang) => set({ language: lang }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}));
