import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

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

// In-memory storage (replace with your database in production)
const shareStorage = new Map<string, SharePayload>();

export async function POST(request: Request) {
    try {
        const data = (await request.json()) as SharePayload;
    
        const shareId = nanoid(10);
        shareStorage.set(shareId, data);
    
        // Delete after 24 hours
        setTimeout(() => {
          shareStorage.delete(shareId);
        }, 24 * 60 * 60 * 1000);
    
        return Response.json({ shareId });
      } catch (error: unknown) {
        console.error('Error sharing bill:', error);
        return NextResponse.json({ message: 'Error' }, { status: 500 });
      }
    
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return Response.json({ error: 'No ID provided' }, { status: 400 });
  }

  const data = shareStorage.get(id);
  if (!data) {
    return Response.json({ error: 'Share not found' }, { status: 404 });
  }

  return Response.json(data);
} 