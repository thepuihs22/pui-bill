import { supabase } from '@/lib/supabaseClient';

async function getUserIdFromLineId(lineUserId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('line_user_id', lineUserId)
    .single();
  
  if (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
  return data?.id ?? null;
}

export async function saveBillId(lineUserId: string, billId: string) {
  const userId = await getUserIdFromLineId(lineUserId);
  if (!userId) {
    console.error('User not found');
    return null;
  }
  
  // Upsert: insert or update if exists
  console.log('saveBillId', userId, billId);
  return supabase
    .from('bill_sessions')
    .upsert({ user_id: userId, bill_id: billId }, { onConflict: 'user_id' });
}

export async function loadBillId(lineUserId: string) {
  const userId = await getUserIdFromLineId(lineUserId);
  if (!userId) {
    console.error('User not found');
    return null;
  }

  console.log('loadBillId', userId);
  const { data, error } = await supabase
    .from('bill_sessions')
    .select('bill_id')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return data?.bill_id ?? null;
}

export async function deleteBillId(lineUserId: string) {
  const userId = await getUserIdFromLineId(lineUserId);
  if (!userId) {
    console.error('User not found');
    return null;
  }

  return supabase.from('bill_sessions').delete().eq('user_id', userId);
}