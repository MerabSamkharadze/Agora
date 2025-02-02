"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function EditPostPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        setError("Failed to fetch post.");
      } else {
        setTitle(data.title);
        setBody(data.body);
      }
      setLoading(false);
    };

    if (id) fetchPost();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and body cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("posts")
        .update({ title, body })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      router.push("/protected/blogs");
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Body</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
