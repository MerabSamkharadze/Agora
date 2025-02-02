// app/posts/page.tsx
import Blogs from "@/components/Blogs";

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  user_id: string;
};

export type User = {
  id: string;
};

async function fetchPosts(): Promise<Post[]> {
  // დამატებით შეგიძლიათ ჩააგდოთ `cache: "no-cache"` თუ გსურთ ყოველთვის უახლესი მონაცემები
  const res = await fetch("http://localhost:3000/api/blogs", {
    cache: "no-cache",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

async function fetchUser(): Promise<User | null> {
  const res = await fetch("http://localhost:3000/api/auth/me", {
    cache: "no-cache",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostsPage() {
  const posts = await fetchPosts();
  const user = await fetchUser();

  // გადადით კლასიკური კლიენტური კომპონენტს, სადაც ხორციელდება ძიება, წაშლა და ა.შ.
  return <Blogs posts={posts} user={user} />;
}
