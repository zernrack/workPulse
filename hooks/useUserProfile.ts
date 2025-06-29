"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string | null;
  createdAt: Date;
  isActive: boolean;
}

export function useUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user profile');
      }
      
      const userData = await response.json();
      setUser({
        ...userData,
        createdAt: new Date(userData.createdAt)
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Load user profile error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { user, isLoading, error, refetch: fetchUserProfile };
}
