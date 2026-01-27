import { Badge, Tooltip } from 'antd';
import { BellOutlined, WifiOutlined } from '@ant-design/icons';
import { useNotificationStatus } from '../lib/hooks/useNotifications';
import type { IStatus } from '../type';

export default function NotificationStatusIndicator() {
  const { pushEnabled, socketConnected, pushSupported } = useNotificationStatus();

  const getStatus = ():IStatus => {
    if (socketConnected && pushEnabled) {
      return {
        color: 'success',
        text: 'Real-time and Push notifications active',
        icon: '✅',
      };
    } else if (socketConnected) {
      return {
        color: 'processing',
        text: 'Real-time notifications active (enable push for offline notifications)',
        icon: '🔵',
      };
    } else if (pushEnabled) {
      return {
        color: 'warning',
        text: 'Push notifications active (real-time disconnected)',
        icon: '🟠',
      };
    } else {
      return {
        color: 'default',
        text: pushSupported 
          ? 'Notifications disabled (click to enable)' 
          : 'Push notifications not supported in this browser',
        icon: '⚪',
      };
    }
  };

  const status:IStatus = getStatus();

  return (
    <Tooltip title={status.text}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'help' }}>
        <Badge status={status.color} />
        <div style={{ display: 'flex', gap: 4 }}>
          {socketConnected && <WifiOutlined style={{ color: '#52c41a' }} />}
          {pushEnabled && <BellOutlined style={{ color: '#1890ff' }} />}
        </div>
      </div>
    </Tooltip>
  );
}
