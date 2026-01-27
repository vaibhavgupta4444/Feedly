import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Button, Result, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an external error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          background: '#f5f5f5'
        }}>
          <Result
            status="error"
            icon={<WarningOutlined style={{ color: '#ff4d4f' }} />}
            title="Oops! Something went wrong"
            subTitle="We're sorry for the inconvenience. The application encountered an unexpected error."
            extra={[
              <Button type="primary" key="reload" onClick={this.handleReload}>
                Reload Page
              </Button>,
              <Button key="home" onClick={this.handleGoHome}>
                Go Home
              </Button>,
            ]}
          >
            {import.meta.env.VITE_ENV === 'development' && this.state.error && (
              <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                <Paragraph>
                  <Text strong style={{ fontSize: 16 }}>Error Details (Development Mode):</Text>
                </Paragraph>
                <Paragraph>
                  <Text code style={{ fontSize: 12 }}>
                    {this.state.error.toString()}
                  </Text>
                </Paragraph>
                {this.state.errorInfo && (
                  <Paragraph>
                    <Text strong>Component Stack:</Text>
                    <pre style={{ 
                      fontSize: 11, 
                      background: '#fafafa', 
                      padding: '10px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '200px'
                    }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </Paragraph>
                )}
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
