"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function AddPostPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTitleError("");
    setBodyError("");

    if (!title.trim()) {
      setTitleError("Title cannot be empty.");
      setLoading(false);
      return;
    }

    if (title.length < 5) {
      setTitleError("Title must be at least 5 characters.");
      setLoading(false);
      return;
    }

    if (!body.trim()) {
      setBodyError("Text cannot be empty.");
      setLoading(false);
      return;
    }

    if (body.length < 120) {
      setBodyError("Text must be more than 120 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/addblog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add post.");
      }

      router.push("/protected/blogs");
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="pink_container !min-h-[200px]">
        <h1 className="heading ">
          Share your opinion with the wider community
        </h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="startup-form_label">Title</label>
          <Input
            type="text"
            className="startup-form_input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {titleError && <p className="text-red-500">{titleError}</p>}
        </div>

        <div>
          <label className="startup-form_label">Body</label>
          <Textarea
            className="startup-form_textarea"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          {bodyError && <p className="text-red-500">{bodyError}</p>}
        </div>

        <Button type="submit" className="startup-form_btn" disabled={loading}>
          {loading ? "Adding Post..." : "Add Post"}
        </Button>
      </form>
    </div>
  );
}
