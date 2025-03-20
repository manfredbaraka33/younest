
import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { getNotifications } from '../helpers/axios';
import { connectToWebSocket } from '../socket'; // Import WebSocket logic
import { useAuth } from '../contexts/AuthContext'; // Import the context to get the token

const NotificationBell = () => {
  const { user } = useAuth(); // Get the user data from context
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleNewNotification = (data) => {
    console.log("Received notification:", data); // Add this log to check if data is being received
    setNotifications((prevNotifications) => [data, ...prevNotifications]);
    setUnreadCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (!user || !user.access) {
      console.error('No user or access token found');
      return;
    }

    // Fetch initial notifications
    getNotifications().then(data => {
      setNotifications(data);
      setUnreadCount(data.filter(notification => !notification.read).length);
    });

    // Setup WebSocket connection for real-time notifications
    const socket = connectToWebSocket(user.access, handleNewNotification);

    return () => {
      // Cleanup WebSocket connection on unmount
      socket.close();
    };
  }, [user]); // Dependency array includes user, so it re-runs when user changes

  return (
    <span>
      <FaBell style={{ fontSize: '1.5rem' }} className="mx-2" />
      {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </span>
  );
};

export default NotificationBell;
