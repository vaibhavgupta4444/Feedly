import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { useState } from 'react';
import api from '../lib/api';

const { Title, Text } = Typography;

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPassword = () => {
  const [form] = Form.useForm<ForgotPasswordFormValues>();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values: ForgotPasswordFormValues) => {
    try {
      setLoading(true);
      await api.post('users/forgot-password', values);
      setEmailSent(true);
      notification.success({
        message: 'Reset Link Sent',
        description: 'Please check your email for the password reset link.',
        placement: 'topRight',
      });
    } catch (err) {
      // Error toast handled globally by api interceptor
    } finally {
      setLoading(false);
    }
  };

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
            Forgot Password?
          </Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            {emailSent 
              ? 'Check your email for the reset link' 
              : 'Enter your email to receive a password reset link'
            }
          </Text>
        </div>
        
        {!emailSent ? (
          <Form
            form={form}
            name="forgot-password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />} 
                placeholder="Email address" 
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
                Send Reset Link
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
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              padding: '40px 20px',
              background: '#f0f7ff',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <MailOutlined style={{ fontSize: '48px', color: '#667eea' }} />
              <Title level={4} style={{ marginTop: 16, color: '#1a1a1a' }}>
                Email Sent!
              </Title>
              <Text type="secondary">
                We've sent a password reset link to your email address. 
                Please check your inbox and follow the instructions.
              </Text>
            </div>
            
            <Button 
              type="link"
              onClick={() => setEmailSent(false)}
              style={{ color: '#667eea', fontWeight: 600 }}
            >
              Resend Email
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
