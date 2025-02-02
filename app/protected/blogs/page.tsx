"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";

type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/blogs");
        const data = await response.json();

        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(id);

    try {
      const response = await fetch(`/api/blogs/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Error deleting post");

      setPosts((prev) => prev.filter((post) => post.id !== id));
      setFilteredPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredPosts(posts);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/protected/blogs/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Post
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search posts..."
          className="border p-2 rounded w-full"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredPosts.length > 0 ? (
        <ul className="space-y-4">
          {filteredPosts.map((post) => (
            <li key={post.id} className="border p-4 rounded shadow relative">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.body}</p>
              <span className="text-sm text-gray-500 italic">
                {format(new Date(post.created_at), "PPPpp")}
              </span>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/protected/blogs/edit/${post.id}`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
                  disabled={deleting === post.id}
                >
                  {deleting === post.id ? "Deleting..." : "Delete"}
                </button>
                <Link
                  href={`/protected/blogs/${post.id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  See More
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
