"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { Post } from "@/app/protected/blogs/page";
import { User } from "@supabase/supabase-js";
import Form from "next/form";

type PostsClientProps = {
  posts: Post[];
  user: User | null;
};

export default function Blogs({ posts, user }: PostsClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(id);

    try {
      const response = await fetch(`/api/deleteblog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error deleting post");

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
      <div className="p-6 max-w-6xl mx-auto">
        <div className="pink_container">
          <h1 className="text-2xl font-bold heading">
            Words That Inspire, Thoughts That Transform.
          </h1>
          <Form className="search-form " action={""}>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search posts..."
                className="search-input mt-4 "
              />
            </div>
          </Form>
        </div>
        <Link
          href="/protected/blogs/new"
          className="startup-form_btn mt-2 text-white text-center block w-full bg-gradient-to-rpy-3 font-semibold text-lg shadow-md hover:opacity-90 transition"
        >
          Add New Blog
        </Link>
      </div>

      {filteredPosts.length > 0 ? (
        <ul className="space-y-6">
          {filteredPosts.map((post) => (
            <li
              key={post.id}
              className="border border-gray-200 bg-white p-6 rounded-xl shadow-lg transition hover:shadow-xl relative"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 mb-3">{post.body}</p>
              <span className="text-sm text-gray-500 italic block mb-4">
                {format(new Date(post.created_at), "PPPpp")}
              </span>

              {user?.id === post.user_id && (
                <div className="mt-4 flex gap-3">
                  <Link
                    href={`/protected/blogs/edit/${post.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition shadow-md"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
                    disabled={deleting === post.id}
                  >
                    {deleting === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}

              <Link
                href={`/protected/blogs/${post.id}`}
                className="block mt-4 text-center bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition shadow-md"
              >
                See More
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 text-lg">No posts found.</p>
      )}
    </div>
  );
}
