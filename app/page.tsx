"use client";

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

// Add this helper function at the top of the file after imports
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(num));
};

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Bill() {
  const [people, setPeople] = useState<{ name: string; value: number }[]>([]);
  const [newName, setNewName] = useState('');
  const [activeTab, setActiveTab] = useState('payment');
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Add new states for orders
  const [orders, setOrders] = useState<{
    name: string;
    value: number;
    selectedPeople: string[];
    payer: string;
  }[]>([]);
  const [newOrder, setNewOrder] = useState('');
  const [newOrderValue, setNewOrderValue] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  // Add state for selected payer
  const [selectedPayer, setSelectedPayer] = useState<string>('');

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

  const [currentBillId, setCurrentBillId] = useState<string | null>(null);

  // Add new state for editing
  const [editingOrder, setEditingOrder] = useState<{
    index: number;
    name: string;
    value: number;
    selectedPeople: string[];
    payer: string;
  } | null>(null);
  const [editOrderName, setEditOrderName] = useState('');
  const [editOrderValue, setEditOrderValue] = useState('');
  const [editSelectedPeople, setEditSelectedPeople] = useState<string[]>([]);
  const [editSelectedPayer, setEditSelectedPayer] = useState('');
  const [editNameError, setEditNameError] = useState('');

  // Add new state for save button
  const [isSaving, setIsSaving] = useState(false);

  // Add useEffect for client-side initialization
  useEffect(() => {
    const initializeFromLocalStorage = async () => {
      setIsClient(true);
      // Always set isSaveEnabled to true on first load
      setIsSaveEnabled(true);
      
      // Check for saved bill ID
      const savedShareId = localStorage.getItem('billShareId');
      console.log('savedShareId', savedShareId);
      
      if (savedShareId) {
        // If we have a saved bill ID, load the data
        try {
          const response = await fetch(`/api/share?id=${savedShareId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('data', data);
            if (data && data.people && data.orders) {
              setPeople(data.people || []);
              setOrders(data.orders || []);
              setPaymentInfo(data.payment_info || {
                accountName: '',
                promptpay: '',
                fullName: '',
                bankName: '',
              });
              setCurrentBillId(savedShareId);
            } else {
              // If data is invalid, clear localStorage
              localStorage.removeItem('billShareId');
            }
          } else {
            // If response is not ok, clear localStorage
            localStorage.removeItem('billShareId');
          }
        } catch (error) {
          console.error('Error loading saved bill:', error);
          // If there's an error loading the saved bill, clear the localStorage
          localStorage.removeItem('billShareId');
        }
      }
    };

    initializeFromLocalStorage();
  }, []);

  useEffect(() => {
    const loadBillData = async () => {
      // Only proceed if we're on the client side
      if (!isClient) return;

      // If we have a current bill ID, don't create a new one
      if (currentBillId) return;

      // Check if save is enabled and get shareId from localStorage
      const savedShareId = localStorage.getItem('billShareId');
      
      if (savedShareId) {
        // Try to load shared bill data
        try {
          const response = await fetch(`/api/share?id=${savedShareId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('data', data);
            setPeople(data.people || []);
            setOrders(data.orders || []);
            setPaymentInfo(data.payment_info || {
              accountName: '',
              promptpay: '',
              fullName: '',
              bankName: '',
            });
            setCurrentBillId(savedShareId);
            return;
          }
        } catch (error) {
          console.error('Error loading shared bill:', error);
        }
      }

      // If no saved data or save is disabled, proceed with normal flow
      const urlParams = new URLSearchParams(window.location.search);
      const shareId = urlParams.get('id');

      if (shareId) {
        // Try to load shared bill data
        try {
          const response = await fetch(`/api/share?id=${shareId}`);
          if (response.ok) {
            const data = await response.json();
            setPeople(data.people || []);
            setOrders(data.orders || []);
            setPaymentInfo(data.payment_info || {
              accountName: '',
              promptpay: '',
              fullName: '',
              bankName: '',
            });
            setCurrentBillId(shareId);
            return;
          }
        } catch (error) {
          console.error('Error loading shared bill:', error);
        }
      }

      // Check for existing empty bill only if we don't have a current bill ID
      if (!currentBillId) {
        const { data: existingBills, error: fetchError } = await supabase
          .from('shared_bills')
          .select('*')
          .eq('people', '[]')
          .eq('orders', '[]')
          .eq('payment_info', '{}')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!fetchError && existingBills) {
          console.log('Found existing empty bill:', existingBills.id);
          setCurrentBillId(existingBills.id);
          setPeople([]);
          setOrders([]);
          setPaymentInfo({
            accountName: '',
            promptpay: '',
            fullName: '',
            bankName: '',
          });
          return;
        }

        // If no empty bill exists, create a new one
        console.log('Creating new bill...');
        const { data, error } = await supabase
          .from('shared_bills')
          .insert({
            people: [],
            orders: [],
            payment_info: {
              accountName: '',
              promptpay: '',
              fullName: '',
              bankName: '',
            },
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating new bill:', error);
          return;
        }

        setCurrentBillId(data.id);
      }
    };

    loadBillData();
  }, [isClient, currentBillId]);

  // Replace the save effect with an update function
  useEffect(() => {
    const updateBillData = async () => {
      if (!currentBillId || (people.length === 0 && orders.length === 0)) return;

      const { error } = await supabase
        .from('shared_bills')
        .update({
          people,
          orders,
          payment_info: paymentInfo,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString()
        })
        .eq('id', currentBillId);

      if (error) {
        console.error('Error updating bill data:', error);
        toast.error('Failed to save changes');
      }
    };

    // Debounce the update operation
    const timeoutId = setTimeout(updateBillData, 1000);
    return () => clearTimeout(timeoutId);
  }, [people, orders, paymentInfo, currentBillId]);

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

  // Update handleAddOrder to include payer
  const handleAddOrder = () => {
    if (newOrder && newOrderValue && selectedPeople.length > 0 && selectedPayer) {
      setOrders([
        ...orders,
        {
          name: newOrder,
          value: parseFloat(newOrderValue),
          selectedPeople: [...selectedPeople],
          payer: selectedPayer,
        },
      ]);
      setNewOrder('');
      setNewOrderValue('');
      setSelectedPeople([]);
      setSelectedPayer('');
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

  // Add calculateTotal function
  // const calculateTotal = () => {
  //   return orders.reduce((sum, order) => sum + (order.value || 0), 0);
  // };

  const handleShare = async () => {
    if (!currentBillId) return;

    try {
      const shareUrl = `${window.location.origin}/share/${currentBillId}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
      
      // Open in new tab
      window.open(shareUrl, '_blank');
    } catch (error) {
      console.error('Error sharing bill:', error);
      toast.error('Failed to generate share link');
    }
  };

  // Update handleCopyLink similarly
  const handleCopyLink = useCallback(async () => {
    const calculatePersonBalance = (personName: string) => {
      const personOwes = orders.reduce((sum, order) => {
        if (order.selectedPeople.includes(personName)) {
          return sum + (order.value / order.selectedPeople.length);
        }
        return sum;
      }, 0);

      const personPaid = orders.reduce((sum, order) => {
        if (order.payer === personName) {
          return sum + order.value;
        }
        return sum;
      }, 0);

      return {
        paid: personPaid,
        owes: personOwes,
        balance: personPaid - personOwes
      };
    };

    const shareData = {
      orders,
      people: people.map(person => ({
        ...person,
        ...calculatePersonBalance(person.name)
      })),
      paymentInfo,
      totalAmount: orders.reduce((sum, order) => sum + order.value, 0),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareData),
      });
      
      const { shareId } = await response.json();
      const shareUrl = `${window.location.origin}/share/${shareId}`;
      
      navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      // You might want to show an error message to the user
    }
  }, [orders, people, paymentInfo]);

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

  // Add function to handle order edit
  const handleEditOrder = (index: number) => {
    const order = orders[index];
    setEditingOrder({
      index,
      name: order.name,
      value: order.value,
      selectedPeople: [...order.selectedPeople],
      payer: order.payer
    });
    setEditOrderName(order.name);
    setEditOrderValue(order.value.toString());
    setEditSelectedPeople([...order.selectedPeople]);
    setEditSelectedPayer(order.payer);
    setEditNameError('');
  };

  // Add function to save edited order
  const handleSaveEdit = () => {
    if (!editingOrder) return;

    // Check for duplicate order names (excluding the current order)
    const nameExists = orders.some(
      (order, index) => 
        index !== editingOrder.index && 
        order.name.toLowerCase() === editOrderName.toLowerCase()
    );

    if (nameExists) {
      setEditNameError('This order name already exists!');
      return;
    }

    const updatedOrders = [...orders];
    updatedOrders[editingOrder.index] = {
      name: editOrderName,
      value: parseFloat(editOrderValue),
      selectedPeople: [...editSelectedPeople],
      payer: editSelectedPayer
    };

    setOrders(updatedOrders);
    setEditingOrder(null);
    setEditOrderName('');
    setEditOrderValue('');
    setEditSelectedPeople([]);
    setEditSelectedPayer('');
    setEditNameError('');
  };

  // Modify handleToggleSave to handle localStorage safely
  const handleToggleSave = () => {
    if (!isClient) return;
    
    const newSaveState = !isSaveEnabled;
    setIsSaveEnabled(newSaveState);
    
    if (newSaveState && currentBillId) {
      // Save the current state to localStorage
      localStorage.setItem('billShareId', currentBillId);
      // Also save the current data to the database
      handleSave();
    } else {
      localStorage.removeItem('billShareId');
    }
  };

  // Add effect to save billShareId to localStorage when currentBillId changes
  useEffect(() => {
    if (isClient && isSaveEnabled && currentBillId) {
      localStorage.setItem('billShareId', currentBillId);
    }
  }, [currentBillId, isSaveEnabled, isClient]);

  // Modify handleSave to return a promise
  const handleSave = async () => {
    if (!currentBillId) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('shared_bills')
        .update({
          people,
          orders,
          payment_info: paymentInfo,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentBillId);

      if (error) {
        console.error('Error saving bill:', error);
        toast.error('Failed to save changes');
        // If save fails, disable auto-save
        setIsSaveEnabled(false);
        localStorage.removeItem('billShareId');
      } else {
        toast.success('Changes saved successfully');
      }
    } catch (error) {
      console.error('Error saving bill:', error);
      toast.error('Failed to save changes');
      // If save fails, disable auto-save
      setIsSaveEnabled(false);
      localStorage.removeItem('billShareId');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 font-mono dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
        Eat & Split
      </h1>

      <div className="flex mb-4 gap-2">
        <button
          className={`py-2 px-4 font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
            activeTab === 'payment'
              ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
              : 'bg-slate-400 dark:bg-slate-700 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
          }`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Info
        </button>
        <button
          className={`py-2 px-4 font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
            activeTab === 'users'
              ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
              : 'bg-slate-400 dark:bg-slate-700 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Members
        </button>
        <button
          className={`py-2 px-4 font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
            activeTab === 'orders'
              ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
              : 'bg-slate-400 dark:bg-slate-700 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className={`mb-6 space-y-4 ${activeTab === 'users' ? 'block' : 'hidden'}`} id="bill-user-form">
        <div className="flex flex-col gap-2 bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setNameError(''); // Clear error when typing
              }}
              placeholder="Name"
              className={`border-2 ${nameError ? 'border-red-500' : 'border-black'} p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white`}
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
            <div key={index} className="flex justify-between items-center bg-slate-400 dark:bg-slate-700 p-3 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
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
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 border-2 border-black dark:border-white rounded-md">
          <h3 className="font-bold mb-2">📝 How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Add all people who are splitting the bill</li>
            <li>Each person&apos;s name must be unique</li>
            <li>You can remove people if they haven&apos;t been added to any orders</li>
          </ol>
        </div>
      </div>

      <div className={`mb-6 space-y-4 ${activeTab === 'orders' ? 'block' : 'hidden'}`} id="bill-order-form">
        <div className="space-y-4 bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              placeholder="Order"
              className="flex-1 border-2 border-black dark:border-white p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white"
            />
            <input
              type="number"
              value={newOrderValue}
              onChange={(e) => setNewOrderValue(e.target.value)}
              placeholder="Amount"
              className="w-32 border-2 border-black dark:border-white p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white"
            />
          </div>

          <div className="border-2 border-black dark:border-white p-3 rounded bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold">Select people to split with:</p>
              <button
                onClick={handleToggleAllPeople}
                className="flex items-center gap-1 px-2 py-1 text-sm rounded font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out bg-slate-400 dark:bg-slate-700 hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]"
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
                  className={`px-3 py-1 rounded font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                    selectedPeople.includes(person.name)
                      ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                      : 'bg-slate-400 dark:bg-slate-700 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
                  }`}
                >
                  {person.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-black dark:border-white p-3 rounded bg-white dark:bg-gray-800">
            <p className="font-bold mb-2">Who paid for this order?</p>
            <div className="flex flex-wrap gap-2">
              {people.map((person, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPayer(person.name)}
                  className={`px-3 py-1 rounded font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                    selectedPayer === person.name
                      ? 'bg-green-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                      : 'bg-slate-400 dark:bg-slate-700 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
                  }`}
                >
                  {person.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddOrder}
            disabled={!newOrder || !newOrderValue || selectedPeople.length === 0 || !selectedPayer}
            className="w-full bg-blue-500 text-white px-4 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none"
          >
            Add Order
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {orders.map((order, index) => (
            <div key={index} className="bg-slate-400 dark:bg-slate-700 p-4 rounded-md border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{index + 1}. {order.name}</p>
                  <p className="text-black">
                    Total: {formatNumber(order.value)} ({formatNumber(order.value / order.selectedPeople.length)} THB/Person)
                  </p>
                  <p className="text-black">Paid by: {order.payer}</p>
                  <p className="text-black">
                    Split between: {order.selectedPeople.join(', ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditOrder(index)}
                    className="bg-blue-500 text-white px-3 py-1 font-mono border-2 border-black shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black] transition-all duration-150 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemoveOrder(index)}
                    className="bg-red-500 text-white px-3 py-1 font-mono border-2 border-black shadow-[2px_2px_0px_0px_black] hover:shadow-[4px_4px_0px_0px_black] transition-all duration-150 ease-in-out"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Order Modal */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-400 dark:bg-slate-700 p-6 rounded-md border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white] max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={editOrderName}
                    onChange={(e) => {
                      setEditOrderName(e.target.value);
                      setEditNameError('');
                    }}
                    placeholder="Order Name"
                    className={`w-full border-2 ${editNameError ? 'border-red-500' : 'border-black'} p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white`}
                  />
                  {editNameError && (
                    <div className="text-red-500 text-sm mt-1">{editNameError}</div>
                  )}
                </div>

                <div>
                  <input
                    type="number"
                    value={editOrderValue}
                    onChange={(e) => setEditOrderValue(e.target.value)}
                    placeholder="Amount"
                    className="w-full border-2 border-black p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white"
                  />
                </div>

                <div className="border-2 border-black dark:border-white p-3 rounded bg-white dark:bg-gray-800">
                  <p className="font-bold mb-2">Select people to split with:</p>
                  <div className="flex flex-wrap gap-2">
                    {people.map((person, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setEditSelectedPeople(prev =>
                            prev.includes(person.name)
                              ? prev.filter(n => n !== person.name)
                              : [...prev, person.name]
                          );
                        }}
                        className={`px-3 py-1 rounded font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                          editSelectedPeople.includes(person.name)
                            ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                            : 'bg-slate-400 dark:bg-slate-700 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
                        }`}
                      >
                        {person.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-2 border-black dark:border-white p-3 rounded bg-white dark:bg-gray-800">
                  <p className="font-bold mb-2">Who paid for this order?</p>
                  <div className="flex flex-wrap gap-2">
                    {people.map((person, index) => (
                      <button
                        key={index}
                        onClick={() => setEditSelectedPayer(person.name)}
                        className={`px-3 py-1 rounded font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                          editSelectedPayer === person.name
                            ? 'bg-green-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                            : 'bg-slate-400 dark:bg-slate-700 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
                        }`}
                      >
                        {person.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => {
                      setEditingOrder(null);
                      setEditOrderName('');
                      setEditOrderValue('');
                      setEditSelectedPeople([]);
                      setEditSelectedPayer('');
                      setEditNameError('');
                    }}
                    className="bg-gray-500 text-white px-4 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editOrderName || !editOrderValue || editSelectedPeople.length === 0 || !editSelectedPayer}
                    className="bg-blue-500 text-white px-4 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {orders.length > 0 && (
          <div className="mt-6 p-4 bg-slate-400 dark:bg-slate-700 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
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
                // Calculate what this person owes
                const personOwes = orders.reduce((sum, order) => {
                  if (order.selectedPeople.includes(person.name)) {
                    return sum + (order.value / order.selectedPeople.length);
                  }
                  return sum;
                }, 0);

                // Calculate what this person paid
                const personPaid = orders.reduce((sum, order) => {
                  if (order.payer === person.name) {
                    return sum + order.value;
                  }
                  return sum;
                }, 0);

                // Calculate net balance (negative means they owe money)
                const netBalance = personPaid - personOwes;

                return (
                  <div key={person.name} className="font-mono flex justify-between items-center border-b border-black dark:border-white py-2">
                    <span>{person.name}</span>
                    <div className="text-right">
                      <div>Paid: {formatNumber(personPaid)} THB</div>
                      <div>Owes: {formatNumber(personOwes)} THB</div>
                      <div className={netBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        Balance: {formatNumber(netBalance)} THB
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Orders Tab Note */}
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 border-2 border-black dark:border-white rounded-md">
          <h3 className="font-bold mb-2">📝 How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Enter the order name and total amount</li>
            <li>Select who&apos;s splitting this order (use "All" button to select everyone)</li>
            <li>The amount will be split equally between selected people</li>
            <li>Review the summary and share the bill when done</li>
          </ol>
        </div>
      </div>

      {/* Update the Payment Info Form */}
      <div className={`mb-6 space-y-4 ${activeTab === 'payment' ? 'block' : 'hidden'}`}>
        <div className="bg-slate-400 dark:bg-slate-700 p-4 border-4 border-black dark:border-white rounded-md shadow-[8px_8px_0px_0px_black] dark:shadow-[8px_8px_0px_0px_white]">
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
                className="w-full border-2 border-black dark:border-white p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white"
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
                className="w-full border-2 border-black dark:border-white p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={paymentInfo.bankName}
                onChange={handlePaymentInfoUpdate}
                placeholder="Bank Name"
                className="w-full border-2 border-black dark:border-white p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white"
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
                className="w-full border-2 border-black dark:border-white p-2 rounded bg-white dark:bg-gray-800 font-mono dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Payment Info Tab Note */}
        <div className="bg-yellow-100 dark:bg-yellow-900 p-4 border-2 border-black dark:border-white rounded-md">
          <h3 className="font-bold mb-2">📝 How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Fill in your payment details</li>
            <li>This information will be shown to others when you share the bill</li>
            <li>All fields are optional, but helpful for receiving payments</li>
          </ol>
        </div>
      </div>
      


      {/* Action Buttons */}
      <div className="flex justify-end mb-4 gap-2 items-center">
        {isClient && (
          <>
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isSaveEnabled}
                onChange={handleToggleSave}
              />
              <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Save Bill ?</span>
            </label>
            {isSaveEnabled && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-500 text-white px-4 py-2 font-mono border-2 border-black shadow-[4px_4px_0px_0px_black] hover:shadow-[6px_6px_0px_0px_black] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-2v5.586l-1.293-1.293z" />
                </svg>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
          </>
        )}
      </div>
      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t-2 border-black dark:border-white pt-4">
        <p>© {new Date().getFullYear()} Eat & Split. All rights reserved.</p>
        <p className="mt-1">Made with 💖 by Pui</p>
      </footer>
    </div>
  );
}
