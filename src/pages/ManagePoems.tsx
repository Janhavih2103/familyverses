import { useState, useMemo } from "react";
import { getPoems, addPoem, updatePoem, deletePoem, authorLabels, Poem } from "@/lib/poems";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface FormData {
  title: string;
  content: string;
  author: 'Janhavi' | 'Rashmi' | 'Ravindra';
  tags: string;
}

const emptyForm: FormData = { title: '', content: '', author: '', tags: '' };

export default function ManagePoems() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const poems = useMemo(() => getPoems(), [refreshKey]);

  const refresh = () => setRefreshKey(k => k + 1);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (poem: Poem) => {
    setEditing(poem.id);
    setForm({
      title: poem.title,
      content: poem.content,
      author: poem.author,
      tags: poem.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (editing) {
      updatePoem(editing, { title: form.title, content: form.content, author: form.author, tags });
      toast.success("Poem updated");
    } else {
      addPoem({ title: form.title, content: form.content, author: form.author, tags, date: new Date().toISOString().split('T')[0], favorite: false });
      toast.success("Poem added");
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditing(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    deletePoem(id);
    toast.success("Poem deleted");
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground">Manage Poems</h1>
            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-ui hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Poem
            </button>
          </div>

          {/* Form Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-6"
                onClick={() => setShowForm(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-2xl font-semibold text-card-foreground">
                      {editing ? 'Edit Poem' : 'New Poem'}
                    </h2>
                    <button onClick={() => setShowForm(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-ui text-muted-foreground mb-1.5 block">Title</label>
                      <input
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-ui text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                        placeholder="Poem title..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-ui text-muted-foreground mb-1.5 block">Author</label>
                      <select
                        value={form.author}
                        onChange={e => setForm({ ...form, author: e.target.value as FormData['author'] })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-ui text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                      >
                        <option value="me">Me</option>
                        <option value="mom">Mom</option>
                        <option value="dad">Dad</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-ui text-muted-foreground mb-1.5 block">Tags (comma-separated)</label>
                      <input
                        value={form.tags}
                        onChange={e => setForm({ ...form, tags: e.target.value })}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-ui text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                        placeholder="love, nature, memory..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-ui text-muted-foreground mb-1.5 block">Poem</label>
                      <textarea
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        rows={10}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none leading-relaxed"
                        placeholder="Write your poem here..."
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-ui font-medium hover:opacity-90 transition-opacity"
                    >
                      {editing ? 'Update Poem' : 'Add Poem'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Poem List */}
          <div className="space-y-3">
            {poems.map((poem, i) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-card-foreground truncate">{poem.title}</h3>
                  <p className="text-xs font-ui text-muted-foreground mt-0.5">
                    {authorLabels[poem.author]} · {poem.date}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(poem)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(poem.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
