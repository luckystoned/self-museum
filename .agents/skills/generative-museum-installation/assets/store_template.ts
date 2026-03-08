import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Status = "idle" | "generating" | "polling" | "done" | "error";

export interface GeneratedItem {
    id: string;
    url: string;
    prompt: string;
    timestamp: number;
    params: Record<string, any>;
}

interface GalleryState {
    selected: Record<string, any>;
    status: Status;
    error: string | null;
    currentImage: string | null;
    history: GeneratedItem[];
    selectedGalleryItem: GeneratedItem | null;
    
    setSelected: (category: string, value: any) => void;
    setSurpriseMe: (selections: Record<string, any>) => void;
    setStatus: (status: Status) => void;
    setError: (error: string | null) => void;
    setCurrentImage: (url: string | null) => void;
    setSelectedGalleryItem: (item: GeneratedItem | null) => void;
    addToHistory: (item: GeneratedItem) => void;
    resetSelection: () => void;
    clearHistory: () => void;
}

export const useGalleryStore = create<GalleryState>()(
    persist(
        (set) => ({
            selected: {},
            status: "idle",
            error: null,
            currentImage: null,
            history: [],
            selectedGalleryItem: null,

            setSelected: (category, value) => set((state) => {
                const isArray = Array.isArray(state.selected[category]);
                const already = isArray 
                    ? (state.selected[category] as any[]).includes(value)
                    : state.selected[category] === value;
                
                return {
                    selected: {
                        ...state.selected,
                        [category]: already 
                            ? (isArray ? [] : '') 
                            : (isArray ? [value] : value)
                    }
                };
            }),

            setSurpriseMe: (selections) => set({ selected: selections }),
            setStatus: (status) => set({ status }),
            setError: (error) => set({ error }),
            setCurrentImage: (url) => set({ currentImage: url }),
            setSelectedGalleryItem: (item) => set({ selectedGalleryItem: item }),
            addToHistory: (item) => set((state) => ({
                history: [item, ...state.history].slice(0, 50)
            })),
            resetSelection: () => set({ selected: {}, status: "idle", currentImage: null }),
            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'generative-gallery-storage',
            partialize: (state) => ({ history: state.history }),
        }
    )
);
