"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import qrCode from '../../../public/img/qr.jpg';

interface Order {
  name: string;
  value: number;
  selectedPeople: string[];
}

interface ShareData {
  orders: Order[];
  people: { name: string; value: number }[];
  paymentInfo: {
    accountName: string;
    promptpay: string;
    fullName: string;
    bankName: string;
  };
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(num));
};

export default function SharePage() {
  const params = useParams();
  const [data, setData] = useState<ShareData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    try {
      // Decode URL-safe base64 data
      const decodedData = JSON.parse(atob(decodeURIComponent(params.id as string)));
      setData(decodedData);
    } catch (err) {
      console.error('Error decoding share data:', err);
      setError('Invalid or expired share link');
    }
  }, [params.id]);

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto p-4 font-mono">
        <div className="bg-slate-400 p-4 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_black]">
          <h1 className="text-xl font-bold text-center">
            {error || 'Bill not found'}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 font-mono">
      <div className="bg-slate-400 p-4 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_black]">
        <h1 className="text-2xl font-bold mb-6 text-center">Bill Summary</h1>

        <div className="space-y-4 mt-6">
          <h2 className="font-bold text-xl mb-3">Orders</h2>
          {data.orders.map((order, index) => (
            <div key={index} className="bg-white p-4 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_black]">
              <p className="font-bold">{order.name}</p>
              <p className="text-black">
                Total: {formatNumber(order.value)} ({formatNumber(order.value / order.selectedPeople.length)}) THB
              </p>
              <p className="text-black">
                Split between: {order.selectedPeople.join(', ')}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="font-bold text-xl mb-3">Summary</h2>
          <p className="font-bold text-lg border-b-2 border-black pb-2 flex justify-between">
            <span>Total Orders:</span>
            <span>{formatNumber(data.orders.reduce((sum, order) => sum + order.value, 0))} THB</span>
          </p>
          <div className="mt-3 space-y-2">
            {data.people.map((person) => {
              const personTotal = data.orders.reduce((sum, order) => {
                if (order.selectedPeople.includes(person.name)) {
                  return sum + (order.value / order.selectedPeople.length);
                }
                return sum;
              }, 0);
              return (
                <p key={person.name} className="font-mono flex justify-between items-center">
                  <span>{person.name}</span>
                  <span>{formatNumber(personTotal)} THB</span>
                </p>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t-2 border-black">
            <div className="bg-white p-4 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_black]">
              <h3 className="font-bold text-lg mb-3 text-center">Payment Information</h3>
              <p className="text-center mb-4">
                Please transfer to:<br />
                <span className="font-bold">{data.paymentInfo.fullName || '-'}</span><br />
                Account Name: <span className="font-bold">{data.paymentInfo.accountName || '-'}</span><br />
                Bank Name: <span className="font-bold">{data.paymentInfo.bankName || '-'}</span><br />
                Promptpay: <span className="font-bold">{data.paymentInfo.promptpay || '-'}</span>
              </p>
              <p className="text-center mt-4 text-sm text-gray-600">
                After transferring, please send a screenshot to confirm your payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 