import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  category?: string;
  timestamp: Date;
}

export interface User {
  id: string;
  code: string;
  ageRange?: string | null;
  childAgeRange?: string | null;
  country?: string | null;
  createdAt: string;
}

export interface WeeklyRecord {
  id: string;
  weekNumber: number;
  year: number;
  screamLevel: number;
  usedPunishment: boolean;
  appliedGentleLimits: number;
  positiveMoments: number;
  challenges: number;
  notes?: string | null;
}

export interface AppState {
  // Usuario
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Navegación
  currentSection: 'consultation' | 'modules' | 'phrases' | 'progress' | 'academic';
  setSection: (section: AppState['currentSection']) => void;
  
  // Chat
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Progreso
  weeklyRecords: WeeklyRecord[];
  setWeeklyRecords: (records: WeeklyRecord[]) => void;
  addWeeklyRecord: (record: WeeklyRecord) => void;
  
  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Usuario
      user: null,
      setUser: (user) => set({ user }),
      
      // Navegación
      currentSection: 'consultation',
      setSection: (section) => set({ currentSection: section }),
      
      // Chat
      messages: [],
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      clearMessages: () => set({ messages: [] }),
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Progreso
      weeklyRecords: [],
      setWeeklyRecords: (records) => set({ weeklyRecords: records }),
      addWeeklyRecord: (record) => set((state) => ({ 
        weeklyRecords: [...state.weeklyRecords, record] 
      })),
      
      // UI
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      showOnboarding: true,
      setShowOnboarding: (show) => set({ showOnboarding: show }),
    }),
    {
      name: 'crianza-respetuosa-storage',
      partialize: (state) => ({
        user: state.user,
        messages: state.messages,
        weeklyRecords: state.weeklyRecords,
        showOnboarding: state.showOnboarding
      })
    }
  )
);
