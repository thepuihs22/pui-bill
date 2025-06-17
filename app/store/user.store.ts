import { create } from 'zustand';

export interface UserProfile {
  userId?: string;
  displayName?: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export interface UserStore {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
