'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  notes: string;
  lastTaken: string | null;
}

interface SupplementLog {
  date: string;
  supplementId: string;
  taken: boolean;
}

export default function SupplementTracker() {
  const { data: session } = useSession();
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([]);
  const [newSupplement, setNewSupplement] = useState<Omit<Supplement, 'id' | 'lastTaken'>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: ['morning'],
    notes: ''
  });
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Load supplements from localStorage on component mount
  useEffect(() => {
    const savedSupplements = localStorage.getItem('supplements');
    if (savedSupplements) {
      setSupplements(JSON.parse(savedSupplements));
    }

    const savedLogs = localStorage.getItem('supplementLogs');
    if (savedLogs) {
      setSupplementLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save supplements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('supplements', JSON.stringify(supplements));
  }, [supplements]);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('supplementLogs', JSON.stringify(supplementLogs));
  }, [supplementLogs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSupplement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimeOfDayChange = (time: string) => {
    setNewSupplement(prev => {
      const timeOfDay = [...prev.timeOfDay];
      
      if (timeOfDay.includes(time)) {
        return {
          ...prev,
          timeOfDay: timeOfDay.filter(t => t !== time)
        };
      } else {
        return {
          ...prev,
          timeOfDay: [...timeOfDay, time]
        };
      }
    });
  };

  const handleAddSupplement = () => {
    if (!newSupplement.name || !newSupplement.dosage) return;

    const newSupplementWithId: Supplement = {
      ...newSupplement,
      id: Date.now().toString(),
      lastTaken: null
    };

    setSupplements(prev => [...prev, newSupplementWithId]);
    setNewSupplement({
      name: '',
      dosage: '',
      frequency: 'daily',
      timeOfDay: ['morning'],
      notes: ''
    });
    setIsAddingNew(false);
  };

  const handleEditSupplement = (id: string) => {
    const supplementToEdit = supplements.find(s => s.id === id);
    if (!supplementToEdit) return;

    setNewSupplement({
      name: supplementToEdit.name,
      dosage: supplementToEdit.dosage,
      frequency: supplementToEdit.frequency,
      timeOfDay: supplementToEdit.timeOfDay,
      notes: supplementToEdit.notes
    });
    setEditingId(id);
    setIsAddingNew(true);
  };

  const handleUpdateSupplement = () => {
    if (!editingId || !newSupplement.name || !newSupplement.dosage) return;

    setSupplements(prev => prev.map(s => 
      s.id === editingId 
        ? { ...s, ...newSupplement } 
        : s
    ));

    setNewSupplement({
      name: '',
      dosage: '',
      frequency: 'daily',
      timeOfDay: ['morning'],
      notes: ''
    });
    setEditingId(null);
    setIsAddingNew(false);
  };

  const handleDeleteSupplement = (id: string) => {
    setSupplements(prev => prev.filter(s => s.id !== id));
    // Also remove logs for this supplement
    setSupplementLogs(prev => prev.filter(log => log.supplementId !== id));
  };

  const handleMarkAsTaken = (id: string) => {
    // Update the supplement's lastTaken date
    setSupplements(prev => prev.map(s => 
      s.id === id 
        ? { ...s, lastTaken: new Date().toISOString() } 
        : s
    ));

    // Add to logs
    const newLog: SupplementLog = {
      date: selectedDate,
      supplementId: id,
      taken: true
    };

    // Check if we already have a log for this supplement on this date
    const existingLogIndex = supplementLogs.findIndex(
      log => log.supplementId === id && log.date === selectedDate
    );

    if (existingLogIndex >= 0) {
      // Update existing log
      setSupplementLogs(prev => prev.map((log, index) => 
        index === existingLogIndex ? newLog : log
      ));
    } else {
      // Add new log
      setSupplementLogs(prev => [...prev, newLog]);
    }
  };

  const handleMarkAsNotTaken = (id: string) => {
    // Remove from logs for the selected date
    setSupplementLogs(prev => prev.filter(
      log => !(log.supplementId === id && log.date === selectedDate)
    ));
  };

  const isSupplementTakenOnDate = (id: string, date: string): boolean => {
    return supplementLogs.some(log => 
      log.supplementId === id && log.date === date && log.taken
    );
  };

  const getSupplementsForDate = (date: string): Supplement[] => {
    // Filter supplements based on frequency
    return supplements.filter(supplement => {
      if (supplement.frequency === 'daily') {
        return true;
      }
      
      if (supplement.frequency === 'weekly') {
        const dayOfWeek = new Date(date).getDay();
        // Assuming Sunday is 0, Monday is 1, etc.
        return dayOfWeek === 1; // Monday
      }
      
      return true; // Default to showing all supplements
    });
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      days.push(dateString);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getComplianceRate = (supplementId: string): number => {
    const daysInCurrentMonth = calendarDays.length;
    const daysTaken = supplementLogs.filter(
      log => log.supplementId === supplementId && 
      calendarDays.includes(log.date) && 
      log.taken
    ).length;
    
    return (daysTaken / daysInCurrentMonth) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Supplement Tracker</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'current' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today's Supplements
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'history' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              History & Compliance
            </button>
          </div>
        </div>

        {activeTab === 'current' && (
          <>
            <div className="mb-6">
              <label htmlFor="date-selector" className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                id="date-selector"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Supplement List */}
            <div className="space-y-4 mb-6">
              {getSupplementsForDate(selectedDate).length > 0 ? (
                getSupplementsForDate(selectedDate).map(supplement => (
                  <div key={supplement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{supplement.name}</h3>
                        <p className="text-gray-600 text-sm">Dosage: {supplement.dosage}</p>
                        <p className="text-gray-600 text-sm">
                          Time: {supplement.timeOfDay.join(', ')}
                        </p>
                        {supplement.notes && (
                          <p className="text-gray-600 text-sm mt-2">{supplement.notes}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {isSupplementTakenOnDate(supplement.id, selectedDate) ? (
                          <button
                            onClick={() => handleMarkAsNotTaken(supplement.id)}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Taken
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMarkAsTaken(supplement.id)}
                            className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full text-sm font-medium"
                          >
                            Mark as Taken
                          </button>
                        )}
                        <button
                          onClick={() => handleEditSupplement(supplement.id)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteSupplement(supplement.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No supplements added yet.</p>
                </div>
              )}
            </div>

            {/* Add New Supplement Button */}
            {!isAddingNew && (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Supplement
              </button>
            )}

            {/* Add/Edit Supplement Form */}
            {isAddingNew && (
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-lg">{editingId ? 'Edit Supplement' : 'Add New Supplement'}</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Supplement Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newSupplement.name}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Vitamin D3"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    id="dosage"
                    name="dosage"
                    value={newSupplement.dosage}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5000 IU"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={newSupplement.frequency}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly (Mondays)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time of Day</label>
                  <div className="flex flex-wrap gap-2">
                    {['morning', 'afternoon', 'evening', 'bedtime'].map(time => (
                      <label key={time} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={newSupplement.timeOfDay.includes(time)}
                          onChange={() => handleTimeOfDayChange(time)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={newSupplement.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Take with food"
                  ></textarea>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={editingId ? handleUpdateSupplement : handleAddSupplement}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? 'Update Supplement' : 'Add Supplement'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingId(null);
                      setNewSupplement({
                        name: '',
                        dosage: '',
                        frequency: 'daily',
                        timeOfDay: ['morning'],
                        notes: ''
                      });
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Monthly Compliance</h3>
            
            {supplements.length > 0 ? (
              <div className="space-y-6">
                {supplements.map(supplement => {
                  const complianceRate = getComplianceRate(supplement.id);
                  
                  return (
                    <div key={supplement.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">{supplement.name}</h4>
                      
                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Compliance Rate</span>
                          <span>{complianceRate.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              complianceRate >= 80 ? 'bg-green-500' : 
                              complianceRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${complianceRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {calendarDays.map(day => {
                          const date = new Date(day);
                          const dayOfMonth = date.getDate();
                          const isTaken = isSupplementTakenOnDate(supplement.id, day);
                          const isToday = day === new Date().toISOString().split('T')[0];
                          
                          return (
                            <div 
                              key={day}
                              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs ${
                                isTaken ? 'bg-green-100 text-green-800' : 
                                isToday ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' : 'bg-gray-100 text-gray-500'
                              }`}
                              title={`${date.toLocaleDateString()} - ${isTaken ? 'Taken' : 'Not taken'}`}
                            >
                              {dayOfMonth}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No supplements added yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
