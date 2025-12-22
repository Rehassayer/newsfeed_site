
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../services/api';

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getAll({ page, limit: 9 });
      setArticles(response.data.articles);
      setTotalPages(response.data.pagination.pages);
    } catch (err) {
      setError('Failed to load articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading articles...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">❌ {error}</p>
          <button 
            onClick={fetchArticles}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-12 mb-12 text-center shadow-xl">
          <h1 className="text-5xl font-bold mb-4">Welcome to News Feed</h1>
          <p className="text-xl opacity-90">Stay updated with the latest news and stories</p>
        </section>

        {/* Articles Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Latest Articles</h2>
          
          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">
                No articles found. Be the first to write one!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-12">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ← Previous
            </button>
            
            <span className="text-gray-700 font-semibold">
              Page {page} of {totalPages}
            </span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Article Card Component
function ArticleCard({ article }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link 
      to={`/article/${article.slug}`}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
    >
      {/* Cover Image */}
      {article.coverImage ? (
        <div className="h-48 overflow-hidden bg-gray-200">
          <img 
            src={article.coverImage} 
            alt={article.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-6xl">📰</span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Category Badge */}
        {article.category && (
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3 self-start"
            style={{ backgroundColor: article.category.color || '#3498db' }}
          >
            {article.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <span>👤</span>
            <span>{article.author?.name || 'Anonymous'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>📅</span>
            <span>{formatDate(article.publishedAt)}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>👁️</span>
            <span>{article.views}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>❤️</span>
            <span>{article.likes}</span>
          </span>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.slice(0, 3).map((tag) => (
              <span 
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default HomePage;