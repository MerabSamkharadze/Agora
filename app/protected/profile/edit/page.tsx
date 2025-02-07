"use client";
import { usePremium } from "@/context/PremiumContext";
import { useState, useEffect, FormEvent } from "react";
import { redirect, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

const EditProfile = () => {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { isPremium } = usePremium();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const metadata = user.user_metadata || {};
        setName(metadata.name || "");
        setAvatarUrl(metadata.avatar_url || "");
        setPreviewUrl(metadata.avatar_url || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let uploadedAvatarUrl = avatarUrl;

    if (image) {
      const uniquePath = `avatars/${uuidv4()}_${image.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(uniquePath, image);

      if (uploadError) {
        setError("Failed to upload image");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(uploadData.path);

      if (publicUrlData.publicUrl) {
        uploadedAvatarUrl = publicUrlData.publicUrl;
      } else {
        setError("Failed to retrieve the public URL for the uploaded image.");
        setLoading(false);
        return;
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name,
        avatar_url: uploadedAvatarUrl,
      },
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      router.push("/protected/profile");
    }
  };

  // Remove Subscription Function

  const handleRemoveSubscription = async () => {
    setLoading(true);
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: updateError } = await supabase
      .from("users")
      .update({ is_premium: false })
      .eq("id", user?.id);

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    }
    redirect("/protected/profile");
  };

  if (loading) {
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
  }

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center heading">
        Edit Your Profile
      </h1>

      {error && <p className="mb-4 text-center text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 startup-form_label"
          >
            Avatar Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="startup-form_input"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label
            htmlFor="avatarUrl"
            className="block text-sm font-medium text-gray-700 startup-form_label"
          >
            Avatar Image
          </label>
          <Input
            id="image"
            name="image"
            className="startup-form_input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {previewUrl && (
          <div className="mt-4 text-center">
            <h4 className="font-medium text-gray-700 startup-form_label">
              Avatar Preview:
            </h4>
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full mx-auto"
            />
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="startup-form_btn text-white"
        >
          Update
        </Button>
      </form>

      {/* Remove Subscription Section */}
      {isPremium && (
        <div className="text-center mt-6">
          <p className="text- text-gray-500">
            You are currently a premium user.
          </p>
          <Button
            onClick={handleRemoveSubscription}
            className="startup-form_label !text-white mt-2"
          >
            Remove Subscription
          </Button>
        </div>
      )}

      <div className="text-center mt-4">
        <Link
          href={"/protected/reset-password"}
          className="startup-form_label hover:underline"
        >
          Reset Password
        </Link>
      </div>
    </div>
  );
};

export default EditProfile;
