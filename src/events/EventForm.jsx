import React from 'react'

const EventForm = ({ resources, onSubmit }) => {
    const [title, setTitle] = React.useState("");
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [requiredResources, setRequiredResources] = React.useState([]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ title, startTime, endTime, requiredResources });
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Event Title:</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
            className="input"
          />
        </div>
  
        <div>
          <label className="block">Start Time:</label>
          <input 
            type="time" 
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)} 
            className="input"
          />
        </div>
  
        <div>
          <label className="block">End Time:</label>
          <input 
            type="time" 
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)} 
            className="input"
          />
        </div>
  
        <div>
          <label className="block">Required Resources:</label>
          <select 
            multiple 
            value={requiredResources}
            onChange={(e) => setRequiredResources([...e.target.selectedOptions].map(o => o.value))}
            className="input"
          >
            {resources.map((resource) => (
              <option key={resource} value={resource}>{resource}</option>
            ))}
          </select>
        </div>
  
        <button type="submit" className="btn-primary">Submit Event</button>
      </form>
    );
  };
  

export default EventForm
