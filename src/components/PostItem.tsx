import { Card, Avatar, Button, List, Typography, Input, Form, Space } from 'antd';
import { CommentOutlined, UserOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useState } from 'react';
import api from '../lib/api';
import type { Post, Comment } from '../type';

const { Text } = Typography;

export interface PostItemProps {
  post: Post;
  onUpdate?: (post: Post) => void;
}

const PostItem: React.FC<PostItemProps> = ({ post, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();


  const toggleComments = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && comments.length === 0) {
      await loadComments();
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/${post.id}/comment`);
      setComments(res.data.comments || []);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/posts/${post.id}/like`);
        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await api.post(`/posts/${post.id}/like`);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      // Error handled by interceptor
    }
  };

  const submitComment = async (values: { content: string }) => {
    try {
      setSubmitting(true);
      const res = await api.post(`/posts/${post.id}/comment`, { content: values.content });
      setComments((prev) => [res.data, ...prev]);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Card style={{ borderRadius: 12, marginBottom: 16 }}>
      
      <Card.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={post?.author_username || 'Anonymous'}
        description={
          <div>
            <Text>{post?.content}</Text>
            {post?.media_url && (
              <img
                src={post.media_url}
                alt="post media"
                style={{ width: '100%', marginTop: 12, borderRadius: 8 }}
              />
            )}
          </div>
        }
      />
      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button
          icon={liked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
          onClick={toggleLike}
        >
          {likesCount}
        </Button>
        <Button icon={<CommentOutlined />} onClick={toggleComments}>
          {open ? 'Hide' : 'Comments'}
        </Button>
      </div>

      {open && (
        <div style={{ marginTop: 12 }}>
          <Form form={form} onFinish={submitComment} style={{ marginBottom: 16 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="content" style={{ flex: 1, marginBottom: 0 }} rules={[{ required: true }]}>
                <Input placeholder="Write a comment..." />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Post
              </Button>
            </Space.Compact>
          </Form>

          <List
            loading={loading}
            locale={{ emptyText: 'No comments yet' }}
            dataSource={comments}
            renderItem={(c: Comment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} size="small" />}
                  title={<Text strong>{c?.author?.username || c?.username || 'User'}</Text>}
                  description={c?.content}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default PostItem;
