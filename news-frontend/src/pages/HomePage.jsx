import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { articleService, categoryService } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const API_BASE = "http://localhost:8003";

function HomePage() {
  const { loading: authLoading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    if (!authLoading) fetchInitialData();
  }, [page, category, search, authLoading]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [artRes, catRes] = await Promise.all([
        articleService.getAll({ page, limit: 10, category, search }),
        categoryService.getAll(),
      ]);

      const artData = artRes.data?.articles || artRes.data || artRes || [];
      const pagination = artRes.data?.pagination || {};

      setArticles(Array.isArray(artData) ? artData : []);
      setTotalPages(pagination.pages || 1);
      setCategories(catRes.data?.categories || catRes.data || []);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest">
        Loading identity...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <header className="mb-12 border-b border-slate-100 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-6xl font-black tracking-tighter text-slate-900">
                The Daily <span className="text-blue-600">Post.</span>
              </h1>
              {/* <p className="text-slate-400 font-medium mt-2">
                Curated stories for the modern reader.
              </p> */}
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-10 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                value={search}
                onChange={(e) => setSearchParams({ search: e.target.value })}
              />
              <svg
                className="w-4 h-4 absolute left-4 top-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl text-slate-300 font-bold uppercase tracking-widest">
            No articles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {articles.map((article, idx) => (
              <ArticleCard
                key={article.id || article._id || `article-${idx}`} // FIX 1: Unique Key
                article={article}
                isHero={idx === 0 && page === 1 && !search && !category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article, isHero }) {
  // FIX 2: Prevent empty string src downloads
  const getImageUrl = () => {
    if (!article.coverImage) return null;
    return article.coverImage.startsWith("http")
      ? article.coverImage
      : `${API_BASE}${article.coverImage}`;
  };

  const imageUrl = getImageUrl();

  return (
    <Link
      to={`/article/${article.slug}`}
      className={`group ${
        isHero
          ? "md:col-span-3 flex flex-col md:flex-row gap-10 mb-10"
          : "flex flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl bg-slate-100 ${
          isHero ? "md:w-2/3 aspect-video" : "aspect-[4/3] mb-6"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt={article.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-black text-[10px] uppercase">
            No Preview
          </div>
        )}

        {/* Video Icon Overlay */}
        {article.mediaType === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
              <svg
                className="w-6 h-6 text-blue-600 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
              </svg>
            </div>
          </div>
        )}

        <span className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">
          {article.category?.name || "News"}
        </span>
      </div>

      <div className={isHero ? "md:w-1/3 py-4" : ""}>
        <h2
          className={`${
            isHero ? "text-4xl" : "text-xl"
          } font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-tight`}
        >
          {article.title}
        </h2>
        <p className="text-slate-500 line-clamp-3 mb-6 text-sm leading-relaxed">
          {article.excerpt || article.content?.substring(0, 150)}...
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase">
            {article.author?.name?.charAt(0) || "A"}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
            {article.author?.name || "Staff Writer"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/3] bg-slate-200 rounded-2xl mb-4" />
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-full mb-1" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
  );
}

export default HomePage;
