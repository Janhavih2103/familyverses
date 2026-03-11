import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Feather, PenLine, Heart as HeartIcon, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authorLabels, authorDescriptions } from "@/lib/poems";

const authorIcons = {
  Janhavi: PenLine,
  Rashmi: HeartIcon,
  Ravindra: BookOpen,
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Feather className="w-10 h-10 text-accent mx-auto mb-6" />
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Our Family Poetry Collection
            </h1>
            <p className="font-body text-lg text-muted-foreground mt-6 max-w-xl mx-auto leading-relaxed">
              A shared space for words, memories, and emotions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Poet Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {(['Janhavi', 'Rashmi', 'Ravindra'] as const).map((author, i) => {
            const Icon = authorIcons[author];
            return (
              <motion.div
                key={author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              >
                <Link to={`/poems/${author}`} className="block group">
                  <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-xl hover:border-accent/30 transition-all duration-300 h-full">
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/10 transition-colors">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="font-display text-xl font-semibold text-card-foreground mb-2">
                      {authorLabels[author]}
                    </h2>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                      {authorDescriptions[author]}
                    </p>
                    <span className="inline-block font-ui text-sm text-accent font-medium group-hover:underline">
                      View Poems →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section className="pb-20 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl font-semibold text-foreground mb-4">
            About This Archive
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed">
            This is a personal poetry archive—a quiet corner of the internet where our family
            preserves the words that matter most. Each poem is a thread in the tapestry of our
            shared experience, woven across generations with love, memory, and the simple act of
            putting pen to paper.
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
