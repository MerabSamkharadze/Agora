"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
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
        uploadedAvatarUrl = publicUrlData.publicUrl; // Set the new avatar URL
      } else {
        setError("Failed to retrieve the public URL for the uploaded image.");
        setLoading(false);
        return;
      }
    }

    // Update the user's profile with the new name and avatar URL
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name,
        avatar_url: uploadedAvatarUrl, // Use the updated avatar URL
      },
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      router.push("/protected/profile"); // Redirect to profile page after successful update
    }
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
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center heading">
        Edit Profile
      </h1>

      {error && <p className="mb-4 text-center text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 startup-form_label"
          >
            Name
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
            Avatar
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
            <h4 className="font-medium text-gray-700">Avatar Preview:</h4>
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
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Save
        </Button>
      </form>

      <div className="text-center mt-4">
        <Link
          href={"/protected/reset-password"}
          className="text-indigo-600 hover:underline"
        >
          Reset Password
        </Link>
      </div>
    </div>
  );
};

export default EditProfile;
