import { createClient } from "@/utils/supabase/server";
import AddPost from "@/components/AddPost";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default async function Page() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase.from("posts").select();

  if (error) {
    console.error("Error fetching posts:", error.message);
    return <div>Could not load posts. Please try again later.</div>;
  }

  return (
    <div className="p-4">
      <AddPost />
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      {posts && posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post: Post) => (
            <li key={post.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-700">{post.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
