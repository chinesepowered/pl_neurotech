import { create } from 'zustand';
import { Dataset, Purchase } from '@/types/marketplace';

interface MarketplaceState {
  datasets: Dataset[];
  purchases: Purchase[];
  loading: boolean;
  setDatasets: (datasets: Dataset[]) => void;
  addDataset: (dataset: Dataset) => void;
  addPurchase: (purchase: Purchase) => void;
  setLoading: (loading: boolean) => void;
}

export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  datasets: [],
  purchases: [],
  loading: false,

  setDatasets: (datasets) => set({ datasets }),
  addDataset: (dataset) => set(state => ({ datasets: [...state.datasets, dataset] })),
  addPurchase: (purchase) => set(state => ({ purchases: [...state.purchases, purchase] })),
  setLoading: (loading) => set({ loading }),
}));
