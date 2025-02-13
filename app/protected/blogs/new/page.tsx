/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/context/PremiumContext";
import Link from "next/link";
import LockSvg from "@/public/svgs/LockSvg";

export default function AddPostPage() {
  const { isPremium } = usePremium();
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
          {isPremium
            ? "Share your opinion with the wider community"
            : "Unlock Premium Access to Upload Blog"}
        </h1>
        {!isPremium && (
          <p className="sub-heading">
            Upgrade to a premium membership to gain access to blog uploads and
            exclusive features.
          </p>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!isPremium && (
        <div className="mt-6 flex justify-center">
          <Button className="startup-form_btn ">
            <Link
              href="/protected/pricing"
              className="w-full h-full flex justify-center  items-center gap-3 "
            >
              <LockSvg />
              Upgrade to Premium
            </Link>
          </Button>
        </div>
      )}
      {isPremium && (
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
      )}
    </div>
  );
}
