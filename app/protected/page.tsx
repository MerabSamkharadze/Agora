import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import SearchForm from "@/components/SearchForm";
import StartupCard, { Startup } from "@/components/StartupCard";

export default async function ProtectedPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const query = (await searchParams).query;
  const params = { search: query || null };

  const posts = [
    {
      _createdAt: new Date(Date.now()).toISOString(),
      views: "123",
      author: { name: "merabi", _id: "1" },
      title: "erihaa",
      category: "food",
      _id: "1",
      image:
        "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
      description:
        "ulasdhbvsadhbvjkdsibvkasdvaa sdvinaksdfvn adsvnadsnva vafdnva fdlaa",
    },
    {
      _createdAt: new Date(Date.now()).toISOString(),
      views: "123",
      author: { name: "merabi", _id: "1" },
      title: "erihaa",
      category: "food",
      _id: "2",
      image: "https://fps.cdnpk.net/images/home/subhome-ai.webp?w=649&h=649",
      description:
        "ulasdhbvsadhbvjkdsibvkasdvaa sdvinaksdfvn adsvnadsnva vafdnva fdlaa",
    },
    {
      _createdAt: new Date(Date.now()).toISOString(),
      views: "123",
      author: { name: "merabi", _id: "1" },
      title: "erihaa",
      category: "food",
      _id: "3",
      image:
        "https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75",
      description:
        "ulasdhbvsadhbvjkdsibvkasdvaa sdvinaksdfvn adsvnadsnva vafdnva fdlaa",
    },
  ];
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch Your Startup, <br />
          Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual
          Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: Startup) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
