import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SharePayload {
  orders: {
    name: string;
    value: number;
    selectedPeople: string[];
    payer: string;
  }[];
  people: {
    name: string;
    paid: number;
    owes: number;
    balance: number;
  }[];
  paymentInfo: {
    accountName: string;
    promptpay: string;
    fullName: string;
    bankName: string;
  };
  totalAmount: number;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as SharePayload;
    
    // Insert data into Supabase and get the generated UUID
    const { data: insertedData, error } = await supabase
      .from('shared_bills')
      .insert({
        ...data,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      })
      .select('id')
      .single();

    if (error) throw error;
    
    return Response.json({ shareId: insertedData.id });
  } catch (error: unknown) {
    console.error('Error sharing bill:', error);
    return NextResponse.json({ message: 'Error sharing bill' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'No ID provided' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('shared_bills')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return Response.json({ error: 'Share not found' }, { status: 404 });
    }

    // Check if the share has expired
    if (new Date(data.expires_at) < new Date()) {
      return Response.json({ error: 'Share has expired' }, { status: 410 });
    }

    return Response.json(data);
  } catch (error: unknown) {
    console.error('Error fetching shared bill:', error);
    return NextResponse.json({ message: 'Error fetching shared bill' }, { status: 500 });
  }
} 