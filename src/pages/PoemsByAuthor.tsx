import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { Search, Heart } from "lucide-react";
import { getPoems, authorLabels, Poem } from "@/lib/poems";
import PoemCard from "@/components/PoemCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function PoemsByAuthor() {
  const { author } = useParams<{ author: string }>();

  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [poems, setPoems] = useState<Poem[]>([]);

  // Load poems from Supabase
  useEffect(() => {
    async function loadPoems() {
      const data = await getPoems();
      const filtered = data.filter((p) => p.author === author);
      setPoems(filtered);
    }

    loadPoems();
  }, [author, refreshKey]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    poems.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [poems]);

  const filtered = useMemo(() => {
    return poems.filter((p) => {
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.content.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      if (tagFilter && !p.tags.includes(tagFilter)) return false;
      if (showFavorites && !p.favorite) return false;

      return true;
    });
  }, [poems, search, tagFilter, showFavorites]);

  const label = authorLabels[author || ""] || "Poems";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              {label}
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              {filtered.length} poem{filtered.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search poems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm font-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {allTags.length > 0 && (
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm font-ui text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="">All tags</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-3 py-2.5 border rounded-lg text-sm font-ui flex items-center gap-1.5 transition-colors ${
                showFavorites
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-card border-border text-foreground hover:border-accent/30"
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
              Favorites
            </button>
          </div>

          {/* Poems */}
          <div className="space-y-4">
            {filtered.map((poem, i) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                index={i}
                onFavoriteToggle={() => setRefreshKey((k) => k + 1)}
              />
            ))}

            {filtered.length === 0 && (
              <p className="text-center font-body text-muted-foreground py-12">
                No poems found.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}