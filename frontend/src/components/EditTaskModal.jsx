import React, { useState } from 'react';

const EditTaskModal = ({ task, onSave, onClose }) => {
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Task</h2>
        <form onSubmit={handleSubmit} className="edit-task-form">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
          <label>Description</label>
          <input name="description" value={form.description} onChange={handleChange} />
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {error && <div className="error-msg">{error}</div>}
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal; 