import { useState, useEffect } from "react";
import { getPoems, addPoem, updatePoem, deletePoem, authorLabels, Poem } from "@/lib/poems";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface FormData {
  title: string;
  content: string;
  author: "Janhavi" | "Rashmi" | "Ravindra";
  tags: string;
}

const emptyForm: FormData = {
  title: "",
  content: "",
  author: "Janhavi",
  tags: "",
};

export default function ManagePoems() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm);

  const loadPoems = async () => {
    const data = await getPoems();
    setPoems(data || []);
  };

  useEffect(() => {
    loadPoems();
  }, []);

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
      tags: poem.tags.join(", "),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);

    if (editing) {
      await updatePoem(editing, {
        title: form.title,
        content: form.content,
        author: form.author,
        tags,
      });
      toast.success("Poem updated");
    } else {
      await addPoem({
        title: form.title,
        content: form.content,
        author: form.author,
        tags,
        date: new Date().toISOString().split("T")[0],
        favorite: false,
      });
      toast.success("Poem added");
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    loadPoems();
  };

  const handleDelete = async (id: string) => {
    await deletePoem(id);
    toast.success("Poem deleted");
    loadPoems();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-4xl font-bold text-foreground">
              Manage Poems
            </h1>

            <button
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-ui"
            >
              <Plus className="w-4 h-4" />
              Add Poem
            </button>
          </div>

          {/* Add/Edit Modal */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-card border border-border rounded-xl p-6 w-full max-w-lg"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-display text-2xl">
                      {editing ? "Edit Poem" : "Add Poem"}
                    </h2>

                    <button onClick={() => setShowForm(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">

                    <input
                      placeholder="Title"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full p-2 border rounded"
                    />

                    <select
                      value={form.author}
                      onChange={e =>
                        setForm({
                          ...form,
                          author: e.target.value as FormData["author"],
                        })
                      }
                      className="w-full p-2 border rounded"
                    >
                      <option value="Janhavi">Janhavi</option>
                      <option value="Rashmi">Rashmi</option>
                      <option value="Ravindra">Ravindra</option>
                    </select>

                    <input
                      placeholder="Tags (comma separated)"
                      value={form.tags}
                      onChange={e => setForm({ ...form, tags: e.target.value })}
                      className="w-full p-2 border rounded"
                    />

                    <textarea
                      placeholder="Poem content"
                      value={form.content}
                      onChange={e => setForm({ ...form, content: e.target.value })}
                      rows={6}
                      className="w-full p-2 border rounded"
                    />

                    <button
                      onClick={handleSave}
                      className="w-full bg-primary text-white py-2 rounded"
                    >
                      {editing ? "Update Poem" : "Add Poem"}
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
                className="bg-card border border-border rounded-lg p-5 flex justify-between"
              >
                <div>
                  <h3 className="font-display text-lg">{poem.title}</h3>

                  <p className="text-xs text-muted-foreground">
                    {authorLabels[poem.author]} · {poem.date}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(poem)}>
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button onClick={() => handleDelete(poem.id)}>
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