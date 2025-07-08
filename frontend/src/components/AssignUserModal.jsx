import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../utils/api';

const AssignUserModal = ({ task, onAssign, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(task.assignedUser?._id || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onAssign(selected);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Assign User</h2>
        <form onSubmit={handleSubmit} className="edit-task-form">
          {loading ? <div>Loading users...</div> : (
            <select value={selected} onChange={e => setSelected(e.target.value)} required>
              <option value="">Select user</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
              ))}
            </select>
          )}
          <div className="modal-actions">
            <button type="submit" disabled={!selected}>Assign</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignUserModal; 