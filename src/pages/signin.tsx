import { Form, Input, Button, Card, Typography, Checkbox} from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import type { SignInFormValues } from '../type';

const { Title, Text } = Typography;

const SignIn = () => {
  const [form] = Form.useForm<SignInFormValues>();

  const onFinish = (values: SignInFormValues) => {
    console.log('Sign in values:', values);
    // Add your authentication logic here
  };

//   const handleSocialLogin = (provider: string) => {
//     console.log(`Sign in with ${provider}`);
//     // Add social login logic here
//   };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
    //   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
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
