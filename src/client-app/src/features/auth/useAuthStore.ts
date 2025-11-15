import {create} from 'zustand'

type  AuthState = {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
}

type AuthModalState = {
    isAuthModalOpen : boolean
    toggleAuthModal : ()=>void
    
}

export const useAuthModalStore = create<AuthModalState>((set)=>({
    isAuthModalOpen:false,
    toggleAuthModal : ()=>
        set((state)=>({
            isAuthModalOpen : !state.isAuthModalOpen,
        })),
}))

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (accessToken, refreshToken) =>
    set(() => ({ accessToken, refreshToken })),
  clearTokens: () => set(() => ({ accessToken: null, refreshToken: null })),
}))



