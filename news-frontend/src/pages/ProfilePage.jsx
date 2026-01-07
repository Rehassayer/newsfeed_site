import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { articleService } from "../services/api";
import { Link } from "react-router-dom";

function ProfilePage() {
  const { user, canEdit, isAdmin, loading: authLoading } = useAuth();
  const [myArticles, setMyArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal States
  const [showSoonModal, setShowSoonModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  useEffect(() => {
    if (user && canEdit?.()) fetchUserArticles();
  }, [user]);

  const fetchUserArticles = async () => {
    try {
      setLoading(true);
      // Compatibility check for user ID fields
      const res = await articleService.getAll({
        authorId: user.id || user._id,
      });
      setMyArticles(res.data?.articles || res.data || []);
    } catch (err) {
      console.error("Error loading articles", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      await articleService.delete(articleToDelete.id || articleToDelete._id);
      setMyArticles(
        myArticles.filter(
          (a) => (a.id || a._id) !== (articleToDelete.id || articleToDelete._id)
        )
      );
      setShowDeleteModal(false);
    } catch (err) {
      alert("Failed to delete article. Please try again.");
    }
  };

  if (authLoading)
    return (
      <div className="pt-40 text-center font-black uppercase tracking-widest text-slate-400">
        Authenticating...
      </div>
    );

  if (!user)
    return (
      <div className="pt-40 text-center font-medium text-slate-500">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-20 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col md:flex-row items-center gap-10 mb-12">
          <div className="h-32 w-32 bg-slate-900 rounded-full flex items-center justify-center text-white text-4xl font-black ring-4 ring-blue-50">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="text-center md:text-left flex-1">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md mb-3">
              {user?.role || "Member"} Account
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {user?.name}
            </h1>
            <p className="text-slate-500 font-medium mb-6">{user?.email}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <button
                onClick={() => setShowSoonModal(true)}
                className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
              >
                Update Settings
              </button>

              {isAdmin?.() && (
                <button
                  onClick={() => setShowSoonModal(true)}
                  className="px-8 py-3 border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contributions Section */}
        {canEdit?.() && (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b-2 border-slate-100 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                  Your Library
                </h2>
                <p className="text-slate-400 text-sm">
                  Manage your published stories and drafts.
                </p>
              </div>
              <Link
                to="/create-article"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all"
              >
                + New Story
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
                ))}
              </div>
            ) : myArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myArticles.map((article) => (
                  <div
                    key={article.id || article._id}
                    className="group bg-white p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all flex gap-5 items-center relative"
                  >
                    <div className="h-20 w-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      {article.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt=""
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-300">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 truncate mb-1">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            article.isPublished
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                        />
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">
                          {article.isPublished ? "Live" : "Draft"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        to={`/edit-article/${
                          article.id || article._id || article.slug
                        }`}
                        className="p-2 text-slate-400 hover:text-blue-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(article)}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl py-20 text-center border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-medium italic">
                  No articles yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Coming Soon Modal */}
      {showSoonModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
              Coming Soon
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              We're currently building this feature to give you the best
              experience. Stay tuned!
            </p>
            <button
              onClick={() => setShowSoonModal(false)}
              className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
              Delete Story?
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">
                "{articleToDelete?.title}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 text-[10px] font-black uppercase rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
