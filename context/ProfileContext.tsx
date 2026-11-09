"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { PROFILE_DATA, type ProfileData } from "@/data/profile";

interface ProfileContextType {
  data: ProfileData;
  isLoading: boolean;
  refresh: () => Promise<void>;
  updateDataLocally: (newData: ProfileData) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  data: PROFILE_DATA,
  isLoading: false,
  refresh: async () => {},
  updateDataLocally: () => {},
});

export function ProfileDataProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: ProfileData;
}) {
  const [data, setData] = useState<ProfileData>(initialData || PROFILE_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      if (res.ok) {
        const fresh = await res.json();
        setData(fresh);
      }
    } catch (err) {
      console.error("Failed to fetch fresh profile data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDataLocally = useCallback((newData: ProfileData) => {
    setData(newData);
  }, []);

  // Sync if initialData changes
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  return (
    <ProfileContext.Provider value={{ data, isLoading, refresh, updateDataLocally }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
