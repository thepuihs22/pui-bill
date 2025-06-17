import { create } from 'zustand';
import { saveBillId, loadBillId, deleteBillId } from '../service/bill.service';

export interface BillStore {
  billId: string;
  setBillId: (userId: string, billId: string) => Promise<void>;
  clearBillId: (userId: string) => Promise<void>;
  loadBillId: (userId: string) => Promise<void>;
}

export const useBillStore = create<BillStore>((set) => ({
  billId: '',
  setBillId: async (userId, billId) => {
    await saveBillId(userId, billId);
    set({ billId });
  },
  clearBillId: async (userId) => {
    await deleteBillId(userId);
    set({ billId: '' });
  },
  loadBillId: async (userId) => {
    const billId = await loadBillId(userId);
    set({ billId: billId ?? '' });
  },
}));