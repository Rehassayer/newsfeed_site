import { useState, useEffect } from "react";
import { mediaService } from "../services/api";

const API_BASE = "http://localhost:8003";

function MediaGalleryModal({ isOpen, onClose, onSelect }) {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState("library");

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await mediaService.getAll();
      setLibrary(res.data?.media || res.data || []);
    } catch (err) {
      console.error("Gallery sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await mediaService.upload(formData);
      const newAsset = res.data?.media || res.data;
      setLibrary((prev) => [newAsset, ...prev]);
      setTab("library");
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Helper to check if a file is a video based on extension
  const isVideo = (url) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
      <div
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl bg-white h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex gap-8">
            <button
              onClick={() => setTab("library")}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                tab === "library" ? "text-blue-600" : "text-slate-400"
              }`}
            >
              Media Library
            </button>
            <button
              onClick={() => setTab("upload")}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                tab === "upload" ? "text-blue-600" : "text-slate-400"
              }`}
            >
              Upload Asset
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {tab === "library" ? (
            loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {library.map((item) => {
                  const fullUrl = item.url.startsWith("http")
                    ? item.url
                    : `${API_BASE}${item.url}`;
                  const videoType = isVideo(item.url);

                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item.url)}
                      className="group relative aspect-square bg-white border border-slate-100 overflow-hidden hover:border-blue-600 transition-all"
                    >
                      {videoType ? (
                        <div className="relative w-full h-full">
                          <video className="w-full h-full object-cover">
                            <source src={fullUrl} type="video/mp4" />
                          </video>
                          {/* Play Icon Overlay for Videos */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <svg
                              className="w-8 h-8 text-white opacity-80"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={fullUrl}
                          alt="Asset"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all" />
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center">
              <label className="w-full h-64 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-600 transition-all group">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 text-center px-4">
                  {uploading
                    ? "Processing Asset..."
                    : "Drop Images or Videos Here"}
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            Select an asset to use as featured media
          </p>
        </div>
      </div>
    </div>
  );
}

export default MediaGalleryModal;
