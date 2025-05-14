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
  promptpay?: string;
}

interface ShareData {
  orders: Order[];
  people: Person[];
  payment_info?: {
    fullName?: string;
    accountName?: string;
    bankName?: string;
    promptpay?: string;
  };
  totalAmount: number;
  timestamp: number;
}

interface PaymentDetail {
  from: string;
  to: string;
  amount: number;
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

function calculatePaymentDetails(people: Person[]): PaymentDetail[] {
  const payments: PaymentDetail[] = [];
  const debtors = people.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
  const creditors = people.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);

  for (const debtor of debtors) {
    let remainingDebt = Math.abs(debtor.balance);
    
    for (const creditor of creditors) {
      if (remainingDebt <= 0 || creditor.balance <= 0) continue;
      
      const paymentAmount = Math.min(remainingDebt, creditor.balance);
      if (paymentAmount > 0) {
        payments.push({
          from: debtor.name,
          to: creditor.name,
          amount: paymentAmount
        });
        remainingDebt -= paymentAmount;
        creditor.balance -= paymentAmount;
      }
    }
  }
  
  return payments;
}

export default function SharedBill() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [copiedPromptpay, setCopiedPromptpay] = useState<string | null>(null);

  const handleCopyPromptpay = (promptpay: string) => {
    navigator.clipboard.writeText(promptpay);
    setCopiedPromptpay(promptpay);
    toast.success('PromptPay number copied!');
    setTimeout(() => setCopiedPromptpay(null), 2000);
  };

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
      balance: calculations.balance,
      promptpay: person.promptpay
    };
  });

  return (
    <div className="max-w-lg mx-auto p-4 font-mono dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
        Bill Summary
      </h1>

      {/* Payment Information */}
      {/* {!!shareData?.payment_info && (
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
      )} */}

      {/* Orders List */}
      <div className="mb-6">
        <h2 className="font-bold text-xl mb-4">Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-500 dark:bg-slate-600">
                <th className="p-3 text-left border-2 border-black dark:border-white">#</th>
                <th className="p-3 text-left border-2 border-black dark:border-white">Item</th>
                <th className="p-3 text-left border-2 border-black dark:border-white">Amount (THB)</th>
                <th className="p-3 text-left border-2 border-black dark:border-white">Paid by</th>
                <th className="p-3 text-left border-2 border-black dark:border-white">Split between</th>
                <th className="p-3 text-left border-2 border-black dark:border-white">Per person THB</th>
              </tr>
            </thead>
            <tbody>
              {shareData.orders.map((order: Order, index: number) => (
                <tr key={index} className="bg-slate-400 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">
                  <td className="p-3 border-2 border-black dark:border-white">{index + 1}</td>
                  <td className="p-3 border-2 border-black dark:border-white font-bold">{order.name}</td>
                  <td className="p-3 border-2 border-black dark:border-white">{formatNumber(order.value)}</td>
                  <td className="p-3 border-2 border-black dark:border-white">{order.payer}</td>
                  <td className="p-3 border-2 border-black dark:border-white">{order.selectedPeople.join(', ')}</td>
                  <td className="p-3 border-2 border-black dark:border-white">{formatNumber(order.value / order.selectedPeople.length)}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {person.promptpay && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>PromptPay: {person.promptpay}</span>
                  <button
                    onClick={() => handleCopyPromptpay(person.promptpay!)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title="Copy PromptPay number"
                  >
                    {copiedPromptpay === person.promptpay ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Paid: {formatNumber(person.paid)} THB</p>
                <p>Owes: {formatNumber(person.owes)} THB</p>
              </div>
              <p className={`font-bold ${person.balance >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                Balance: {formatNumber(person.balance)} THB
                ({person.balance >= 0 ? 'to receive' : 'to pay'})
              </p>
            </div>
          ))}
        </div>

        {/* Payment Instructions */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">Payment Instructions</h3>
          {(() => {
            const paymentDetails = calculatePaymentDetails([...peopleWithCalculatedValues]);
            if (paymentDetails.length === 0) {
              return <p className="font-bold text-blue-800">All payments are settled!</p>;
            }
            return (
              <div className="space-y-2">
                {paymentDetails.map((payment, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-md border border-black dark:border-white">
                    <p className="font-bold">
                      {payment.from} should pay {payment.to}
                    </p>
                    <p className="text-lg">
                      Amount: {formatNumber(payment.amount)} THB
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
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