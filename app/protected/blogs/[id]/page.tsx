"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const { id } = useParams();

  useEffect(() => {
    const supabase = createClient();

    const fetchPost = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        setError("Post not found.");
      } else {
        setPost(data);
      }

      setLoading(false);
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (!error) {
      router.push("/protected/blogs");
    } else {
      alert("Error deleting post: " + error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{post?.title}</h1>
      <p className="text-gray-500 italic">
        {post?.created_at ? format(new Date(post.created_at), "PPPpp") : ""}
      </p>
      <p className="mt-4 text-lg">{post?.body}</p>

      <div className="mt-6 flex gap-4">
        <Link
          href={`/protected/blogs/edit/${post?.id}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
