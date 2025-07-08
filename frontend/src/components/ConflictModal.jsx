import React, { useState } from 'react';

const ConflictModal = ({ clientTask, serverTask, onOverwrite, onMerge, onCancel }) => {
  const [merged, setMerged] = useState({ ...clientTask });

  const handleChange = (e) => {
    setMerged({ ...merged, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Conflict Detected</h2>
        <p>Someone else updated this task while you were editing. Choose how to resolve:</p>
        <div className="conflict-versions">
          <div className="conflict-version">
            <h4>Your Version</h4>
            <pre>{JSON.stringify(clientTask, null, 2)}</pre>
          </div>
          <div className="conflict-version">
            <h4>Latest Version</h4>
            <pre>{JSON.stringify(serverTask, null, 2)}</pre>
          </div>
        </div>
        <div className="conflict-actions">
          <button onClick={onOverwrite}>Overwrite</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
        <div style={{marginTop:'1rem'}}>
          <h4>Merge (edit fields):</h4>
          <form onSubmit={e => { e.preventDefault(); onMerge(merged); }} className="edit-task-form">
            <input name="title" value={merged.title} onChange={handleChange} required />
            <input name="description" value={merged.description} onChange={handleChange} />
            <select name="priority" value={merged.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select name="status" value={merged.status} onChange={handleChange}>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <button type="submit">Merge & Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal; 