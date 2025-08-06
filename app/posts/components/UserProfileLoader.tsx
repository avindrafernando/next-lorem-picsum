// ❌ PAIN POINT 3: Client component that continues the waterfall
"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "../../lib/mui";

interface UserProfileLoaderProps {
  children: React.ReactNode;
}

export const UserProfileLoader: React.FC<UserProfileLoaderProps> = ({
  children,
}) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ❌ WATERFALL STEP 3: This component only mounts AFTER the parent finished loading
    const fetchUserProfile = async () => {
      console.log(
        "🔴 CLIENT STEP 3: UserProfileLoader fetching detailed profile..."
      );

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Mock profile data
      const profileData = {
        bio: "Photography enthusiast",
        favoriteCategories: ["landscape", "portrait", "street"],
        followingCount: 42,
        viewHistory: [1, 5, 23, 67, 89],
      };

      console.log(
        "🔴 CLIENT STEP 3: Profile loaded, recommendations can now load"
      );
      setUserProfile(profileData);
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 150,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Step 3: Loading user profile... (this blocks recommendations)
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, p: 1, bgcolor: "success.light", borderRadius: 1 }}>
        <Typography variant="body2">
          ✅ UserProfileLoader: Profile loaded -{" "}
          {userProfile?.favoriteCategories?.join(", ")}
        </Typography>
      </Box>
      {/* ❌ Children only render AFTER profile is loaded */}
      {children}
    </Box>
  );
};
