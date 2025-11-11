import { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import Button from './Button';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const postsPerPage = 10;

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${postsPerPage}&_page=${page}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      
      if (page === 1) {
        setPosts(data);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, [postsPerPage]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Posts from JSONPlaceholder
        </h1>
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-400">Loading posts...</span>
          </div>
        </Card>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Posts from JSONPlaceholder
        </h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <Button onClick={() => fetchPosts(1)} variant="primary">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Posts from JSONPlaceholder
      </h1>

      {/* Search Bar */}
      <Card className="mb-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search posts by title or content..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {searchQuery && (
            <Button
              variant="secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear
            </Button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        )}
      </Card>

      {/* Error State (if error occurs after initial load) */}
      {error && posts.length > 0 && (
        <Card className="mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">Error loading more posts: {error}</p>
        </Card>
      )}

      {/* Posts Grid */}
      {filteredPosts.length === 0 && searchQuery ? (
        <Card>
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No posts found matching "{searchQuery}"
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredPosts.map((post, index) => (
            <Card
              key={post.id}
              className="animate-slide-up hover:scale-105 transition-transform duration-200"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-4 mb-4">
                {post.body}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                <span>Post ID: {post.id}</span>
                <span>User ID: {post.userId}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!searchQuery && (
        <div className="text-center">
          {isLoadingMore ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading more posts...</span>
            </div>
          ) : (
            <Button onClick={loadMore} variant="primary" className="px-8">
              Load More Posts
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostsList;

