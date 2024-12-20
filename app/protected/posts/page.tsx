"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import AddPost from "@/components/AddPost";
import { format } from "date-fns";

type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
};

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("posts").select();
      if (error) {
        console.error("Error fetching posts:", error.message);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();

    const subscription = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const newPost = payload.new as Post;
          setPosts((prevPosts) => [...prevPosts, newPost]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  console.log(posts);

  return (
    <div className="p-4">
      <AddPost />
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 rounded shadow relative">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.body}</p>
              {/* თარიღის ჩვენება */}
              <span className="absolute bottom-2 right-2 text-sm text-gray-500 italic">
                {format(new Date(post.created_at), "PPPpp")}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
