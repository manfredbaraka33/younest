import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { getNotifications, markAllNotificationsAsRead } from '../helpers/axios';
import { useAuth } from '../contexts/AuthContext';
import TimeAgo from 'timeago-react';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);



  useEffect(() => {
    if (!user || !user.access) {
      return;
    }

    // Fetch initial notifications
    getNotifications().then(data => {
      setNotifications(data);
      setUnreadCount(data.filter(notification => !notification.read).length);
    });

  }, [user]);

  const toggleModal = async () => {
    if (isModalOpen) {
      // Mark unread notifications as read when closing the modal
      const unreadNotifications = notifications.filter(n => !n.read);

      if (unreadNotifications.length > 0) {
        await markAllNotificationsAsRead(); // Assume this marks unread notifications as read
        // Update notifications state locally to reflect the read status
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    }

    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {/* Notification Bell */}
      <span className="notification-container mx-3" onClick={toggleModal}>
        <FaBell style={{ fontSize: '1.5rem', cursor: 'pointer' }} className="bell-icon" />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </span>

      {/* Modal for Notifications */}
      {isModalOpen && (
        <div className="notification-modal">
          <div className="notification-modal-content px-3">
            <div className="row">
              <div className="col px-3"><h4>Notifications</h4>
              <p className='text-primary'> {unreadCount> 0 ? (<>You have {unreadCount} unread notifications</>):(
                <>You dont't have uread notifications</>
              )} </p>
              </div>
              <div style={{cursor: "pointer", fontSize: "x-large"}} onClick={toggleModal} className="col-1 text-danger"><FaTimes /></div>
            </div>
           
            <div classname="ul">
              {notifications.map((notification, index) => (
                <dic className="li" key={index}>

                {notification.notification_type == "follow"  &&

                    <Link to={`/shop/${notification?.related_id}`} onClick={toggleModal} >
                    {notification.read ? (
                      <div className='read-notification'>
                        <p>{notification.message}</p>
                        <small><TimeAgo datetime={notification.created_at} /></small>
                      </div>
                    ) : (
                      <div className="unread-notification">
                        <p>{notification.message}</p>
                        <small><TimeAgo datetime={notification.created_at} /></small>
                      </div>
                    )}
                    </Link>
                }

                {(notification.notification_type === "product") && (
                  <Link to={`/pos/${notification?.related_id}`} onClick={toggleModal}>
                    {notification.read ? (
                      <div className='read-notification'>
                        <p>{notification.message}</p>
                        <small><TimeAgo datetime={notification.created_at} /></small>
                      </div>
                    ) : (
                      <div className="unread-notification">
                        <p>{notification.message}</p>
                        <small><TimeAgo datetime={notification.created_at} /></small>
                      </div>
                    )}
                  </Link>
                )}

           {(notification.notification_type === "review") && (
                  <Link to={`/pos/${notification?.related_id}`} onClick={toggleModal}>
                    {notification.read ? (
                      <div className='read-notification'>
                        <p>{notification.message}</p>
                        <small><TimeAgo datetime={notification.created_at} /></small>
                      </div>
                    ) : (
                      <div className="unread-notification">
                        <p>{notification.message}</p>
                        <small><TimeAgo datetime={notification.created_at} /></small>
                      </div>
                    )}
                  </Link>
                )}

                </div>
              ))}
            </div>
            <button className="btn btn-outline-danger mx-5" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
