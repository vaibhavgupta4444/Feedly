import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router';
import React, { useState, useEffect } from 'react';
import api from '../lib/api';

const { Title, Text } = Typography;

interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

const ResetPassword:React.FC = () => {
  const [form] = Form.useForm<ResetPasswordFormValues>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      notification.error({
        message: 'Invalid Link',
        description: 'This password reset link is invalid or has expired.',
        placement: 'topRight',
      });
      navigate('/signin');
    } else {
      setToken(resetToken);
    }
  }, [searchParams, navigate]);

  const onFinish = async (values: ResetPasswordFormValues) => {
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        placement: 'topRight',
      });
      return;
    }

    try {
      setLoading(true);
      await api.post('users/reset-password', {
        token: token,
        new_password: values.password,
      });
      
      notification.success({
        message: 'Password Reset Successful',
        description: 'Your password has been reset. Please sign in with your new password.',
        placement: 'topRight',
      });
      navigate('/signin');
    } catch (err) {
      // Error toast handled globally by api interceptor
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px',
      position: 'relative'
    }}>
      <Link to="/signin" style={{ position: 'absolute', top: 20, left: 20 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          style={{ color: '#667eea', fontWeight: 500, fontSize: '16px' }}
          size="large"
        >
          Back to Sign In
        </Button>
      </Link>
      
      <Card 
        style={{ 
          width: '100%',
          maxWidth: 450, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8, color: '#1a1a1a' }}>
            Reset Password
          </Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            Enter your new password below
          </Text>
        </div>
        
        <Form
          form={form}
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="New Password" 
              style={{ 
                height: '48px',
                borderRadius: '8px',
                fontSize: '15px'
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="Confirm New Password" 
              style={{ 
                height: '48px',
                borderRadius: '8px',
                fontSize: '15px'
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              loading={loading}
            >
              Reset Password
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Text type="secondary">
              Remember your password?{' '}
              <Link to="/signin" style={{ color: '#667eea', fontWeight: 600 }}>
                Sign In
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
