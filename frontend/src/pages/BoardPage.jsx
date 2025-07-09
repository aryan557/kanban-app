import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, createTask, deleteTask, assignTask, smartAssignTask, updateTask } from '../utils/api';
import TaskCard from '../components/TaskCard';
import ActivityLogPanel from '../components/ActivityLogPanel';
import { socket } from '../utils/socket';
import EditTaskModal from '../components/EditTaskModal';
import AssignUserModal from '../components/AssignUserModal';
import ConflictModal from '../components/ConflictModal';

const columns = [
  { key: 'Todo', label: 'Todo' },
  { key: 'In Progress', label: 'In Progress' },
  { key: 'Done', label: 'Done' },
];

const BoardPage = ({ group }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });
  const [creating, setCreating] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [assigningTask, setAssigningTask] = useState(null);
  const [conflict, setConflict] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!group) {
      navigate('/groups');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
    loadTasks();
    socket.auth = { token };
    socket.connect();
    socket.emit('join_board', group.id);
    socket.on('tasks_updated', loadTasks);
    return () => {
      socket.off('tasks_updated', loadTasks);
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [group]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchTasks(group.id);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setCreating(true);
    setError('');
    try {
      const created = await createTask({ ...newTask, boardId: group.id, group: group.id });
      setNewTask({ title: '', description: '', priority: 'Medium' });
      // Optimistically update local state if API returns the new task
      if (created && created._id) {
        setTasks(prev => [...prev, created]);
      } else {
        await loadTasks(); // fallback
      }
      socket.emit('task_changed', group.id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (task) => setEditingTask(task);
  const handleSaveEdit = async (updates) => {
    try {
      await updateTask(editingTask._id, updates);
      socket.emit('task_changed', group.id);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setConflict({ clientTask: { ...editingTask, ...updates }, serverTask: err.response.data.serverTask });
      } else {
        setError('Failed to update task');
      }
    }
    setEditingTask(null); // Always close modal
  };
  const handleCloseEdit = () => setEditingTask(null);
  const handleDelete = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(task._id);
      socket.emit('task_changed', group.id);
    } catch (err) {
      setError('Failed to delete task');
    }
  };
  const handleAssign = (task) => setAssigningTask(task);
  const handleSmartAssign = async (task) => {
    try {
      await smartAssignTask(task._id);
      socket.emit('task_changed', group.id);
    } catch (err) {
      setError('Smart assign failed');
    }
  };
  const handleAssignUser = async (userId) => {
    try {
      await assignTask(assigningTask._id, userId);
      socket.emit('task_changed', group.id);
    } catch (err) {
      setError('Failed to assign user');
    }
    setAssigningTask(null); // Always close modal
  };
  const handleCloseAssign = () => setAssigningTask(null);

  const handleDragStart = (task) => setDraggedTask(task);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (colKey) => {
    if (!draggedTask || draggedTask.status === colKey) return;
    try {
      await updateTask(draggedTask._id, { status: colKey });
      setDraggedTask(null);
      socket.emit('task_changed', group.id);
    } catch (err) {
      setError('Failed to move task');
    }
  };

  const handleOverwrite = async () => {
    try {
      await updateTask(conflict.serverTask._id, { ...conflict.clientTask, force: true });
      setConflict(null);
      socket.emit('task_changed', group.id);
    } catch {
      setError('Failed to overwrite');
    }
  };

  const handleMerge = async (merged) => {
    try {
      await updateTask(conflict.serverTask._id, { ...merged, force: true });
      setConflict(null);
      socket.emit('task_changed', group.id);
    } catch {
      setError('Failed to merge');
    }
  };

  const handleCancelConflict = () => setConflict(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="board-root">
      <div className="background-blobs">
        <span className="blob blob1"></span>
        <span className="blob blob2"></span>
        <span className="blob blob3"></span>
        <span className="blob blob4"></span>
        <span className="blob blob5"></span>
        <span className="blob blob6"></span>
      </div>
      <aside className="sidebar">
        <div className="sidebar-header">
          <svg className="sidebar-kanban-logo" width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="8" width="12" height="38" rx="3" fill="#6366f1"/>
            <rect x="21" y="4" width="12" height="46" rx="3" fill="#f59e42"/>
            <rect x="38" y="16" width="12" height="34" rx="3" fill="#22c55e"/>
            <rect x="4" y="8" width="12" height="38" rx="3" stroke="#3730a3" strokeWidth="1.5"/>
            <rect x="21" y="4" width="12" height="46" rx="3" stroke="#b45309" strokeWidth="1.5"/>
            <rect x="38" y="16" width="12" height="34" rx="3" stroke="#15803d" strokeWidth="1.5"/>
          </svg>
          <div className="sidebar-user">
            <div className="user-avatar">{user.username?.[0]?.toUpperCase() || '?'}</div>
            <div className="user-info">
              <div className="user-name">{user.username || 'User'}</div>
              <div className="user-role">{user.role || ''}</div>
            </div>
          </div>
        </div>
        <ActivityLogPanel />
        <button className="sidebar-logout" onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}>Logout</button>
      </aside>
      <main className="board-main">
        <header className="board-header">
          <h1>Collaborative Kanban Board</h1>
        </header>
        <div className="kanban-board">
          {columns.map(col => (
            <div
              className="kanban-column"
              key={col.key}
              data-col={col.key}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.key)}
            >
              <h2>{col.label}</h2>
              {col.key === 'Todo' && (
                <form className="new-task-form" onSubmit={handleCreateTask}>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  />
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <button type="submit" disabled={creating}>
                    {creating ? 'Adding...' : 'Add Task'}
                  </button>
                </form>
              )}
              <div className="kanban-tasks">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  tasks.filter(t => t.status === col.key).map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAssign={handleAssign}
                      onSmartAssign={handleSmartAssign}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onSave={handleSaveEdit}
            onClose={handleCloseEdit}
          />
        )}
        {assigningTask && (
          <AssignUserModal
            task={assigningTask}
            onAssign={handleAssignUser}
            onClose={handleCloseAssign}
          />
        )}
        {conflict && (
          <ConflictModal
            conflict={conflict}
            onOverwrite={handleOverwrite}
            onMerge={handleMerge}
            onCancel={handleCancelConflict}
          />
        )}
        {error && <div className="error-msg">{error}</div>}
      </main>
    </div>
  );
};

export default BoardPage; 