import { Layout, Typography, List, Spin } from 'antd';
import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../lib/api';
import PostComposer from '../components/PostComposer';
import PostItem from '../components/PostItem';
import AppHeader from '../components/AppHeader';
import type { Post } from '../type';

const { Content } = Layout;
const { Title, Text } = Typography;

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isAuthed = !!localStorage.getItem('access_token');

  const loadPosts = async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const res = await api.get(`/posts/?page=${pageNum}&page_size=10`);
      const newPosts = res.data.posts || [];
      
      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      
      setHasMore(pageNum < res.data.total_pages);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPosts(nextPage);
    }
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    if (isAuthed) {
      loadPosts(1, true);
    }
  }, [isAuthed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, loadingMore, hasMore]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <AppHeader />
      <Content style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px', width: '100%' }}>
        <div style={{ margin: '16px 0' }}>
          <Title level={3} style={{ marginBottom: 16 }}>Feed</Title>
          {!isAuthed && (
            <Text type="secondary">Sign in to create posts and view your personalized feed.</Text>
          )}
        </div>

        <PostComposer onCreated={(p) => setPosts((prev) => [p, ...prev])} />

        {isAuthed && (
          <>
            <List
              loading={loading}
              dataSource={posts}
              renderItem={(post) => <PostItem key={post.id} post={post} />}
            />
            
            <div ref={observerTarget} style={{ textAlign: 'center', padding: '20px 0' }}>
              {loadingMore && (
                <Spin tip="Loading more posts..." />
              )}
              {!hasMore && posts.length > 0 && (
                <Text type="secondary">No more posts to load</Text>
              )}
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default Feed;
