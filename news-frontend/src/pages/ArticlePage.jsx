import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { articleService, categoryService, tagService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import MediaGalleryModal from "../components/MediaGalleryModal";

const API_BASE = "http://localhost:8003";

function CreateArticlePage() {
  const navigate = useNavigate();
  const { canEdit } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    videoUrl: "",
    mediaType: "image", // 'image' or 'video'
    categoryId: "",
    tags: [],
    isPublished: true,
  });

  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (!canEdit()) navigate("/");
    const loadMetadata = async () => {
      try {
        const [c, t] = await Promise.all([
          categoryService.getAll(),
          tagService.getAll(),
        ]);
        setCategories(c.data?.categories || c.data || []);
        setAvailableTags(t.data?.tags || t.data || []);
      } catch (err) {
        setError("Metadata sync failed.");
      }
    };
    loadMetadata();
  }, [canEdit, navigate]);

  const handleTagAction = async (e) => {
    if (e.key !== "Enter" || !tagInput.trim()) return;
    e.preventDefault();
    const clean = tagInput.trim().replace("#", "");
    let targetTag = availableTags.find(
      (t) => t.name.toLowerCase() === clean.toLowerCase()
    );

    if (!targetTag) {
      try {
        const res = await tagService.create({ name: clean });
        targetTag = res.data?.tag || res.data;
        setAvailableTags((prev) => [...prev, targetTag]);
      } catch (err) {
        return;
      }
    }
    if (!formData.tags.includes(targetTag.id)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, targetTag.id] }));
    }
    setTagInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoryId) return setError("Select a news section.");
    setLoading(true);
    try {
      const res = await articleService.create({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        tags: formData.tags.map((id) => parseInt(id)),
      });
      navigate(`/article/${res.data.article?.slug || res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Publishing failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        <div className="lg:col-span-8">
          <input
            className="w-full text-5xl font-black tracking-tighter placeholder:text-slate-100 focus:outline-none mb-6"
            placeholder="THE HEADLINE GOES HERE..."
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <textarea
            className="w-full text-xl text-slate-500 font-medium placeholder:text-slate-200 focus:outline-none resize-none mb-8 border-l-2 border-slate-100 pl-6"
            placeholder="Write a compelling excerpt..."
            rows="2"
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
          />
          <textarea
            className="w-full min-h-[600px] text-lg leading-relaxed text-slate-800 placeholder:text-slate-200 focus:outline-none"
            placeholder="Tell the story..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
          />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="bg-slate-50 p-6 border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-900 block mb-2">
                    Section
                  </label>
                  <select
                    className="w-full bg-white border border-slate-200 p-3 text-xs font-bold uppercase outline-none focus:border-blue-600"
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-slate-900 block mb-2">
                    Media Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, mediaType: "image" })
                      }
                      className={`py-2 text-[10px] font-bold uppercase border ${
                        formData.mediaType === "image"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-400 border-slate-200"
                      }`}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, mediaType: "video" })
                      }
                      className={`py-2 text-[10px] font-bold uppercase border ${
                        formData.mediaType === "video"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-400 border-slate-200"
                      }`}
                    >
                      Video
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                Featured Media
              </h3>
              {formData.mediaType === "image" ? (
                <button
                  type="button"
                  onClick={() => setIsGalleryOpen(true)}
                  className="w-full aspect-[16/9] bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center overflow-hidden hover:border-blue-600 transition-all"
                >
                  {formData.coverImage ? (
                    <img
                      src={
                        formData.coverImage.startsWith("http")
                          ? formData.coverImage
                          : `${API_BASE}${formData.coverImage}`
                      }
                      className="w-full h-full object-cover"
                      alt="Selected"
                    />
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase">
                      Open Gallery
                    </span>
                  )}
                </button>
              ) : (
                <input
                  className="w-full bg-slate-50 border border-slate-100 p-3 text-xs outline-none focus:border-blue-600 font-mono"
                  placeholder="Paste YouTube or MP4 link..."
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                />
              )}
            </div>

            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl"
            >
              {loading ? "Processing..." : "Publish to Feed"}
            </button>
            {error && (
              <p className="text-[10px] text-red-500 font-bold uppercase text-center mt-4">
                {error}
              </p>
            )}
          </div>
        </div>
      </form>

      <MediaGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onSelect={(url) => {
          setFormData({ ...formData, coverImage: url });
          setIsGalleryOpen(false);
        }}
      />
    </div>
  );
}
export default CreateArticlePage;
