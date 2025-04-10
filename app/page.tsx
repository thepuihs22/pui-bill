"use client";

import { useState } from 'react';

export default function Bill() {
  const [people, setPeople] = useState<{ name: string; value: number }[]>([]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Add new states for orders
  const [orders, setOrders] = useState<{
    name: string;
    value: number;
    selectedPeople: string[];
  }[]>([]);
  const [newOrder, setNewOrder] = useState('');
  const [newOrderValue, setNewOrderValue] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  const handleAddPerson = () => {
    console.log('Adding person:', { newName, newValue });
    if (newName) {
      setPeople([...people, { 
        name: newName, 
        value: 0
      }]);
      setNewName('');
      setNewValue('');
    }
  };

  const handleRemovePerson = (index: number) => {
    const newPeople = people.filter((_, i) => i !== index);
    setPeople(newPeople);
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

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Check your bill</h1>

      <div className="flex mb-4 border-b">
        <button
          className={`py-2 px-4 ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'orders'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      <div className={`mb-6 space-y-4 ${activeTab === 'users' ? 'block' : 'hidden'}`} id="bill-user-form">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            className="border p-2 rounded"
          />
          {/* <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Amount"
            className="border p-2 rounded"
          /> */}
          <button
            onClick={handleAddPerson}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Person
          </button>
        </div>

        <div className="space-y-2">
          {people.map((person, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <div>
                <span className="font-medium">{person.name}</span>
                {/* <span className="ml-4">{person.value.toFixed(2)} Baht.</span> */}
              </div>
              <button
                onClick={() => handleRemovePerson(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* {people.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="font-bold">
              Total: {people.reduce((sum, person) => sum + person.value, 0).toFixed(2)} Baht.
            </p>
            <p>
            Promptpay: 0911421142 (Napaporn Utistham)</p>
          </div>
        )} */}
      </div>

      <div className={`mb-6 space-y-4 ${activeTab === 'orders' ? 'block' : 'hidden'}`} id="bill-order-form">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              placeholder="Order"
              className="border p-2 rounded"
            />
            <input
              type="number"
              value={newOrderValue}
              onChange={(e) => setNewOrderValue(e.target.value)}
              placeholder="Amount"
              className="border p-2 rounded"
            />
          </div>

          {/* People selection */}
          <div className="border p-3 rounded">
            <p className="font-medium mb-2">Select people to split with:</p>
            <div className="flex flex-wrap gap-2">
              {people.map((person, index) => (
                <button
                  key={index}
                  onClick={() => togglePersonSelection(person.name)}
                  className={`px-3 py-1 rounded ${
                    selectedPeople.includes(person.name)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
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
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Add Order
          </button>
        </div>

        {/* Display orders */}
        <div className="space-y-3 mt-4">
          {orders.map((order, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{order.name}</p>
                  <p className="text-sm text-gray-600">
                    Total: {order.value.toFixed(2)} Baht.
                  </p>
                  <p className="text-sm text-gray-600">
                    Per person: {(order.value / order.selectedPeople.length).toFixed(2)} Baht.
                  </p>
                  <p className="text-sm text-gray-600">
                    Split between: {order.selectedPeople.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveOrder(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        Summary
        {orders.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="font-bold">
              Total Orders: ${orders.reduce((sum, order) => sum + order.value, 0).toFixed(2)}
            </p>
            {people.map((person) => {
              const personTotal = orders.reduce((sum, order) => {
                if (order.selectedPeople.includes(person.name)) {
                  return sum + (order.value / order.selectedPeople.length);
                }
                return sum;
              }, 0);
              return (
                <p key={person.name} className="text-sm">
                  {person.name}'s pay: {personTotal.toFixed(2)} Baht.
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
