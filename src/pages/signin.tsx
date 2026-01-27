import { Form, Input, Button, Card, Typography, Checkbox, notification} from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router';
import type { SignInFormValues } from '../type';
import React, { useState } from 'react';
import api from '../lib/api';

const { Title, Text } = Typography;

const SignIn:React.FC = () => {
  const [form] = Form.useForm<SignInFormValues>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SignInFormValues) => {
    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append('username', values.username);
      formData.append('password', values.password);
      
      const response = await api.post('/users/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (response.data?.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        if (response.data?.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        notification.success({
          message: 'Signed in successfully',
          description: 'Welcome back! You are now signed in.',
          placement: 'topRight',
        });
        navigate('/feed');
      }
    } catch (err) {
      // Error notification is handled globally by api interceptor
      console.log(err)
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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8, color: '#1a1a1a' }}>
            Welcome Back!
          </Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            Sign in to continue to your account
          </Text>
        </div>
        
        <Form
          form={form}
          name="signin"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please input your username!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
              placeholder="username" 
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
              { min: 6 , message: 'Password must be at least 6 characters!' }
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Checkbox>Remember me</Checkbox>
              <Link to="/forgot-password" style={{ color: '#667eea', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
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
              Sign In
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Text type="secondary">
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: '#667eea', fontWeight: 600 }}>
                Sign Up
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
