import React, { useEffect, useState } from 'react';
import { fetchUserGroups, createGroup, joinGroup } from '../utils/api';

const GroupDashboard = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [error, setError] = useState('');
  const [createName, setCreateName] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await fetchUserGroups();
      setGroups(data);
    } catch (err) {
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createGroup(createName, createPassword);
      setShowCreate(false);
      setCreateName('');
      setCreatePassword('');
      await loadGroups();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await joinGroup(joinName, joinPassword);
      setShowJoin(false);
      setJoinName('');
      setJoinPassword('');
      await loadGroups();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
    }
  };

  const canCreateOrJoin = groups.length < 5;

  return (
    <div className="group-dashboard">
      <h2>Your Groups</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {groups.map((g) => (
            <li key={g.id}>
              <button onClick={() => onSelectGroup(g)}>{g.name}</button>
            </li>
          ))}
        </ul>
      )}
      {canCreateOrJoin && (
        <>
          <button onClick={() => setShowCreate(true)}>Create Group</button>
          <button onClick={() => setShowJoin(true)}>Join Group</button>
        </>
      )}
      {!canCreateOrJoin && (
        <p style={{ color: 'red' }}>You cannot be associated to more than 5 groups at the moment.</p>
      )}
      {showCreate && (
        <div className="modal">
          <form onSubmit={handleCreate}>
            <h3>Create Group</h3>
            <input placeholder="Group Name" value={createName} onChange={e => setCreateName(e.target.value)} required />
            <input placeholder="Password" type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} required />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
          </form>
        </div>
      )}
      {showJoin && (
        <div className="modal">
          <form onSubmit={handleJoin}>
            <h3>Join Group</h3>
            <input placeholder="Group Name" value={joinName} onChange={e => setJoinName(e.target.value)} required />
            <input placeholder="Password" type="password" value={joinPassword} onChange={e => setJoinPassword(e.target.value)} required />
            <button type="submit">Join</button>
            <button type="button" onClick={() => setShowJoin(false)}>Cancel</button>
          </form>
        </div>
      )}
      {error && <div className="error-popup">{error}</div>}
    </div>
  );
};

export default GroupDashboard; 