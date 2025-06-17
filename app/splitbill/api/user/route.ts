import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const userData = await request.json();

    console.log('starting user create api');
    console.log('userData', userData);

    
    // First, check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('line_user_id', userData.userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error checking existing user:', checkError);
      return NextResponse.json({ error: 'Failed to check existing user' }, { status: 500 });
    }

    if (existingUser) {
      // User exists, update their information
      const { data, error } = await supabase
        .from('users')
        .update({
          display_name: userData.displayName,
          picture_url: userData.pictureUrl,
          status_message: userData.statusMessage,
          updated_at: new Date().toISOString()
        })
        .eq('line_user_id', userData.userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user data:', error);
        return NextResponse.json({ error: 'Failed to update user data' }, { status: 500 });
      }

      return NextResponse.json(data);
    } else {
      // User doesn't exist, create new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          line_user_id: userData.userId,
          display_name: userData.displayName,
          picture_url: userData.pictureUrl,
          status_message: userData.statusMessage,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user data:', error);
        return NextResponse.json({ error: 'Failed to create user data' }, { status: 500 });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}