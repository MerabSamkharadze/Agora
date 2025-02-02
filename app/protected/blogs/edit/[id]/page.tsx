"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      try {
        const response = await fetch(`/api/blogs/${id}`);
        const data = await response.json();

        if (data) {
          setTitle(data.title);
          setBody(data.body);
        }
      } catch (error) {
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
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
      const response = await fetch(`/api/editblog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      router.push("/protected/blogs");
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="pink_container !min-h-24">
        <h1 className="heading">Edit Your Blog. Make It Perfect!</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleUpdate} className="space-y-4 startup-form">
        <div>
          <label className="block text-sm font-medium startup-form_label">
            Title
          </label>
          <Input
            type="text"
            className="w-full border p-2 rounded startup-form_input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium startup-form_label">
            Body
          </label>
          <Textarea
            className="w-full border p-2 rounded startup-form_textarea"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
