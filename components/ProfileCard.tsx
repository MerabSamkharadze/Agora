"use client";
import React from "react";
import Ping from "./Ping";
import Image from "next/image";
import { usePremium } from "@/context/PremiumContext";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";

interface User {
  user_metadata: {
    name?: string;
    avatar_url?: string;
    email_verified?: boolean;
    premium?: boolean;
  };
  email?: string;
  created_at: string;
  last_sign_in_at?: string;
}

export default function ProfileCard({ user }: { user: User }) {
  const { isPremium } = usePremium();
  return (
    <div className="profile_card relative">
      <div className="profile_title">
        <h3 className="text-24-black uppercase text-center line-clamp-1">
          {user.user_metadata.name || user.email}
        </h3>
      </div>

      <Image
        src={
          user.user_metadata.avatar_url ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/800px-User_icon_2.svg.png"
        }
        alt={user.email || "User email not available"}
        width={220}
        height={220}
        className="profile_image"
      />

      <div className="absolute ml-32">
        <Ping />
      </div>

      <p className="text-23-extrabold mt-7 text-center">
        {user.email || "Unknown"}
      </p>

      <p className="mt-1 text-center text-14-normal">
        {user.user_metadata.email_verified ? "Verified ✅" : "Not verified ✖️"}
      </p>

      <p className="mt-2 text-center text-14-normal">
        Joined: {format(new Date(user.created_at), "yyyy-MM-dd HH:mm:ss")}
      </p>
      <p className="mt-2 text-center text-14-normal">
        Last sign-in:{" "}
        {user.last_sign_in_at
          ? format(new Date(user.last_sign_in_at), "yyyy-MM-dd HH:mm:ss")
          : "N/A"}
      </p>

      {isPremium && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg border-2 border-yellow-700">
          <span className="drop-shadow-md">⭐ PREMIUM</span>
        </div>
      )}
    </div>
  );
}
export const ProfileCardSkeleton = () => (
  <>
    {[0].map((index: number) => (
      <li key={index}>
        <Skeleton className="w-full h-48 bg-gray-300 rounded-md" />
      </li>
    ))}
  </>
);
