import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import React, { useState } from 'react';
import api from '../lib/api';

const { Title, Text } = Typography;

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
}

interface VerifyFormValues {
  otp: string;
}

const SignUp:React.FC = () => {
  const [form] = Form.useForm<SignUpFormValues>();
  const [verifyForm] = Form.useForm<VerifyFormValues>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registrationData, setRegistrationData] = useState<SignUpFormValues | null>(null);

  const onRegister = async (values: SignUpFormValues) => {
    try {
      setLoading(true);
      await api.post('/users/register', values);
      setRegistrationData(values);
      setStep('verify');
      notification.success({
        message: 'OTP Sent',
        description: 'Please check your email for the verification code.',
        placement: 'topRight',
      });
    } catch (err) {
      // Error toast handled globally by api interceptor
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (values: VerifyFormValues) => {
    try {
      setLoading(true);
      const response = await api.post('/users/verify-otp', {
        email: registrationData?.email,
        otp: values.otp,
      });
      
      // Save tokens to localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      
      notification.success({
        message: 'Account Verified',
        description: 'Your account has been verified successfully!',
        placement: 'topRight',
      });
      navigate('/feed');
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
      <Link to="/" style={{ position: 'absolute', top: 20, left: 20 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          style={{ color: '#667eea', fontWeight: 500, fontSize: '16px' }}
          size="large"
        >
          Back to Home
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
        {step === 'register' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 8, color: '#1a1a1a' }}>
                Create Your Account
              </Title>
              <Text type="secondary" style={{ fontSize: '15px' }}>
                Join our community today
              </Text>
            </div>
            
            <Form
              form={form}
              name="signup"
              onFinish={onRegister}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                  { min: 3, message: 'Username must be at least 3 characters!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
                  placeholder="Username" 
                  style={{ 
                    height: '48px',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </Form.Item>

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

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />} 
                  placeholder="Password" 
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
                  Sign Up
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Text type="secondary">
                  Already have an account?{' '}
                  <Link to="/signin" style={{ color: '#667eea', fontWeight: 600 }}>
                    Sign In
                  </Link>
                </Text>
              </div>
            </Form>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 8, color: '#1a1a1a' }}>
                Verify Your Email
              </Title>
              <Text type="secondary" style={{ fontSize: '15px' }}>
                We sent a verification code to<br />
                <strong>{registrationData?.email}</strong>
              </Text>
            </div>
            
            <Form
              form={verifyForm}
              name="verify"
              onFinish={onVerify}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Please input the verification code!' },
                  { len: 6, message: 'Verification code must be 6 digits!' }
                ]}
              >
                <Input 
                  placeholder="Enter 6-digit code" 
                  maxLength={6}
                  style={{ 
                    height: '48px',
                    borderRadius: '8px',
                    fontSize: '20px',
                    textAlign: 'center',
                    letterSpacing: '8px',
                    fontWeight: 'bold'
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
                  Verify Account
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button 
                  type="link" 
                  onClick={() => setStep('register')}
                  style={{ color: '#667eea', fontWeight: 600 }}
                >
                  Back to Registration
                </Button>
              </div>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default SignUp;
