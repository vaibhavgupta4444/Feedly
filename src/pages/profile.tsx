import { Layout, Typography, Button, Card, Avatar, List, Tabs } from 'antd';
import { UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router';
import api from '../lib/api';
import type { Post } from '../type';
import PostItem from '../components/PostItem';
import UserContext from '../contexts/userContext';

const { Content } = Layout;
const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const userData = useContext(UserContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  
  const isOwnProfile = !userId || userId === userData?.user?.id;

  useEffect(() => {
    if (isOwnProfile && userData?.user) {
      loadPosts(userData.user.id);
    } else if (userId) {
      loadPosts(userId);
    }
  }, [userId, userData, isOwnProfile]);

  const loadPosts = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/?user_id=${id}`);
      setPosts(res.data.posts || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ maxWidth: 920, margin: '0 auto', padding: '24px 16px', width: '100%' }}>
        <Link to="/feed">
          <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
            Back to Feed
          </Button>
        </Link>

        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ marginBottom: 4 }}>
                {userData?.user?.username || 'User'}
              </Title>
              <Text type="secondary">{userData?.user?.email || ''}</Text>
              <div style={{ marginTop: 12, display: 'flex', gap: 24 }}>
                <Text>
                  <strong>{userData?.user?.posts_count}</strong> posts
                </Text>
                <Text>
                  <strong>{userData?.user?.followers?.length || 0}</strong> followers
                </Text>
                <Text>
                  <strong>{userData?.user?.following?.length || 0}</strong> following
                </Text>
              </div>
            </div>
          </div>
        </Card>

        <Tabs
          defaultActiveKey="posts"
          items={[
            // {
            //   key: 'posts',
            //   label: 'Posts',
            //   children: (
            //     <List
            //       loading={loading}
            //       dataSource={posts}
            //       renderItem={(post) => <PostItem key={post.id} post={post} />}
            //       locale={{ emptyText: 'No posts yet' }}
            //     />
            //   ),
            // },
            {
              key: 'followers',
              label: `Followers (${userData?.user?.followers?.length || 0})`,
              children: (
                <List
                  dataSource={userData?.user?.followers || []}
                  renderItem={(followerId: string) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<Link to={`/profile/${followerId}`}>User {followerId}</Link>}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: 'No followers yet' }}
                />
              ),
            },
            {
              key: 'following',
              label: `Following (${userData?.user?.following?.length || 0})`,
              children: (
                <List
                  dataSource={userData?.user?.following || []}
                  renderItem={(followingId: string) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={<Link to={`/profile/${followingId}`}>User {followingId}</Link>}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: 'Not following anyone yet' }}
                />
              ),
            },
          ]}
        />
      </Content>
    </Layout>
  );
};

export default Profile;
