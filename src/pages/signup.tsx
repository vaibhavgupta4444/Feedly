import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router';

const { Title, Text } = Typography;

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const [form] = Form.useForm<SignUpFormValues>();

  const onFinish = (values: SignUpFormValues) => {
    console.log('Sign up values:', values);
    // Add your registration logic here
  };

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
            Create Your Account
          </Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            Join our community today
          </Text>
        </div>
        
        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
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
      </Card>
    </div>
  );
};

export default SignUp;
