import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { categoryService } from "../services/api";

function CategoryPage() {
  const { slug } = useParams(); // Grabs 'tech' from /categories/tech
  const [articles, setArticles] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getBySlug(slug);

        // Check if the backend sent the object inside a 'data' property
        const categoryData = res.data ? res.data : res;

        if (categoryData) {
          setArticles(categoryData.articles || []);
          setCategoryName(categoryData.name || slug);
        }
      } catch (err) {
        console.error("Failed to fetch category articles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (loading)
    return <div className="pt-24 text-center">Loading {slug}...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black mb-8 capitalize text-slate-900">
          Section: <span className="text-blue-600">{categoryName}</span>
        </h1>

        {articles.length === 0 ? (
          <p className="text-slate-500">
            No articles found in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                to={`/article/${article.slug}`}
                key={article.id}
                className="group"
              >
                <div className="aspect-video mb-4 overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={article.coverImage}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-slate-500 line-clamp-2 mt-2">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
