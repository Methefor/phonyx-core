import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import Channels from '../components/Channels';
import socketService from '../services/socket';
import '../styles/Dashboard.css';

interface DashboardProps {
  currentUser: any;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [selectedChannelId, setSelectedChannelId] = useState('1');
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);

      // Wait a bit for socket to connect
      const timer = setTimeout(() => {
        setSocketConnected(true);
      }, 1000);

      socketService.updatePresence('online');

      return () => {
        clearTimeout(timer);
        socketService.updatePresence('offline');
        socketService.disconnect();
      };
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    socketService.disconnect();
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🔥 PHONYX</h1>
        <div className="header-right">
          <span className="user-info">Welcome, {currentUser?.username}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="dashboard-content">
        <Channels selectedChannelId={selectedChannelId} onSelectChannel={setSelectedChannelId} />
        <div className="chat-area">
          <div className="channel-header">
            <h2># general</h2>
            <p>Real-time messaging - All users</p>
          </div>
          <Chat currentUser={currentUser} currentChannelId={selectedChannelId} socketConnected={socketConnected} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
