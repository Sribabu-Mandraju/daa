import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Import xlsx for Excel export
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

// Main App Component
const App = () => {
  const [events, setEvents] = useState([]);
  const [availableResources, setAvailableResources] = useState({
    morning: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
    afternoon: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
    evening: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
  });

  const handleEventSubmit = (eventData) => {
    if (Array.isArray(eventData)) {
      eventData.forEach((event) => {
        const { requiredResources } = event;
        let sessionAssigned = false;
        let session = '';

        for (const [key, resources] of Object.entries(availableResources)) {
          const resourcesAvailable = Object.keys(requiredResources).every(
            (resource) => resources[resource] >= requiredResources[resource]
          );

          if (resourcesAvailable) {
            session = key; // Assign the session
            sessionAssigned = true;

            // Deduct resources
            const updatedResources = { ...resources };
            Object.keys(requiredResources).forEach((resource) => {
              updatedResources[resource] -= requiredResources[resource];
            });
            setAvailableResources((prev) => ({
              ...prev,
              [key]: updatedResources,
            }));
            break; // Stop checking once a session is found
          }
        }

        if (sessionAssigned) {
          const sessionEventCount = events.filter((event) => event.session === session).length;
          const assignedClass = `CSE ${sessionEventCount + 1}`; // Ensure 'CSE' is part of the class name

          setEvents((prevEvents) => [...prevEvents, { ...event, assignedClass, session }]);
        } else {
          alert(`Not enough resources available for event "${event.title}" in any session.`);
        }
      });
    }
  };

  const removeEvent = (index) => {
    const eventToRemove = events[index]; // Get the event being removed
    const { session, requiredResources } = eventToRemove;

    // Restore resources for the session
    setAvailableResources((prevResources) => {
      const updatedSessionResources = { ...prevResources[session] };
      Object.keys(requiredResources).forEach((resource) => {
        updatedSessionResources[resource] += requiredResources[resource]; // Add back the resources
      });

      return {
        ...prevResources,
        [session]: updatedSessionResources, // Update the session resources
      };
    });

    // Remove the event from the events list
    setEvents(events.filter((_, i) => i !== index));
  };

  const downloadEvents = () => {
    // Flatten events data for Excel export
    const formattedEvents = events.map((event) => ({
      Title: event.title,
      AssignedClass: event.assignedClass,
      Session: event.session,
      Projectors: event.requiredResources.projectors,
      Mikes: event.requiredResources.mikes,
      Chairs: event.requiredResources.chairs,
      Markers: event.requiredResources.markers,
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(formattedEvents); // Convert formatted events to sheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');
    XLSX.writeFile(workbook, 'scheduled_events.xlsx'); // Export as Excel file
  };
  

  return (
    <div className="App bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl text-purple-500 font-bold mb-8">Event Scheduler</h1>

      {Object.entries(availableResources).map(([session, resources]) => (
        <ResourceDisplay key={session} resources={resources} session={session.charAt(0).toUpperCase() + session.slice(1)} />
      ))}

      <EventForm
        onSubmit={handleEventSubmit}
        availableResources={availableResources}
      />

      <h2 className="text-xl text-purple-400 mt-8">Scheduled Events:</h2>
      <div>
        {events.map((event, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-purple-500 text-lg">{event.title}</h3>
            <p className="text-gray-300">Assigned Class: {event.assignedClass}</p>
            <p className="text-gray-300">Session: {event.session.charAt(0).toUpperCase() + event.session.slice(1)}</p>
            <p className="text-gray-300">
              Required Resources: {JSON.stringify(event.requiredResources)}
            </p>
            <button
              onClick={() => removeEvent(index)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

     <div className="w-full flex items-center justify-end">
      <button
          onClick={downloadEvents}
          className=" bg-purple-500 font-bold hover:bg-purple-600 p-2 rounded-lg text-black  shadow-lg transition-all mt-4"
        >
          Download XL
        </button>
     </div>
    </div>
  );
};

export default App;
