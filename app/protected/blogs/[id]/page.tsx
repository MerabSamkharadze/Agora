/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user_id: string;
};

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ id: string } | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/blogs/${id}`);
        const data = await response.json();

        if (response.ok) {
          setPost(data);
        } else {
          setError(data.message || "Post not found.");
        }
      } catch (err) {
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (id) {
      fetchPost();
      fetchUser();
    }
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/deleteblog/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/protected/blogs");
      } else {
        const data = await response.json();
        alert(data.message || "Error deleting post.");
      }
    } catch (error) {
      alert("Error deleting post.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh]">
        <svg
          className="animate-spin h-12 w-12 text-primary mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  if (error)
    return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4 sm:p-6 max-w-3xl mx-auto bg-white border border-gray-100 shadow-lg shadow-primary rounded-xl">
      <div className="pink_container !min-h-[200px]">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 heading">
          {post?.title}
        </h1>
      </div>

      <p className="text-sm sm:text-base text-gray-500 italic mb-4 tag">
        {post?.created_at ? format(new Date(post.created_at), "PPPpp") : ""}
      </p>

      <div className="text-gray-700 mt-2 line-clamp-4 leading-relaxed break-words">
        {post?.body}
      </div>

      {user?.id === post?.user_id && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href={`/protected/blogs/edit/${post?.id}`}
            className="bg-yellow-500 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-yellow-600 transition shadow-md text-center"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-red-600 transition shadow-md text-center"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
