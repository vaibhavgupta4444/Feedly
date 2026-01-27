import { Card, Form, Input, Button, Upload, Switch, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { useState } from 'react';
import type { UploadFile } from 'antd';
import api from '../lib/api';
import type { PostComposerProps } from '../type';



const PostComposer: React.FC<PostComposerProps> = ({ onCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isAuthed = !!localStorage.getItem('access_token');

  const submit = async (values: { content?: string; is_private?: boolean }) => {
    try {
      setLoading(true);
      
      // Validate that at least content or media is provided
      if (!values.content && fileList.length === 0) {
        message.error('Post must have either content or media');
        return;
      }
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      if (values.content) {
        formData.append('content', values.content);
      }
      
      // Add media file if present
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('media', fileList[0].originFileObj);
      }
      
      // Add is_private flag
      formData.append('is_private', String(values.is_private || false));

      const res = await api.post('/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onCreated?.(res.data);
      form.resetFields();
      setFileList([]);
      message.success('Post created successfully!');
    } catch (err) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ borderRadius: 12, marginBottom: 16 }}>
      <Form form={form} layout="vertical" onFinish={submit} initialValues={{ is_private: false }}>
        <Form.Item name="content">
          <Input.TextArea
            placeholder={isAuthed ? "What's happening?" : 'Sign in to create a post'}
            autoSize={{ minRows: 2, maxRows: 6 }}
            disabled={!isAuthed}
          />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList.slice(-1))}
              maxCount={1}
              accept="image/*,video/*"
              disabled={!isAuthed}
            >
              <Button icon={<PictureOutlined />} disabled={!isAuthed}>
                Add Media
              </Button>
            </Upload>
            <Form.Item name="is_private" valuePropName="checked" style={{ margin: 0 }}>
              <Switch checkedChildren="Private" unCheckedChildren="Public" disabled={!isAuthed} />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" loading={loading} disabled={!isAuthed}>
            Post
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PostComposer;