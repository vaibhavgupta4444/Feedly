import { Layout, Typography, List, Card, Avatar, Button, Space, Badge, message } from 'antd';
import { UserOutlined, HeartOutlined, CommentOutlined, UserAddOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import api from '../lib/api';
import type { Notification } from '../type';
import { socketService } from '../lib/socket';
import NotificationToggle from '../components/NotificationToggle';

const { Content } = Layout;
const { Title, Text } = Typography;

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    load();

    // Listen for real-time notifications (only 'notification' event)
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.is_read) {
        setUnreadCount((prev) => prev + 1);
      }
      message.info(`New notification: ${getMessage(notification)}`);
    };

    socketService.on('notification', handleNewNotification);

    return () => {
      socketService.off('notification', handleNewNotification);
    };
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications/');
      // Handle different response formats
      const data = Array.isArray(res.data) 
        ? res.data 
        : (res.data?.notifications || res.data?.items || []);
      
      setNotifications(data);
      
      // Use unread_count from backend if available, otherwise count manually
      const unread = res.data?.unread_count ?? data.filter((n: Notification) => !n.is_read).length;
      setUnreadCount(unread);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'follow':
        return <UserAddOutlined style={{ color: '#1890ff' }} />;
      case 'like':
        return <HeartOutlined style={{ color: '#ff4d4f' }} />;
      case 'comment':
        return <CommentOutlined style={{ color: '#52c41a' }} />;
      default:
        return <UserOutlined />;
    }
  };

  const getMessage = (notif: Notification) => {
    // Use backend message if available
    if (notif.message) {
      return notif.message;
    }
    
    // Fallback to client-side message generation
    const actor = notif.actor_username || notif.actor?.username || 'Someone';
    switch (notif.type) {
      case 'follow':
        return `${actor} started following you`;
      case 'like':
        return `${actor} liked your post`;
      case 'comment':
        return `${actor} commented on your post`;
      default:
        return 'New notification';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px', width: '100%' }}>
        <Link to="/feed">
          <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
            Back to Feed
          </Button>
        </Link>

        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3} style={{ marginBottom: 0 }}>
              Notifications
              {unreadCount > 0 && (
                <Badge count={unreadCount} style={{ marginLeft: 12 }} />
              )}
            </Title>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead}>Mark all as read</Button>
            )}
          </div>
        </Card>

        {/* Push Notification Settings */}
        <div style={{ marginBottom: 16 }}>
          <NotificationToggle 
            token={localStorage.getItem('access_token') || ''} 
            onSubscriptionChange={(isSubscribed) => {
              message.success(isSubscribed ? 'Push notifications enabled!' : 'Push notifications disabled');
            }}
          />
        </div>

        <List
          loading={loading}
          dataSource={notifications}
          renderItem={(notif) => (
            <Card
              key={notif.id}
              style={{
                marginBottom: 12,
                borderRadius: 12,
                backgroundColor: notif.is_read ? '#fff' : '#e6f7ff',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Avatar icon={getIcon(notif.type)} />
                <div style={{ flex: 1 }}>
                  <Text strong>{getMessage(notif)}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(notif.created_at).toLocaleString()}
                  </Text>
                </div>
                <Space>
                  {!notif.is_read && (
                    <Button size="small" onClick={() => markAsRead(notif.id)}>
                      Mark read
                    </Button>
                  )}
                  <Button size="small" danger onClick={() => deleteNotification(notif.id)}>
                    Delete
                  </Button>
                </Space>
              </div>
            </Card>
          )}
          locale={{ emptyText: 'No notifications' }}
        />
      </Content>
    </Layout>
  );
};

export default Notifications;
