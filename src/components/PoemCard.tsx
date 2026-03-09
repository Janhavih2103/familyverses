import { Poem, authorLabels, toggleFavorite } from "@/lib/poems";
import { Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface Props {
  poem: Poem;
  index?: number;
  onFavoriteToggle?: () => void;
}

export default function PoemCard({ poem, index = 0, onFavoriteToggle }: Props) {
  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(poem.id);
    onFavoriteToggle?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/poem/${poem.id}`} className="block group">
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-accent/30 transition-all duration-300">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display text-xl font-semibold text-card-foreground group-hover:text-accent transition-colors">
                {poem.title}
              </h3>
              <p className="text-xs font-ui text-muted-foreground mt-1">
                {authorLabels[poem.author]}
              </p>
            </div>
            <button
              onClick={handleFavorite}
              className="p-1.5 rounded-full hover:bg-secondary transition-colors"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${poem.favorite ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              />
            </button>
          </div>
          <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-line">
            {poem.content}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {format(new Date(poem.date), 'MMM d, yyyy')}
            </span>
            {poem.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
