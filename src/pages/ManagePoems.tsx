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

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

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
    setForm(emptyForm);
    setEditing(null);
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

          <div className="space-y-3">
            {poems.map((poem, i) => (
              <motion.div
                key={poem.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-lg p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {poem.title}
                  </h3>

                  <p className="text-xs text-muted-foreground">
                    {authorLabels[poem.author]} · {poem.date}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(poem)}
                    className="p-2 hover:bg-secondary rounded-lg"
                  >
                    <Pencil className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <button
                    onClick={() => handleDelete(poem.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg"
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