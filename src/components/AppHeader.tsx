import { Layout, Button, Space, Badge, Avatar, Dropdown } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { socketService } from '../lib/socket';
import type { Notification, NotificationsResponse } from '../type';
import NotificationStatusIndicator from './NotificationStatusIndicator';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const isAuthed = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (isAuthed) {
      loadUnreadCount();

      // Listen for real-time notification updates
      const handleNewNotification = (notification: Notification) => {
        if (!notification.is_read) {
          setUnreadCount((prev) => prev + 1);
        }
      };

      socketService.on('notification', handleNewNotification);

      return () => {
        socketService.off('notification', handleNewNotification);
      };
    }
  }, [isAuthed]);

  const loadUnreadCount = async (): Promise<void> => {
  try {
    const res = await api.get<NotificationsResponse | Notification[]>('/notifications/');
    const data = res.data;

    if (
      typeof data === 'object' &&
      data !== null &&
      'unread_count' in data &&
      typeof data.unread_count === 'number'
    ) {
      setUnreadCount(data.unread_count);
      return;
    }

    const notifications: Notification[] = Array.isArray(data)
      ? data
      : data.notifications ?? data.items ?? [];

    setUnreadCount(notifications.filter((n) => !n.is_read).length);
  } catch (error: unknown) {
    console.error('Failed to load unread count', error);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/signin');
  };

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 5%',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h2
          style={{
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '24px',
            fontWeight: 700,
          }}
        >
          Feedly
        </h2>
      </Link>

      <Space size="middle">
        {isAuthed ? (
          <>
            <NotificationStatusIndicator />
            <Link to="/feed">
              <Button type="text" icon={<HomeOutlined />} size="large">
                Feed
              </Button>
            </Link>
            <Link to="/notifications">
              <Badge count={unreadCount} offset={[-5, 5]}>
                <Button type="text" icon={<BellOutlined />} size="large" />
              </Badge>
            </Link>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: 'My Profile',
                    icon: <UserOutlined />,
                    onClick: () => navigate('/profile/me'),
                  },
                  {
                    key: 'logout',
                    label: 'Logout',
                    icon: <LogoutOutlined />,
                    danger: true,
                    onClick: handleLogout,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </>
        ) : (
          <>
            <Link to="/signin">
              <Button type="text" size="large">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                type="primary"
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                Get Started
              </Button>
            </Link>
          </>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;
