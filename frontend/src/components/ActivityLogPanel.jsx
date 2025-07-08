import React, { useEffect, useState } from 'react';
import { fetchRecentActions } from '../utils/api';

const actionIcons = {
  created: '🟢',
  updated: '🔵',
  'smart-assigned': '🟠',
  assigned: '🟠',
  deleted: '🔴',
};

const actionColors = {
  created: '#22c55e',
  updated: '#3b82f6',
  'smart-assigned': '#f59e42',
  assigned: '#f59e42',
  deleted: '#ef4444',
};

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const ActivityLogPanel = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const loadActions = async () => {
    try {
      const data = await fetchRecentActions();
      // Only update if data is different
      if (JSON.stringify(data) !== JSON.stringify(actions)) {
        setActions(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActions();
    const interval = setInterval(loadActions, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [actions]);

  return (
    <div className="activity-log-panel sidebar-activity-log">
      <h3>Activity Log</h3>
      {loading ? <div>Loading...</div> : (
        <ul className="activity-log-list">
          {actions.map((a) => (
            <li key={a._id} className={a.user?.email === currentUser.email ? 'log-me' : ''}>
              <span
                className="log-icon"
                style={{ color: actionColors[a.action] || '#6366f1' }}
                title={a.action}
              >
                {actionIcons[a.action] || '•'}
              </span>
              <span className="log-user" style={{ fontWeight: a.user?.email === currentUser.email ? 700 : 500 }}>
                {a.user?.username || a.user?.email || 'Someone'}
              </span>
              <span className="log-action" style={{ color: actionColors[a.action] || '#6366f1' }}>
                {a.action}
              </span>
              <span className="log-task">{a.task?.title ? `"${a.task.title}"` : ''}</span>
              <span className="log-time">{formatTime(a.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLogPanel; 