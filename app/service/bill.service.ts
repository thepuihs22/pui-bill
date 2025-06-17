import { supabase } from '@/lib/supabaseClient';

export async function saveBillId(userId: string, billId: string) {
  // Upsert: insert or update if exists
  return supabase
    .from('bill_sessions')
    .upsert({ user_id: userId, bill_id: billId }, { onConflict: 'user_id' });
}

export async function loadBillId(userId: string) {
  const { data, error } = await supabase
    .from('bill_sessions')
    .select('bill_id')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data?.bill_id ?? null;
}

export async function deleteBillId(userId: string) {
  return supabase.from('bill_sessions').delete().eq('user_id', userId);
}