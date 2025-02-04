"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface PremiumContextType {
  isPremium: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserStatus = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData, error } = await supabase
          .from("users")
          .select("is_premium")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user data:", error);
          return;
        }

        setIsPremium(userData?.is_premium ?? false);
      }
    };

    fetchUserStatus();
  }, []);

  return (
    <PremiumContext.Provider value={{ isPremium }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};
