import { Badge, Tooltip } from 'antd';
import { BellOutlined, WifiOutlined } from '@ant-design/icons';
import { useNotificationStatus } from '../lib/hooks/useNotifications';

export default function NotificationStatusIndicator() {
  const { pushEnabled, socketConnected, pushSupported } = useNotificationStatus();

  const getStatus = () => {
    if (socketConnected && pushEnabled) {
      return {
        color: 'green',
        text: 'Real-time and Push notifications active',
        icon: '✅',
      };
    } else if (socketConnected) {
      return {
        color: 'blue',
        text: 'Real-time notifications active (enable push for offline notifications)',
        icon: '🔵',
      };
    } else if (pushEnabled) {
      return {
        color: 'orange',
        text: 'Push notifications active (real-time disconnected)',
        icon: '🟠',
      };
    } else {
      return {
        color: 'gray',
        text: pushSupported 
          ? 'Notifications disabled (click to enable)' 
          : 'Push notifications not supported in this browser',
        icon: '⚪',
      };
    }
  };

  const status = getStatus();

  return (
    <Tooltip title={status.text}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'help' }}>
        <Badge status={status.color as any} />
        <div style={{ display: 'flex', gap: 4 }}>
          {socketConnected && <WifiOutlined style={{ color: '#52c41a' }} />}
          {pushEnabled && <BellOutlined style={{ color: '#1890ff' }} />}
        </div>
      </div>
    </Tooltip>
  );
}
