import { useParams, useNavigate, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowLeft, Heart, Calendar, Share2, Copy, Check } from "lucide-react";
import { getPoems, toggleFavorite, authorLabels } from "@/lib/poems";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";

export default function PoemView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const poem = useMemo(() => getPoems().find(p => p.id === id), [id, refreshKey]);

  if (!poem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Poem not found.</p>
      </div>
    );
  }

  const handleFavorite = () => {
    toggleFavorite(poem.id);
    setRefreshKey(k => k + 1);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-ui text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Header */}
          <div className="mb-10">
            <Link
              to={`/poems/${poem.author}`}
              className="text-xs font-ui text-accent uppercase tracking-wider hover:underline"
            >
              {authorLabels[poem.author]}
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 leading-tight">
              {poem.title}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {format(new Date(poem.date), 'MMMM d, yyyy')}
              </span>
              {poem.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Poem Body */}
          <div className="bg-card border border-border rounded-xl p-8 md:p-12 mb-8">
            <p className="font-body text-lg text-card-foreground leading-loose whitespace-pre-line">
              {poem.content}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-ui border transition-colors ${poem.favorite ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-foreground hover:border-accent/30'}`}
            >
              <Heart className={`w-4 h-4 ${poem.favorite ? 'fill-current' : ''}`} />
              {poem.favorite ? 'Favorited' : 'Favorite'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-ui bg-card border border-border text-foreground hover:border-accent/30 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
