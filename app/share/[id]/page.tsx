/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Order {
  name: string;
  value: number;
  payer: string;
  selectedPeople: string[];
}

interface Person {
  name: string;
  paid: number;
  owes: number;
  balance: number;
}

interface ShareData {
  orders: Order[];
  people: Person[];
  paymentInfo?: {
    fullName?: string;
    accountName?: string;
    bankName?: string;
    promptpay?: string;
  };
  totalAmount: number;
  timestamp: number;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(num));
};

function calculateTotalAmount(orders: Order[]): number {
  return orders.reduce((total, order) => total + order.value, 0);
}

function calculatePersonalSummary(person: string, orders: Order[]): Person {
  let paid = 0;
  let owes = 0;

  orders.forEach(order => {
    if (order.payer === person) {
      paid += order.value;
    }
    if (order.selectedPeople.includes(person)) {
      owes += order.value / order.selectedPeople.length;
    }
  });

  return {
    name: person,
    paid,
    owes,
    balance: paid - owes
  };
}

export default function SharedBill() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareData | null>(null);

  useEffect(() => {
    const loadSharedBill = async () => {
      try {
        const response = await fetch(`/api/share?id=${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Shared bill not found');
            toast.error('Shared bill not found');
          } else if (response.status === 410) {
            setError('This shared bill has expired');
            toast.error('This shared bill has expired');
          } else {
            setError('Failed to load shared bill');
            toast.error('Failed to load shared bill');
          }
          return;
        }

        const data = await response.json();
        console.log(data);
        setShareData(data);
        toast.success('Bill loaded successfully');
      } catch (error) {
        console.error('Error loading shared bill:', error);
        setError('Failed to load shared bill');
        toast.error('Failed to load shared bill');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadSharedBill();
    }
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Link 
          href="/" 
          className="mt-4 text-blue-500 hover:underline"
        >
          Create New Bill
        </Link>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="max-w-lg mx-auto p-4 font-mono dark:bg-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-center bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
          Bill Not Found
        </h1>
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block bg-slate-400 dark:bg-slate-700 px-6 py-2 border-2 border-black dark:border-white rounded-md shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] dark:hover:shadow-[2px_2px_0px_0px_white] transition-all"
          >
            Create New Bill
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = calculateTotalAmount(shareData.orders);
  const peopleWithCalculatedValues = shareData.people.map((person: Person) => {
    const calculations = calculatePersonalSummary(person.name, shareData.orders);
    return {
      name: person.name,
      paid: calculations.paid,
      owes: calculations.owes,
      balance: calculations.balance
    };
  });

  return (
    <div className="max-w-lg mx-auto p-4 font-mono dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
        Bill Summary
      </h1>

      {/* Payment Information */}
      {!!shareData?.payment_info && (
        <div className="mb-6 bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
          <h2 className="font-bold text-xl mb-4">Payment Information</h2>
          {shareData.payment_info?.fullName && (
            <p><strong>Full Name:</strong> {shareData.payment_info?.fullName}</p>
          )}
          {shareData.payment_info?.accountName && (
            <p><strong>Account Name:</strong> {shareData.payment_info?.accountName}</p>
          )}
          {shareData.payment_info?.bankName && (
            <p><strong>Bank Name:</strong> {shareData.payment_info?.bankName}</p>
          )}
          {shareData.payment_info?.promptpay && (
            <p><strong>Promptpay:</strong> {shareData.payment_info?.promptpay}</p>
          )}
        </div>
      )}

      {/* Orders List */}
      <div className="mb-6">
        <h2 className="font-bold text-xl mb-4">Orders</h2>
        <div className="space-y-3">
          {shareData.orders.map((order: Order, index: number) => (
            <div key={index} className="bg-slate-400 dark:bg-slate-700 p-4 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
              <p className="font-bold">{index + 1}. {order.name}</p>
              <p>Amount: {formatNumber(order.value)} THB</p>
              <p>Paid by: {order.payer}</p>
              <p>Split between: {order.selectedPeople.join(', ')}</p>
              <p>Per person: {formatNumber(order.value / order.selectedPeople.length)} THB</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
        <h2 className="font-bold text-xl mb-4">Final Summary</h2>
        <p className="font-bold text-lg border-b-2 border-black pb-2 mb-4">
          Total Bill: {formatNumber(totalAmount)} THB
        </p>
        
        <div className="space-y-4">
          {peopleWithCalculatedValues.map((person: Person) => (
            <div key={person.name} className="border-b border-black dark:border-white py-2">
              <p className="font-bold">{person.name}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Paid: {formatNumber(person.paid)} THB</p>
                <p>Owes: {formatNumber(person.owes)} THB</p>
              </div>
              <p className={`font-bold ${person.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Balance: {formatNumber(person.balance)} THB
                ({person.balance >= 0 ? 'to receive' : 'to pay'})
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
        Generated on: {new Date(shareData.timestamp).toLocaleString()}
      </div>

      <div className="mt-6 text-center">
        <Link 
          href="/" 
          className="inline-block bg-slate-400 dark:bg-slate-700 px-6 py-2 border-2 border-black dark:border-white rounded-md shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] dark:hover:shadow-[2px_2px_0px_0px_white] transition-all"
        >
          Create New Bill
        </Link>
      </div>
    </div>
  );
} 