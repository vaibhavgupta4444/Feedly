import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Result
          status="404"
          title={
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#262626' }}>
              404
            </span>
          }
          subTitle={
            <div>
              <p style={{ fontSize: '20px', marginBottom: '10px', color: '#595959' }}>
                Page Not Found
              </p>
              <p style={{ fontSize: '14px', color: '#8c8c8c' }}>
                Sorry, the page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          }
          extra={[
            <Button
              type="primary"
              icon={<HomeOutlined />}
              size="large"
              onClick={handleGoHome}
              key="home"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                height: '44px',
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              Go Home
            </Button>,
            <Button
              icon={<ArrowLeftOutlined />}
              size="large"
              onClick={handleGoBack}
              key="back"
              style={{
                height: '44px',
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              Go Back
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default NotFound;
