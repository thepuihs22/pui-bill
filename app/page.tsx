"use client";

import { useState, useCallback } from 'react';

// Add this helper function at the top of the file after imports
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(num));
};

export default function Bill() {
  const [people, setPeople] = useState<{ name: string; value: number }[]>([]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [activeTab, setActiveTab] = useState('payment');

  // Add new states for orders
  const [orders, setOrders] = useState<{
    name: string;
    value: number;
    selectedPeople: string[];
  }[]>([]);
  const [newOrder, setNewOrder] = useState('');
  const [newOrderValue, setNewOrderValue] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const [showCopied, setShowCopied] = useState(false);

  // Add new state for payment info
  const [paymentInfo, setPaymentInfo] = useState({
    accountName: '',
    promptpay: '',
    fullName: '',
    bankName: '',
  });

  // Add new state for error message
  const [nameError, setNameError] = useState('');

  const handleAddPerson = () => {
    // Clear any previous error
    setNameError('');
    
    if (newName) {
      // Check if name already exists (case insensitive)
      const nameExists = people.some(
        person => person.name.toLowerCase() === newName.toLowerCase()
      );

      if (nameExists) {
        setNameError('This name already exists!');
        return;
      }

      setPeople([...people, { 
        name: newName, 
        value: 0
      }]);
      setNewName('');
      setNewValue('');
    }
  };

  const handleRemovePerson = (index: number) => {
    const personToRemove = people[index].name;
    const newPeople = people.filter((_, i) => i !== index);
    setPeople(newPeople);

    // Update orders by removing the person from selectedPeople arrays
    const updatedOrders = orders.map(order => {
      if (order.selectedPeople.includes(personToRemove)) {
        // If this was the only person in the order, we'll filter out the order entirely
        if (order.selectedPeople.length === 1) {
          return null;
        }
        // Otherwise, remove the person from the split
        return {
          ...order,
          selectedPeople: order.selectedPeople.filter(name => name !== personToRemove)
        };
      }
      return order;
    }).filter((order): order is NonNullable<typeof order> => order !== null);

    setOrders(updatedOrders);
    // Also remove the person from currently selected people if they were selected
    setSelectedPeople(prev => prev.filter(name => name !== personToRemove));
  };

  // Add new function to handle order addition
  const handleAddOrder = () => {
    if (newOrder && newOrderValue && selectedPeople.length > 0) {
      setOrders([
        ...orders,
        {
          name: newOrder,
          value: parseFloat(newOrderValue),
          selectedPeople: [...selectedPeople],
        },
      ]);
      setNewOrder('');
      setNewOrderValue('');
      setSelectedPeople([]);
    }
  };

  // Add function to handle person selection
  const togglePersonSelection = (name: string) => {
    setSelectedPeople(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  // Add function to remove order
  const handleRemoveOrder = (index: number) => {
    setOrders(orders.filter((_, i) => i !== index));
  };

  // Add payment info update handler
  const handlePaymentInfoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Update handleShare to include payment info
  const handleShare = useCallback(() => {
    const shareData = {
      orders,
      people,
      paymentInfo
    };
    const encodedData = encodeURIComponent(btoa(JSON.stringify(shareData)));
    const shareUrl = `${window.location.origin}/share/${encodedData}`;
    navigator.clipboard.writeText(shareUrl);
    window.open(shareUrl, '_blank');
  }, [orders, people, paymentInfo]);

  const handleCopyLink = useCallback(() => {
    const shareData = {
      orders,
      people
    };
    const encodedData = encodeURIComponent(btoa(JSON.stringify(shareData)));
    const shareUrl = `${window.location.origin}/share/${encodedData}`;
    
    navigator.clipboard.writeText(shareUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [orders, people]);

  // Add this new handler function
  const handleToggleAllPeople = () => {
    if (selectedPeople.length === people.length) {
      // If all are selected, deselect all
      setSelectedPeople([]);
    } else {
      // Otherwise, select all
      setSelectedPeople(people.map(person => person.name));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-center bg-slate-400 p-4 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_black]">
        Eat & Split
      </h1>

      <div className="flex mb-4 gap-2">
        <button
          className={`py-2 px-4 font-mono border-2 border-black transition-all duration-150 ease-in-out ${
            activeTab === 'payment'
              ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black]'
              : 'bg-slate-400 shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black]'
          }`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Info
        </button>
        <button
          className={`py-2 px-4 font-mono border-2 border-black transition-all duration-150 ease-in-out ${
            activeTab === 'users'
              ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black]'
              : 'bg-slate-400 shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black]'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Members
        </button>
        <button
          className={`py-2 px-4 font-mono border-2 border-black transition-all duration-150 ease-in-out ${
            activeTab === 'orders'
              ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black]'
              : 'bg-slate-400 shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black]'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className={`mb-6 space-y-4 ${activeTab === 'users' ? 'block' : 'hidden'}`} id="bill-user-form">
        <div className="flex flex-col gap-2 bg-slate-400 p-4 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_black]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNameError(''); // Clear error when typing
              }}
              placeholder="Name"
              className={`border-2 ${nameError ? 'border-red-500' : 'border-black'} p-2 rounded bg-white font-mono`}
            />
            <button
              onClick={handleAddPerson}
              className="bg-blue-500 text-white px-4 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out"
            >
              Add Person
            </button>
          </div>
          {nameError && (
            <div className="text-red-500 text-sm font-bold bg-white p-2 rounded border-2 border-red-500">
              {nameError}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {people.map((person, index) => (
            <div key={index} className="flex justify-between items-center bg-slate-400 p-3 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_black]">
              <span className="font-bold">{person.name}</span>
              <button
                onClick={() => handleRemovePerson(index)}
                className="bg-red-500 text-white px-3 py-1 font-mono border-2 border-black shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black] transition-all duration-150 ease-in-out"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Members Tab Note */}
        <div className="bg-yellow-100 p-4 border-2 border-black rounded-md">
          <h3 className="font-bold mb-2">📝 How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Add all people who are splitting the bill</li>
            <li>Each person's name must be unique</li>
            <li>You can remove people if they haven't been added to any orders</li>
          </ol>
        </div>
      </div>

      <div className={`mb-6 space-y-4 ${activeTab === 'orders' ? 'block' : 'hidden'}`} id="bill-order-form">
        <div className="space-y-4 bg-slate-400 p-4 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_black]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              placeholder="Order"
              className="flex-1 border-2 border-black p-2 rounded bg-white font-mono"
            />
            <input
              type="number"
              value={newOrderValue}
              onChange={(e) => setNewOrderValue(e.target.value)}
              placeholder="Amount"
              className="w-32 border-2 border-black p-2 rounded bg-white font-mono"
            />
          </div>

          <div className="border-2 border-black p-3 rounded bg-white">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold">Select people to split with:</p>
              <button
                onClick={handleToggleAllPeople}
                className="flex items-center gap-1 px-2 py-1 text-sm rounded font-mono border-2 border-black transition-all duration-150 ease-in-out bg-slate-400 hover:shadow-[4px_4px_0px_0px_black]"
                title={selectedPeople.length === people.length ? "All" : "All"}
              >
                {/* Toggle Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  {selectedPeople.length === people.length ? (
                    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
                  ) : (
                    <path fillRule="evenodd" d="M10 5a.75.75 0 01.75.75v3.5h3.5a.75.75 0 010 1.5h-3.5v3.5a.75.75 0 01-1.5 0v-3.5h-3.5a.75.75 0 010-1.5h3.5v-3.5A.75.75 0 0110 5z" clipRule="evenodd" />
                  )}
                </svg>
                {selectedPeople.length === people.length ? "All" : "All"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {people.map((person, index) => (
                <button
                  key={index}
                  onClick={() => togglePersonSelection(person.name)}
                  className={`px-3 py-1 rounded font-mono border-2 border-black transition-all duration-150 ease-in-out ${
                    selectedPeople.includes(person.name)
                      ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black]'
                      : 'bg-slate-400 shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black]'
                  }`}
                >
                  {person.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddOrder}
            disabled={!newOrder || !newOrderValue || selectedPeople.length === 0}
            className="w-full bg-blue-500 text-white px-4 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none"
          >
            Add Order
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {orders.map((order, index) => (
            <div key={index} className="bg-slate-400 p-4 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_black]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{index + 1}. {order.name}</p>
                  <p className="text-black">
                    Total: {formatNumber(order.value)} ({(formatNumber(order.value / order.selectedPeople.length))} THB/Person)
                  </p>
                  <p className="text-black">
                    Split between: {order.selectedPeople.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveOrder(index)}
                  className="bg-red-500 text-white px-3 py-1 font-mono border-2 border-black shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black] transition-all duration-150 ease-in-out"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {orders.length > 0 && (
          <div className="mt-6 p-4 bg-slate-400 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_black]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">Summary</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="bg-blue-500 text-white px-3 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out relative"
                  title="Copy share link"
                >
                  {/* Clipboard Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  {/* Copied Notification */}
                  {showCopied && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm py-1 px-2 rounded">
                      Copied!
                    </div>
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="bg-green-500 text-white px-4 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out"
                >
                  Review Bill
                </button>
              </div>
            </div>
            <p className="font-bold text-lg border-b-2 border-black pb-2 flex justify-between">
              <span>Total Orders:</span>
              <span>{formatNumber(orders.reduce((sum, order) => sum + order.value, 0))} THB</span>
            </p>
            <div className="mt-3 space-y-2">
              {people.map((person) => {
                const personTotal = orders.reduce((sum, order) => {
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
          </div>
        )}

        {/* Orders Tab Note */}
        <div className="bg-yellow-100 p-4 border-2 border-black rounded-md">
          <h3 className="font-bold mb-2">📝 How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Enter the order name and total amount</li>
            <li>Select who's splitting this order (use "All" button to select everyone)</li>
            <li>The amount will be split equally between selected people</li>
            <li>Review the summary and share the bill when done</li>
          </ol>
        </div>
      </div>

      {/* Update the Payment Info Form */}
      <div className={`mb-6 space-y-4 ${activeTab === 'payment' ? 'block' : 'hidden'}`}>
        <div className="bg-slate-400 p-4 border-4 border-black rounded-md shadow-[8px_8px_0px_0px_black]">
          <h2 className="font-bold text-xl mb-4">Payment Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-bold">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={paymentInfo.fullName}
                onChange={handlePaymentInfoUpdate}
                placeholder="Your Full Name"
                className="w-full border-2 border-black p-2 rounded bg-white font-mono"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Account Name</label>
              <input
                type="text"
                name="accountName"
                value={paymentInfo.accountName}
                onChange={handlePaymentInfoUpdate}
                placeholder="Account Name"
                className="w-full border-2 border-black p-2 rounded bg-white font-mono"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={paymentInfo.bankName}
                onChange={handlePaymentInfoUpdate}
                placeholder="Account Name"
                className="w-full border-2 border-black p-2 rounded bg-white font-mono"
                />
            </div>
            <div>
              <label className="block mb-2 font-bold">Promptpay Number</label>
              <input
                type="text"
                name="promptpay"
                value={paymentInfo.promptpay}
                onChange={handlePaymentInfoUpdate}
                placeholder="Promptpay Number"
                className="w-full border-2 border-black p-2 rounded bg-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Payment Info Tab Note */}
        <div className="bg-yellow-100 p-4 border-2 border-black rounded-md">
          <h3 className="font-bold mb-2">📝 How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Fill in your payment details</li>
            <li>This information will be shown to others when you share the bill</li>
            <li>All fields are optional, but helpful for receiving payments</li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500 border-t-2 border-black pt-4">
        <p>© {new Date().getFullYear()} Eat & Split. All rights reserved.</p>
        <p className="mt-1">Made with 💖 by Pui</p>
      </footer>
    </div>
  );
}
