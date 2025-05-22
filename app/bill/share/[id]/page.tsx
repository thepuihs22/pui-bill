"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Person {
  name: string;
  promptpay?: string;
}

interface Order {
  name: string;
  value: number;
  payer: string;
  selectedPeople: string[];
}

interface BillData {
  people: Person[];
  orders: Order[];
  timestamp: number;
}

export default function SharePage() {
  const params = useParams();
  const [shareData, setShareData] = useState<BillData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/bill/api/share?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bill data');
        }
        const data = await response.json();
        setShareData(data);
      } catch {
        setError('Failed to load bill data. Please try again later.');
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!shareData) {
    return (
      <div className="min-h-screen bg-[#e6ff75e6] dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Futureboard</h1>
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const totalAmount = shareData.orders.reduce((sum, order) => sum + order.value, 0);

  return (
    <div className="min-h-screen bg-[#e6ff75e6] dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Futureboard</h1>

        <div className="flex justify-center mb-8">
          <Link
            href="/bill"
            className="bg-[#829aff] text-white px-6 py-3 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out"
          >
            Create New Bill
          </Link>
        </div>

        {error ? (
          <div className="bg-red-100/80 dark:bg-red-900/80 p-6 rounded-lg border-2 border-red-500 text-center">
            <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Orders Section */}
            <div className="bg-white/80 dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
              <h2 className="text-2xl font-bold mb-4">Orders</h2>
              <div className="space-y-4">
                {shareData.orders.map((order, index) => (
                  <div key={index} className="bg-white/50 dark:bg-gray-700 p-4 rounded-lg border-2 border-black dark:border-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-xl">{order.name}</h3>
                        <p className="text-sm">Amount: {formatNumber(order.value)} THB</p>
                        <p className="text-sm">Per Person: {formatNumber(order.value / order.selectedPeople.length)} THB</p>
                        <p className="text-sm">Paid by: {order.payer}</p>
                        <p className="text-sm">Split between: {order.selectedPeople.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-white/80 dark:bg-gray-800 p-6 rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              <p className="font-bold text-lg border-b-2 border-black dark:border-white pb-3 flex justify-between">
                <span>Total Orders:</span>
                <span>{formatNumber(totalAmount)} THB</span>
              </p>
              <div className="mt-4 space-y-3">
                {shareData.people.map((person) => {
                  const personOwes = shareData.orders.reduce((sum, order) => {
                    if (order.selectedPeople.includes(person.name)) {
                      return sum + (order.value / order.selectedPeople.length);
                    }
                    return sum;
                  }, 0);

                  const personPaid = shareData.orders.reduce((sum, order) => {
                    if (order.payer === person.name) {
                      return sum + order.value;
                    }
                    return sum;
                  }, 0);

                  const netBalance = personPaid - personOwes;

                  return (
                    <div key={person.name} className="font-mono flex justify-between items-center border-b border-black dark:border-white py-3">
                      <span>{person.name}</span>
                      <div className="text-right">
                        <div>Paid: {formatNumber(personPaid)} THB</div>
                        <div>Owes: {formatNumber(personOwes)} THB</div>
                        <div className={netBalance >= 0 ? 'text-green-900 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          Balance: {formatNumber(netBalance)} THB
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t-2 border-black dark:border-white pt-4">
          <p>© {new Date().getFullYear()} Eat & Split. All rights reserved.</p>
          <p className="mt-1">Made with 💖 by Futureboard</p>
        </footer>
      </div>
    </div>
  );
} 