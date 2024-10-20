import React, { useState } from 'react';
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
const EventForm = ({ index, onSubmit, assignedClass }) => {
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
    onSubmit({ title, requiredResources, assignedClass });
    setTitle('');
    setRequiredResources({ projectors: 0, mikes: 0, chairs: 0, markers: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-lg space-y-6 mb-8">
      <h2 className="text-purple-500 text-2xl font-bold mb-4">Event {index + 1}</h2>

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
        type="submit"
        className="w-full bg-purple-500 hover:bg-purple-600 p-2 rounded-lg text-white font-semibold shadow-lg transition-all"
      >
        Submit Event
      </button>
    </form>
  );
};

// Main App Component
const App = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [events, setEvents] = useState([]);
  const [availableResources, setAvailableResources] = useState({
    morning: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
    afternoon: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
    evening: { projectors: 5, mikes: 5, chairs: 5, markers: 5 },
  });
  const handleEventSubmit = (eventData) => {
    const { requiredResources } = eventData;
  
    let sessionAssigned = false;
    let session = '';
  
    // Try assigning to each session
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
      // Create a unique class identifier based on the class name and the number of events in that session
      const sessionEventCount = events.filter(event => event.session === session).length;
      const assignedClass = `CSE ${sessionEventCount + 1}`; // Ensure 'CSE' is part of the class name
  
      setEvents([...events, { ...eventData, assignedClass, session }]);
    } else {
      alert('Not enough resources available for this event in any session.');
    }
  
    console.log(events);
  };
  
  

  return (
    <div className="App bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl text-purple-500 font-bold mb-8">Event Scheduler</h1>

      {Object.entries(availableResources).map(([session, resources]) => (
        <ResourceDisplay key={session} resources={resources} session={session.charAt(0).toUpperCase() + session.slice(1)} />
      ))}

      {Array.from({ length: totalEvents }).map((_, index) => (
        <EventForm
          key={index}
          index={index}
          onSubmit={handleEventSubmit}
        />
      ))}

      <button
        onClick={() => setTotalEvents(totalEvents + 1)}
        className="bg-purple-500 hover:bg-purple-600 p-2 rounded-lg text-white font-semibold shadow-lg transition-all"
      >
        Add Event
      </button>

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
