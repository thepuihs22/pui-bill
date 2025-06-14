"use client";

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// Add this helper function at the top of the file after imports
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(num));
};

export default function Bill() {
  const [people, setPeople] = useState<{ name: string; value: number; promptpay?: string }[]>([]);
  const [newName, setNewName] = useState('');
  const [newPromptpay, setNewPromptpay] = useState('');
  const [activeTab, setActiveTab] = useState('users');
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
  const [payment_info, setPaymentInfo] = useState({
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

  // Add new state for confirmation modal
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  // Add new state for editing person
  const [editingPerson, setEditingPerson] = useState<{
    index: number;
    name: string;
    promptpay?: string;
  } | null>(null);
  const [editPersonName, setEditPersonName] = useState('');
  const [editPersonPromptpay, setEditPersonPromptpay] = useState('');
  const [editPersonNameError, setEditPersonNameError] = useState('');

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
          const response = await fetch(`/splitbill/api/share?id=${savedShareId}`);
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
          const response = await fetch(`/splitbill/api/share?id=${savedShareId}`);
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
          const response = await fetch(`/splitbill/api/share?id=${shareId}`);
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
          payment_info: payment_info,
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
  }, [people, orders, payment_info, currentBillId]);

  const handleAddPerson = () => {
    // Clear any previous error
    setNameError('');
    
    if (!newName.trim()) {
      setNameError('Name is required!');
      return;
    }

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
      value: 0,
      promptpay: newPromptpay || undefined
    }]);
    setNewName('');
    setNewPromptpay('');
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

  // Add calculateTotal function
  // const calculateTotal = () => {
  //   return orders.reduce((sum, order) => sum + (order.value || 0), 0);
  // };

  const handleShare = async () => {
    if (!currentBillId) {
      toast.error('Please save the bill first before sharing');
      return;
    }

    try {
      // First verify that the bill exists
      const response = await fetch(`/splitbill/api/share?id=${currentBillId}`);
      if (!response.ok) {
        throw new Error('Failed to verify bill');
      }

      const shareUrl = `${window.location.origin}/splitbill/share/${currentBillId}`;
      
      // Navigate to the share page
      window.location.href = shareUrl;
    } catch (error) {
      console.error('Error sharing bill:', error);
      toast.error('Failed to generate share link. Please try saving the bill again.');
    }
  };

  // Update handleCopyLink similarly
  const handleCopyLink = useCallback(async () => {
    const shareData = {
      orders,
      people: people.map(person => ({
        name: person.name,
        promptpay: person.promptpay
      })),
      payment_info: payment_info,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/bill/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shareData),
      });
      
      const { shareId } = await response.json();
      const shareUrl = `${window.location.origin}/splitbill/share/${shareId}`;
      
      navigator.clipboard.writeText(shareUrl);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy share link');
    }
  }, [orders, people, payment_info]);

  // Add calculatePersonBalance function
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

  // Modify handleToggleSave to show confirmation
  const handleToggleSave = () => {
    if (!isClient) return;
    
    const newSaveState = !isSaveEnabled;
    
    if (newSaveState) {
      // If enabling save, proceed directly
      setIsSaveEnabled(true);
      if (currentBillId) {
        localStorage.setItem('billShareId', currentBillId);
        handleSave();
      }
    } else {
      // If disabling save, show confirmation
      setShowSaveConfirmModal(true);
    }
  };

  // Add handler for confirming save disable
  const handleConfirmSaveDisable = () => {
    setIsSaveEnabled(false);
    localStorage.removeItem('billShareId');
    setShowSaveConfirmModal(false);
  };

  // Add handler for canceling save disable
  const handleCancelSaveDisable = () => {
    setShowSaveConfirmModal(false);
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
          payment_info: payment_info,
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

  // Add handleEditPerson function
  const handleEditPerson = (index: number) => {
    const person = people[index];
    setEditingPerson({
      index,
      name: person.name,
      promptpay: person.promptpay
    });
    setEditPersonName(person.name);
    setEditPersonPromptpay(person.promptpay || '');
    setEditPersonNameError('');
  };

  // Add handleSavePersonEdit function
  const handleSavePersonEdit = () => {
    if (!editingPerson) return;

    // Check for duplicate names (excluding the current person)
    const nameExists = people.some(
      (person, index) => 
        index !== editingPerson.index && 
        person.name.toLowerCase() === editPersonName.toLowerCase()
    );

    if (nameExists) {
      setEditPersonNameError('This name already exists!');
      return;
    }

    const updatedPeople = [...people];
    updatedPeople[editingPerson.index] = {
      ...updatedPeople[editingPerson.index],
      name: editPersonName,
      promptpay: editPersonPromptpay || undefined
    };

    setPeople(updatedPeople);
    setEditingPerson(null);
    setEditPersonName('');
    setEditPersonPromptpay('');
    setEditPersonNameError('');
  };

  // Add calculatePaymentDetails function
  const calculatePaymentDetails = (people: { name: string }[]) => {
    const balances = people.map(person => ({
      name: person.name,
      ...calculatePersonBalance(person.name)
    }));

    const debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);
    const creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);

    const payments = [];

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
  };

  return (
    <div className="min-h-screen bg-[#FBFFE9] dark:bg-gray-900 text-gray-800 dark:text-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center dark:text-[#FBFFE9]">Split & Bill</h1>

        <div className="flex mb-6 gap-4 justify-center">
          <button
            className={`py-2 px-6 font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
              activeTab === 'users'
                ? 'bg-[#829aff] text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                : 'bg-white/80 dark:bg-[#FBFFE9] shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Members
          </button>
          <button
            className={`py-2 px-6 font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
              activeTab === 'orders'
                ? 'bg-[#829aff] text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                : 'bg-white/80 dark:bg-[#FBFFE9] shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        <div className={`mb-6 space-y-4 ${activeTab === 'users' ? 'block' : 'hidden'}`} id="bill-user-form">
          <div className="flex flex-col gap-4 bg-white/80 dark:bg-[#FBFFE9] p-6 rounded-lg border-2 border-black dark:border-black shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNameError('');
                }}
                placeholder="Name"
                className={`w-full border-2 ${nameError ? 'border-[#BE5103]' : 'border-black dark:border-white'} p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
              />
              <input
                type="text"
                value={newPromptpay}
                onChange={(e) => setNewPromptpay(e.target.value)}
                placeholder="Promptpay (optional)"
                className="w-full border-2 border-black dark:border-white p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              <button
                onClick={handleAddPerson}
                className="bg-[#829aff] text-white px-6 py-3 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out whitespace-nowrap"
              >
                Add Person
              </button>
            </div>
            {nameError && (
              <div className="bg-[#BE5103] text-sm font-bold bg-white/50 dark:bg-gray-700 p-3 rounded-lg border-2 border-red-500">
                {nameError}
              </div>
            )}
          </div>

          <div className="space-y-3">
            {people.map((person, index) => (
              <div key={index} className="flex justify-between items-center bg-white/80 dark:bg-[#FBFFE9] p-4 rounded-lg border-2 border-black dark:border-black shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
                <span className="font-bold">
                  {person.name}
                  {person.promptpay && <span className="text-sm font-normal ml-2">({person.promptpay})</span>}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditPerson(index)}
                    className="bg-[#829aff] text-white px-4 py-2 font-mono border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white] transition-all duration-150 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemovePerson(index)}
                    className="bg-red-500 text-white px-4 py-2 font-mono border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white] transition-all duration-150 ease-in-out"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-100/80 dark:bg-yellow-900/80 p-6 rounded-lg border-2 border-black dark:border-white dark:text-white">
            <h3 className="font-bold mb-3">📝 How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Add all people who are splitting the bill</li>
              <li>Each person&apos;s name must be unique</li>
              <li>You can add an optional Promptpay number for each person to make money transfers easier</li>
              <li>You can remove people if they haven&apos;t been added to any orders</li>
            </ol>
          </div>
        </div>

        <div className={`mb-6 space-y-4 ${activeTab === 'orders' ? 'block' : 'hidden'}`} id="bill-order-form">
          <div className="space-y-4 bg-white/80 dark:bg-[#FBFFE9] p-6 rounded-lg border-2 border-black dark:border-black shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
            <div className="flex gap-4">
              <input
                type="text"
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value)}
                placeholder="Order"
                className="flex-1 border-2 border-black dark:border-white p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              <input
                type="number"
                value={newOrderValue}
                onChange={(e) => setNewOrderValue(e.target.value)}
                placeholder="Amount"
                className="w-32 border-2 border-black dark:border-white p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
            </div>

            <div className="border-2 border-black dark:border-white p-4 rounded-lg bg-white/50 dark:bg-gray-700">
              <div className="flex justify-between items-center mb-3">
                <p className="font-bold dark:text-white">Select people to split with:</p>
                <button
                  onClick={handleToggleAllPeople}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out bg-white/80 dark:bg-[#FBFFE9] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]"
                  title={selectedPeople.length === people.length ? "All" : "All"}
                >
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
                    className={`px-4 py-2 rounded-lg font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                      selectedPeople.includes(person.name)
                        ? 'bg-[#829aff] text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                        : 'bg-white/80 dark:bg-[#FBFFE9] shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
                    }`}
                  >
                    {person.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-2 border-black dark:border-white p-4 rounded-lg bg-white/50 dark:bg-gray-700">
              <p className="font-bold mb-3 dark:text-white">Who paid for this order?</p>
              <div className="flex flex-wrap gap-2">
                {people.map((person, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPayer(person.name)}
                    className={`px-4 py-2 rounded-lg font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                      selectedPayer === person.name
                        ? 'bg-green-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                        : 'bg-white/80 dark:bg-[#FBFFE9] shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
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
              className="w-full bg-[#829aff] text-white px-6 py-3 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none"
            >
              Add Order
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {orders.map((order, index) => (
              <div key={index} className="bg-white/80 dark:bg-[#FBFFE9] p-6 rounded-lg border-2 border-black dark:border-black shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-xl">{order.name}</h3>
                    <p className="text-sm">Amount: {formatNumber(order.value)} THB</p>
                    <p className="text-sm">Per Person: {formatNumber(order.value / order.selectedPeople.length)} THB</p>
                    <p className="text-sm">Paid by: {order.payer}</p>
                    <p className="text-sm">Split between: {order.selectedPeople.join(', ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOrder(index)}
                      className="bg-[#829aff] text-white px-4 py-2 font-mono border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white] transition-all duration-150 ease-in-out"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveOrder(index)}
                      className="bg-red-500 text-white px-4 py-2 font-mono border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white] transition-all duration-150 ease-in-out"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {orders.length > 0 && (
            <div className="mt-6 p-6 bg-white/80 dark:bg-[#FBFFE9] border-2 border-black dark:border-black rounded-lg shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-2xl">Summary</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="bg-[#829aff] text-white px-4 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out relative"
                    title="Copy share link"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    {showCopied && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm py-1 px-2 rounded">
                        Copied!
                      </div>
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-green-500 text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out"
                  >
                    Review Bill
                  </button>
                </div>
              </div>
              <p className="font-bold text-lg border-b-2 border-black pb-3 flex justify-between">
                <span>Total Orders:</span>
                <span>{formatNumber(orders.reduce((sum, order) => sum + order.value, 0))} THB</span>
              </p>
              <div className="mt-4 space-y-3">
                {people.map((person) => {
                  const { paid, owes, balance } = calculatePersonBalance(person.name);
                  return (
                    <div key={person.name} className="font-mono flex justify-between items-center border-b border-black py-3">
                      <span>{person.name}</span>
                      <div className="text-right">
                        <div>Paid: {formatNumber(paid)} THB</div>
                        <div>Owes: {formatNumber(owes)} THB</div>
                        <div className={balance >= 0 ? 'text-green-900 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          Balance: {formatNumber(balance)} THB
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Payment Instructions section */}
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">Payment Instructions</h3>
                {(() => {
                  const paymentDetails = calculatePaymentDetails(people);
                  if (paymentDetails.length === 0) {
                    return <p className="font-bold text-blue-800 dark:text-blue-400">All payments are settled!</p>;
                  }
                  return (
                    <div className="space-y-2">
                      {paymentDetails.map((payment, index) => (
                        <div key={index} className="bg-white/80 dark:bg-[#FBFFE9] p-3 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]">
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
          )}

          <div className="bg-yellow-100/80 dark:bg-yellow-900/80 p-6 rounded-lg border-2 border-black dark:border-white dark:text-white">
            <h3 className="font-bold mb-3">📝 How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Enter the order name and total amount</li>
              <li>Select who&apos;s splitting this order (use "All" button to select everyone)</li>
              <li>The amount will be split equally between selected people</li>
              <li>Review the summary and share the bill when done</li>
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-end gap-2 items-center">
            {isClient && (
              <>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isSaveEnabled}
                      onChange={handleToggleSave}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Save Bill?</span>
                  </label>
                  <div className="relative group">
                    <span className="cursor-help text-xl">💡</span>
                    <div className="absolute right-0 w-64 p-3 bg-yellow-100/80 dark:bg-yellow-900/80 rounded-lg shadow-lg border-2 border-black dark:border-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <h3 className="font-bold mb-2">Tips for Save Feature:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Toggle "Save Bill" to enable/disable saving</li>
                        <li>When enabled, your bill data will be saved</li>
                        <li>Click the "Save" button to manually save your latest changes</li>
                        <li>Your saved bill will be available even after closing the browser</li>
                        <li>Disabling save will remove the saved data from your browser</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {isSaveEnabled && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#829aff] text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none flex items-center gap-2"
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
        </div>

        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t-2 border-black dark:border-white pt-4">
          <p>© {new Date().getFullYear()} Eat & Split. All rights reserved.</p>
          <p className="mt-1">Made with 💖 by <a href="/"  target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">Futureboard</a></p>
        </footer>
      </div>

      {/* Modals */}
      {showSaveConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/80 dark:bg-[#FBFFE9] p-6 rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">⚠️ Warning</h2>
            <p className="mb-4">Are you sure you want to disable auto-save? Your saved data will be removed from your browser.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancelSaveDisable}
                className="bg-gray-500 text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSaveDisable}
                className="bg-red-500 text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out"
              >
                Disable Save
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPerson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/80 dark:bg-[#FBFFE9] p-6 rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Person</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={editPersonName}
                  onChange={(e) => {
                    setEditPersonName(e.target.value);
                    setEditPersonNameError('');
                  }}
                  placeholder="Name"
                  className={`w-full border-2 ${editPersonNameError ? 'border-red-500' : 'border-black dark:border-white'} p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
                />
                {editPersonNameError && (
                  <div className="bg-[#BE5103] text-sm mt-1">{editPersonNameError}</div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  value={editPersonPromptpay}
                  onChange={(e) => setEditPersonPromptpay(e.target.value)}
                  placeholder="Promptpay (optional)"
                  className="w-full border-2 border-black dark:border-white p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingPerson(null);
                    setEditPersonName('');
                    setEditPersonPromptpay('');
                    setEditPersonNameError('');
                  }}
                  className="bg-gray-500 text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePersonEdit}
                  disabled={!editPersonName}
                  className="bg-[#829aff] text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/80 dark:bg-[#FBFFE9] p-6 rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] max-w-lg w-full">
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
                  className={`w-full border-2 ${editNameError ? 'border-red-500' : 'border-black dark:border-white'} p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
                />
                {editNameError && (
                  <div className="bg-[#BE5103] text-sm mt-1">{editNameError}</div>
                )}
              </div>

              <div>
                <input
                  type="number"
                  value={editOrderValue}
                  onChange={(e) => setEditOrderValue(e.target.value)}
                  placeholder="Amount"
                  className="w-full border-2 border-black dark:border-white p-3 rounded-lg bg-white/50 dark:bg-gray-700 font-mono dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              <div className="border-2 border-black dark:border-white p-4 rounded-lg bg-white/50 dark:bg-gray-700">
                <p className="font-bold mb-3">Select people to split with:</p>
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
                      className={`px-4 py-2 rounded-lg font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                        editSelectedPeople.includes(person.name)
                          ? 'bg-[#829aff] text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                          : 'bg-white/80 dark:bg-[#FBFFE9] shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
                      }`}
                    >
                      {person.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-black dark:border-white p-4 rounded-lg bg-white/50 dark:bg-gray-700">
                <p className="font-bold mb-3">Who paid for this order?</p>
                <div className="flex flex-wrap gap-2">
                  {people.map((person, index) => (
                    <button
                      key={index}
                      onClick={() => setEditSelectedPayer(person.name)}
                      className={`px-4 py-2 rounded-lg font-mono border-2 border-black dark:border-white transition-all duration-150 ease-in-out ${
                        editSelectedPayer === person.name
                          ? 'bg-green-500 text-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white]'
                          : 'bg-white/80 dark:bg-[#FBFFE9] shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_white] hover:shadow-[4px_4px_0px_0px_black] dark:hover:shadow-[4px_4px_0px_0px_white]'
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
                  className="bg-gray-500 text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editOrderName || !editOrderValue || editSelectedPeople.length === 0 || !editSelectedPayer}
                  className="bg-[#829aff] text-white px-6 py-2 font-mono border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_white] hover:shadow-[6px_6px_0px_0px_black] dark:hover:shadow-[6px_6px_0px_0px_white] transition-all duration-150 ease-in-out disabled:bg-gray-400 disabled:shadow-none"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
