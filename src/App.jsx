import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

// ResourceDisplay Component
const ResourceDisplay = ({ resources, session }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {Object.entries(resources).map(([name, count]) => (
        <div key={name} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-purple-400">{`${name.charAt(0).toUpperCase() + name.slice(1)} (${session})`}</h3>
          <p className="text-gray-300">{count} available</p>
        </div>
      ))}
    </div>
  );
};

// EventForm Component
const EventForm = ({ onSubmit }) => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [requiredResources, setRequiredResources] = useState({ projectors: 0, mikes: 0, chairs: 0, markers: 0 });

  const handleResourceChange = (e) => {
    setRequiredResources({
      ...requiredResources,
      [e.target.name]: parseInt(e.target.value) || 0,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, requiredResources });
    setTitle('');
    setRequiredResources({ projectors: 0, mikes: 0, chairs: 0, markers: 0 });
  };

  const addEvent = () => {
    const newEvent = { title, requiredResources };
    setEvents([...events, newEvent]);
    setTitle('');
    setRequiredResources({ projectors: 0, mikes: 0, chairs: 0, markers: 0 });
  };

  const handleFinalSubmit = () => {
    onSubmit(events);
    setEvents([]); // Reset the events list after submitting
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg space-y-6 mb-8">
      <h2 className="text-purple-500 text-2xl font-bold mb-4">Event Details</h2>

      <div>
        <label className="block text-purple-400">Event Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(requiredResources).map((resource) => (
          <div key={resource}>
            <label className="block text-purple-400">{resource.charAt(0).toUpperCase() + resource.slice(1)}:</label>
            <input
              type="number"
              name={resource}
              value={requiredResources[resource]}
              onChange={handleResourceChange}
              min="0"
              className="w-full p-2 mt-2 bg-gray-700 text-white rounded focus:outline-none"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addEvent}
        className="w-full bg-purple-500 hover:bg-purple-600 p-2 rounded-lg text-white font-semibold shadow-lg transition-all"
      >
        Add Event
      </button>

      <h3 className="text-lg text-purple-400 mt-4">Scheduled Events:</h3>
      <div>
        {events.map((event, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
            <h4 className="text-purple-500 text-lg">{event.title}</h4>
            <p className="text-gray-300">Required Resources: {JSON.stringify(event.requiredResources)}</p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleFinalSubmit}
        className="w-full bg-purple-500 hover:bg-purple-600 p-2 rounded-lg text-white font-semibold shadow-lg transition-all"
      >
        Submit All Events
      </button>
    </form>
  );
};

// Modal Component
const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-purple-500 text-lg font-bold">Error</h3>
        <p className="text-gray-300">{message}</p>
        <button 
          onClick={onClose} 
          className="mt-4 bg-purple-500 hover:bg-purple-600 p-2 rounded-lg text-white">
          Close
        </button>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [events, setEvents] = useState([]);
  const [availableResources, setAvailableResources] = useState({
    morning: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
    afternoon: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
    evening: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
  });
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleEventSubmit = (eventData) => {
    const totalResources = (resources) => Object.values(resources).reduce((a, b) => a + b, 0);
    const sortedEvents = [...eventData].sort((a, b) => totalResources(a.requiredResources) - totalResources(b.requiredResources));

    sortedEvents.forEach((event, index) => {
      const { requiredResources } = event;
      let sessionAssigned = false;
      let session = '';

      for (const [key, resources] of Object.entries(availableResources)) {
        const hasEnoughResources = Object.entries(requiredResources).every(
          ([resource, amount]) => resources[resource] >= amount
        );

        if (hasEnoughResources) {
          session = key;
          sessionAssigned = true;
          Object.keys(requiredResources).forEach(resource => {
            availableResources[session][resource] -= requiredResources[resource];
          });
          break; // Exit loop once session is assigned
        }
      }

      if (!sessionAssigned) {
        setModalMessage(`Not enough resources available for event "${event.title}".`);
        setShowModal(true);
      } else {
        const assignedClass = `CSE ${index + 1}`; // Assign classes as CSE 1, CSE 2, etc.
        setEvents((prevEvents) => [...prevEvents, { ...event, session, assignedClass }]);
      }
    });
  };

  const removeEvent = (index) => {
    const removedEvent = events[index];
    const { session, requiredResources } = removedEvent;

    // Restore resources
    Object.keys(requiredResources).forEach((resource) => {
      availableResources[session][resource] += requiredResources[resource];
    });

    // Remove the event
    setEvents(events.filter((_, i) => i !== index));
  };

  const downloadEvents = () => {
    const worksheet = XLSX.utils.json_to_sheet(events); // Convert events to a worksheet
    const workbook = XLSX.utils.book_new(); // Create new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events'); // Append sheet to workbook
    XLSX.writeFile(workbook, 'events.xlsx'); // Save as Excel file
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setModalMessage(''); // Clear the message
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <h1 className="text-purple-500 text-3xl font-bold mb-8">Event Scheduler</h1>
      <ResourceDisplay resources={availableResources.morning} session="morning" />
      <ResourceDisplay resources={availableResources.afternoon} session="afternoon" />
      <ResourceDisplay resources={availableResources.evening} session="evening" />
      <EventForm onSubmit={handleEventSubmit} />

      {events.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-purple-500 text-2xl font-bold mb-4">Scheduled Events</h2>
          {events.map((event, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg mb-4">
              <h4 className="text-purple-500 text-lg">{event.title}</h4>
              <p className="text-gray-300">Assigned Session: {event.session}</p>
              <h5 className="text-purple-400">Required Resources:</h5>
              <ul className="list-disc pl-5 text-gray-300">
                {Object.entries(event.requiredResources).map(([resource, count]) => (
                  <li key={resource}>
                    {resource.charAt(0).toUpperCase() + resource.slice(1)}: {count}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => removeEvent(index)}
                className="mt-2 bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white"
              >
                Remove Event
              </button>
            </div>
          ))}
          <button
            onClick={downloadEvents}
            className="mt-4 bg-green-500 hover:bg-green-600 p-2 rounded-lg text-white"
          >
            Download Events
          </button>
        </div>
      )}

      {showModal && <Modal message={modalMessage} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
