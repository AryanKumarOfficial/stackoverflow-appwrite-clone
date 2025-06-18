"use client";

import { create } from "zustand";
import { persist, subscribeWithSelector, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { account } from "@/Models/client/config";
import { Models } from "appwrite";

// Enhanced user preferences interface
export interface UserPrefs {
  reputation?: number;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  preferences?: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      answers: boolean;
      votes: boolean;
      mentions: boolean;
    };
    privacy: {
      showEmail: boolean;
      showLocation: boolean;
      showActivity: boolean;
    };
  };
}

interface AuthState {
  // State
  session: Models.Session | null;
  user: Models.User<UserPrefs> | null;
  isLoading: boolean;
  isHydrated: boolean;
  lastSync: number | null;
  connectionStatus: "online" | "offline" | "reconnecting";

  // Actions
  verifySession: () => Promise<void>;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: any }>;
  createAccount: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<void>;
  updateUserPrefs: (
    prefs: Partial<UserPrefs>,
  ) => Promise<{ success: boolean; error?: any }>;
  refreshUser: () => Promise<void>;
  setConnectionStatus: (status: "online" | "offline" | "reconnecting") => void;

  // Internal actions
  setHydrated: () => void;
  reset: () => void;
}

// Initial state
const initialState = {
  session: null,
  user: null,
  isLoading: false,
  isHydrated: false,
  lastSync: null,
  connectionStatus: "online" as const,
};

// Create the store with multiple middlewares
export const useAuthStore = create<AuthState>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          ...initialState,

          // Verify existing session
          verifySession: async () => {
            try {
              set((state) => {
                state.isLoading = true;
              });

              const session = await account.getSession("current");
              const user = await account.get<UserPrefs>();

              set((state) => {
                state.session = session;
                state.user = user;
                state.isLoading = false;
                state.lastSync = Date.now();
                state.connectionStatus = "online";
              });
            } catch (error) {
              console.error("Failed to verify session:", error);
              set((state) => {
                state.session = null;
                state.user = null;
                state.isLoading = false;
                state.connectionStatus = "offline";
              });
            }
          },

          // Login user
          login: async (email: string, password: string) => {
            try {
              set((state) => {
                state.isLoading = true;
              });

              const session = await account.createEmailPasswordSession(
                email,
                password,
              );
              const user = await account.get<UserPrefs>();

              set((state) => {
                state.session = session;
                state.user = user;
                state.isLoading = false;
                state.lastSync = Date.now();
                state.connectionStatus = "online";
              });

              return { success: true };
            } catch (error) {
              console.error("Login failed:", error);
              set((state) => {
                state.isLoading = false;
                state.connectionStatus = "offline";
              });
              return { success: false, error };
            }
          },

          // Create new account
          createAccount: async (
            name: string,
            email: string,
            password: string,
          ) => {
            try {
              set((state) => {
                state.isLoading = true;
              });

              await account.create("unique()", email, password, name);

              // Automatically log in after account creation
              const loginResult = await get().login(email, password);

              if (loginResult.success) {
                // Set default preferences for new users
                await get().updateUserPrefs({
                  reputation: 1,
                  preferences: {
                    theme: "dark",
                    notifications: {
                      email: true,
                      push: true,
                      answers: true,
                      votes: true,
                      mentions: true,
                    },
                    privacy: {
                      showEmail: false,
                      showLocation: true,
                      showActivity: true,
                    },
                  },
                });
              }

              return loginResult;
            } catch (error) {
              console.error("Account creation failed:", error);
              set((state) => {
                state.isLoading = false;
              });
              return { success: false, error };
            }
          },

          // Logout user
          logout: async () => {
            try {
              set((state) => {
                state.isLoading = true;
              });

              await account.deleteSession("current");

              set((state) => {
                state.session = null;
                state.user = null;
                state.isLoading = false;
                state.lastSync = null;
              });
            } catch (error) {
              console.error("Logout failed:", error);
              // Clear state anyway
              set((state) => {
                state.session = null;
                state.user = null;
                state.isLoading = false;
                state.lastSync = null;
              });
            }
          },

          // Update user preferences
          updateUserPrefs: async (prefs: Partial<UserPrefs>) => {
            try {
              const currentUser = get().user;
              if (!currentUser) throw new Error("No user logged in");

              const updatedPrefs = {
                ...currentUser.prefs,
                ...prefs,
              };

              await account.updatePrefs(updatedPrefs);
              const refreshedUser = await account.get<UserPrefs>();

              set((state) => {
                state.user = refreshedUser;
                state.lastSync = Date.now();
              });

              return { success: true };
            } catch (error) {
              console.error("Failed to update preferences:", error);
              return { success: false, error };
            }
          },

          // Refresh user data
          refreshUser: async () => {
            try {
              const user = await account.get<UserPrefs>();
              set((state) => {
                state.user = user;
                state.lastSync = Date.now();
                state.connectionStatus = "online";
              });
            } catch (error) {
              console.error("Failed to refresh user:", error);
              set((state) => {
                state.connectionStatus = "offline";
              });
            }
          },

          // Set connection status
          setConnectionStatus: (
            status: "online" | "offline" | "reconnecting",
          ) => {
            set((state) => {
              state.connectionStatus = status;
            });
          },

          // Set hydrated state
          setHydrated: () => {
            set((state) => {
              state.isHydrated = true;
            });
          },

          // Reset store
          reset: () => {
            set((state) => {
              Object.assign(state, initialState);
            });
          },
        })),
        {
          name: "auth-store",
          version: 1,
          partialize: (state) => ({
            session: state.session,
            user: state.user,
            lastSync: state.lastSync,
          }),
          onRehydrateStorage: () => (state) => {
            if (state) {
              state.setHydrated();

              // Auto-verify session if it exists and isn't too old
              if (state.session && state.lastSync) {
                const hoursSinceSync =
                  (Date.now() - state.lastSync) / (1000 * 60 * 60);
                if (hoursSinceSync < 24) {
                  state.verifySession();
                }
              }
            }
          },
        },
      ),
    ),
    {
      name: "auth-store",
    },
  ),
);

// Selectors for optimized subscriptions
export const useSession = () => useAuthStore((state) => state.session);
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.session);
export const useConnectionStatus = () =>
  useAuthStore((state) => state.connectionStatus);

// Auto-sync setup
if (typeof window !== "undefined") {
  // Listen for online/offline events
  window.addEventListener("online", () => {
    useAuthStore.getState().setConnectionStatus("online");
    // Refresh user data when coming back online
    if (useAuthStore.getState().session) {
      useAuthStore.getState().refreshUser();
    }
  });

  window.addEventListener("offline", () => {
    useAuthStore.getState().setConnectionStatus("offline");
  });

  // Periodic sync when document becomes visible
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const state = useAuthStore.getState();
      if (state.session && state.connectionStatus === "online") {
        // Refresh if last sync was more than 5 minutes ago
        const minutesSinceSync = state.lastSync
          ? (Date.now() - state.lastSync) / (1000 * 60)
          : Infinity;

        if (minutesSinceSync > 5) {
          state.refreshUser();
        }
      }
    }
  });
}
