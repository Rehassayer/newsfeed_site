
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService, categoryService, tagService } from '../services/api';
import { useAuth } from '../context/AuthContext';

function CreateArticlePage() {
  const navigate = useNavigate();
  const { user, canEdit } = useAuth();

  // Redirect if user can't create articles
  useEffect(() => {
    if (!canEdit()) {
      navigate('/');
    }
  }, [canEdit, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    categoryId: '',
    tags: [],
    isPublished: false,
    isFeatured: false,
    isBreaking: false,
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch categories and tags
  useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        categoryService.getAll(),
        tagService.getAll(),
      ]);
      setCategories(categoriesRes.data.categories);
      setTags(tagsRes.data.tags);
    } catch (err) {
      console.error('Failed to fetch categories/tags:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleTagToggle = (tagId) => {
    const currentTags = formData.tags;
    if (currentTags.includes(tagId)) {
      setFormData({
        ...formData,
        tags: currentTags.filter((id) => id !== tagId),
      });
    } else {
      setFormData({
        ...formData,
        tags: [...currentTags, tagId],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const response = await articleService.create({
        ...formData,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      });

      setSuccess('Article created successfully!');
      
      // Redirect to article page after 1 second
      setTimeout(() => {
        navigate(`/article/${response.data.article.slug}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Write New Article</h1>
          <p className="text-gray-600">Share your story with the world</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter an engaging title..."
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">
              Excerpt (Short Description)
            </label>
            <input
              id="excerpt"
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief summary of your article..."
            />
            <p className="text-sm text-gray-500 mt-1">This will appear on the article cards</p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Article Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="15"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Write your article content here..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="coverImage" className="block text-sm font-semibold text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              id="coverImage"
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            {formData.coverImage && (
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={formData.coverImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.tags.includes(tag.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Publishing Options */}
          <div className="space-y-3 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Publishing Options</h3>
            
            {/* Publish */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">
                <span className="font-medium">Publish immediately</span>
                <span className="block text-sm text-gray-500">Make this article visible to everyone</span>
              </span>
            </label>

            {/* Featured - Only for EDITOR/ADMIN */}
            {(user?.role === 'EDITOR' || user?.role === 'ADMIN') && (
              <>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Featured article</span>
                    <span className="block text-sm text-gray-500">Highlight this article on homepage</span>
                  </span>
                </label>

                {/* Breaking News */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isBreaking"
                    checked={formData.isBreaking}
                    onChange={handleChange}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-3 text-gray-700">
                    <span className="font-medium">Breaking news</span>
                    <span className="block text-sm text-gray-500">Mark as urgent/breaking news</span>
                  </span>
                </label>
              </>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                formData.isPublished ? 'Publish Article' : 'Save as Draft'
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateArticlePage;