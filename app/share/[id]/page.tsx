"use client";

import { useEffect, useState } from 'react';
import { use } from 'react';

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

export default function SharePage({ params }: { params: { id: string } }) {
  const shareId = use(params).id;
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchShareData = async () => {
      try {
        const response = await fetch(`/api/share?id=${shareId}`);
        if (!response.ok) {
          throw new Error('Share not found');
        }
        const data = await response.json();
        setShareData(data);
      } catch (e) {
        setError('Invalid share link');
      }
    };

    fetchShareData();
  }, [shareId]);

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-4 text-center">
        <h1 className="text-red-500 text-xl">{error}</h1>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="max-w-lg mx-auto p-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

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
          {shareData.orders.map((order, index) => (
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
          Total Bill: {formatNumber(shareData.totalAmount)} THB
        </p>
        
        <div className="space-y-4">
          {shareData.people.map((person) => (
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

      <div className="mt-4 text-sm text-center text-gray-500">
        Generated on: {new Date(shareData.timestamp).toLocaleString()}
      </div>
    </div>
  );
} 