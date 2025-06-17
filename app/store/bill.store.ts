import { create } from 'zustand';

export interface BillStore {
    billId: string;
    setBillId: (billId: string) => void;
    clearBillId: () => void;
}

export const useBillStore = create<BillStore>((set) => ({
    billId: '',
    setBillId: (billId) => set({ billId }),
    clearBillId: () => set({ billId: '' }),
}));