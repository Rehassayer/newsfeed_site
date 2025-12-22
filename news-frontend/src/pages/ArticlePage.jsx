
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleService, commentService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getBySlug(slug);
      setArticle(response.data.article);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await articleService.like(article.id);
      setArticle({ ...article, likes: article.likes + 1 });
      setLiked(true);
    } catch (err) {
      console.error('Failed to like article:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await commentService.create({
        articleId: article.id,
        content: commentText,
        parentId: replyingTo,
      });

      // Refresh article to get new comments
      await fetchArticle();
      setCommentText('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">❌ {error}</p>
          <Link 
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Back Button */}
        <Link 
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Articles
        </Link>

        {/* Article Content */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          
          {/* Cover Image */}
          {article.coverImage && (
            <div className="h-96 overflow-hidden bg-gray-200">
              <img 
                src={article.coverImage} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            
            {/* Category Badge */}
            {article.category && (
              <span 
                className="inline-block px-4 py-1 rounded-full text-sm font-bold text-white mb-4"
                style={{ backgroundColor: article.category.color || '#3498db' }}
              >
                {article.category.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {article.author?.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{article.author?.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(article.publishedAt)}</span>
              </div>

              {/* Reading Time */}
              {article.readingTime && (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{article.readingTime} min read</span>
                </div>
              )}

              {/* Views */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{article.views} views</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <span 
                    key={tag.id}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Like Button */}
            <div className="flex items-center gap-4 pt-8 border-t border-gray-200">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  liked 
                    ? 'bg-red-100 text-red-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600'
                }`}
              >
                <svg className="w-6 h-6" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{article.likes} {liked ? 'Liked' : 'Like'}</span>
              </button>

              {/* Share Button */}
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({article.comments?.length || 0})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              {replyingTo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 flex items-center justify-between">
                  <span className="text-blue-700 text-sm">Replying to a comment</span>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-blue-700 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </div>
              )}
              
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              
              <div className="flex justify-end gap-3 mt-3">
                {replyingTo && (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
              <p className="text-gray-600 mb-4">Please login to comment</p>
              <Link 
                to="/login"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {article.comments && article.comments.length > 0 ? (
              article.comments.map((comment) => (
                <Comment 
                  key={comment.id} 
                  comment={comment}
                  onReply={setReplyingTo}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Comment Component
function Comment({ comment, onReply, isReply = false }) {
  return (
    <div className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {comment.user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">
                {comment.user?.name || 'Anonymous'}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>

          {/* Reply Button */}
          {!isReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-sm text-blue-600 hover:text-blue-700 mt-2"
            >
              Reply
            </button>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <Comment 
                  key={reply.id} 
                  comment={reply} 
                  onReply={onReply}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;