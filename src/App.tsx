import React from 'react';
import { Layout, theme, Button, Typography, Row, Col, Card, Space } from 'antd';
import {
  RocketOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const features = [
    {
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#667eea' }} />,
      title: 'Fast & Modern',
      description: 'Experience lightning-fast performance with our cutting-edge technology',
    },
    {
      icon: <HeartOutlined style={{ fontSize: '32px', color: '#f093fb' }} />,
      title: 'Connect & Share',
      description: 'Share your moments and connect with people around the world',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#4facfe' }} />,
      title: 'Safe & Secure',
      description: 'Your privacy matters. We keep your data protected and secure',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#ffd700' }} />,
      title: 'Real-time Updates',
      description: 'Stay updated with instant notifications and live feeds',
    },
    {
      icon: <ShareAltOutlined style={{ fontSize: '32px', color: '#00f2fe' }} />,
      title: 'Easy Sharing',
      description: 'Share photos, videos, and thoughts with just one click',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '32px', color: '#43e97b' }} />,
      title: 'Global Community',
      description: 'Join millions of users in our vibrant global community',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Header */}
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 5%',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Title level={3} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Feedly
        </Title>
        <Space size="middle">
          <Link to="/signin">
            <Button type="text" size="large" style={{ fontWeight: 500 }}>
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
                fontWeight: 500,
                borderRadius: '8px',
              }}
            >
              Get Started
            </Button>
          </Link>
        </Space>
      </Header>

      <Content>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '80px 5%',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Title 
            level={1} 
            style={{ 
              color: 'white', 
              fontSize: 'clamp(32px, 5vw, 56px)',
              marginBottom: 24,
              fontWeight: 700,
            }}
          >
            Connect, Share, Inspire
          </Title>
          <Paragraph 
            style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: 'clamp(16px, 2vw, 20px)',
              maxWidth: 600,
              margin: '0 auto 40px',
            }}
          >
            Join millions of people sharing their stories, building communities, and creating meaningful connections every day.
          </Paragraph>
          <Space size="large" wrap>
            <Link to="/signup">
              <Button 
                size="large" 
                style={{
                  height: '50px',
                  padding: '0 40px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '25px',
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                }}
              >
                Join Now
              </Button>
            </Link>
            <Button 
              size="large"
              style={{
                height: '50px',
                padding: '0 40px',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '25px',
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
              }}
            >
              Learn More
            </Button>
          </Space>
        </div>

        {/* Features Section */}
        <div style={{ padding: '80px 5%', maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <Title level={2} style={{ marginBottom: 16 }}>
              Why Choose Feedly?
            </Title>
            <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: 600, margin: '0 auto' }}>
              Everything you need to stay connected and engaged with your community
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: '16px',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                  }}
                  bodyStyle={{ padding: '32px' }}
                >
                  <div style={{ marginBottom: 20 }}>{feature.icon}</div>
                  <Title level={4} style={{ marginBottom: 12 }}>
                    {feature.title}
                  </Title>
                  <Paragraph style={{ color: '#666', marginBottom: 0 }}>
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* CTA Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '80px 5%',
            textAlign: 'center',
          }}
        >
          <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
            Ready to Get Started?
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', marginBottom: 40 }}>
            Join our community today and start your journey
          </Paragraph>
          <Link to="/signup">
            <Button
              size="large"
              style={{
                height: '50px',
                padding: '0 50px',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '25px',
                background: 'white',
                color: '#f5576c',
                border: 'none',
              }}
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </Content>

      {/* Footer */}
      <Footer 
        style={{ 
          textAlign: 'center', 
          background: '#fafafa',
          padding: '24px 5%',
        }}
      >
        <Text type="secondary">
          Feedly ©{new Date().getFullYear()} - Connect, Share, Inspire
        </Text>
      </Footer>
    </Layout>
  );
};

export default App;
