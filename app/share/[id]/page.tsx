"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface ShareData {
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

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(num));
};

function calculateTotalAmount(orders: any[]) {
  return orders.reduce((total, order) => total + order.value, 0);
}

function calculatePersonalSummary(person: string, orders: any[]) {
  let paid = 0;
  let owes = 0;

  orders.forEach(order => {
    // Calculate what they paid
    if (order.payer === person) {
      paid += order.value;
    }

    // Calculate what they owe
    if (order.selectedPeople.includes(person)) {
      owes += order.value / order.selectedPeople.length;
    }
  });

  return {
    paid,
    owes,
    balance: paid - owes
  };
}

export default function SharedBill() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<any>(null);

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
        <a href="/" className="mt-4 text-blue-500 hover:underline">
          Create New Bill
        </a>
      </div>
    );
  }

  const totalAmount = calculateTotalAmount(shareData.orders);
  const peopleWithCalculatedValues = shareData.people.map((person: any) => {
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
      {shareData.paymentInfo && Object.values(shareData.paymentInfo).some(value => value) && (
        <div className="mb-6 bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
          <h2 className="font-bold text-xl mb-4">Payment Information</h2>
          {shareData.paymentInfo.fullName && (
            <p><strong>Full Name:</strong> {shareData.paymentInfo.fullName}</p>
          )}
          {shareData.paymentInfo.accountName && (
            <p><strong>Account Name:</strong> {shareData.paymentInfo.accountName}</p>
          )}
          {shareData.paymentInfo.bankName && (
            <p><strong>Bank Name:</strong> {shareData.paymentInfo.bankName}</p>
          )}
          {shareData.paymentInfo.promptpay && (
            <p><strong>Promptpay:</strong> {shareData.paymentInfo.promptpay}</p>
          )}
        </div>
      )}

      {/* Orders List */}
      <div className="mb-6">
        <h2 className="font-bold text-xl mb-4">Orders</h2>
        <div className="space-y-3">
          {shareData.orders.map((order: any, index: number) => (
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
          {peopleWithCalculatedValues.map((person: any) => (
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
        <a 
          href="/" 
          className="inline-block bg-slate-400 dark:bg-slate-700 px-6 py-2 border-2 border-black dark:border-white rounded-md shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] dark:hover:shadow-[2px_2px_0px_0px_white] transition-all"
        >
          Create New Bill
        </a>
      </div>
    </div>
  );
} 