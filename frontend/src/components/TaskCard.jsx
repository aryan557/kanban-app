import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onAssign, onSmartAssign }) => {
  // Always get the latest user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  return (
    <div className={`task-card priority-${task.priority?.toLowerCase()}`}> 
      <div className="task-title">{task.title}</div>
      <div className="task-desc">{task.description}</div>
      <div className="task-meta">
        <span className="task-status">{task.status}</span>
        <span className="task-priority">{task.priority}</span>
        <span className="task-user">{task.assignedUser?.username || 'Unassigned'}</span>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task)}>Delete</button>
        {isAdmin && <button onClick={() => onAssign(task)}>Assign</button>}
        {isAdmin && <button onClick={() => onSmartAssign(task)}>Smart Assign</button>}
      </div>
    </div>
  );
};

export default TaskCard; 