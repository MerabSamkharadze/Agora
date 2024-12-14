"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const supabase = await createClient();
      const { error } = await supabase.from("posts").insert([
        {
          title: title,
          body: body,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setSuccessMessage("Post added successfully!");
      setTitle("");
      setBody("");
    } catch (error: any) {
      setErrorMessage(
        error.message || "An error occurred while adding the post."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <div className="p-4 bg-green-100 text-green-800 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
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
          {loading ? "Adding Post..." : "Add Post"}
        </button>
      </form>
    </div>
  );
}
