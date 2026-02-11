import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppView, Project } from '@/types';

interface AppStore {
  // Estado de navegación
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Proyecto actual
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;

  // Lista de proyectos
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Helpers
  resetApp: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Estado inicial
      currentView: 'home',
      currentProject: null,
      projects: [],

      // Acciones
      setCurrentView: (view) => set({ currentView: view }),

      setCurrentProject: (project) => set({ currentProject: project }),

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
          currentProject: project,
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...updates, updatedAt: new Date() }
              : state.currentProject,
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject:
            state.currentProject?.id === id ? null : state.currentProject,
        })),

      resetApp: () =>
        set({
          currentView: 'home',
          currentProject: null,
        }),
    }),
    {
      name: 'intuitus-storage', // Nombre para localStorage
      partialize: (state) => ({
        projects: state.projects, // Solo persistir proyectos
      }),
    }
  )
);
