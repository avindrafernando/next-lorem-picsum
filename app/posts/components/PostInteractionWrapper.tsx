// ❌ PAIN POINT 3: Client component that starts the waterfall
"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "../../lib/mui";

interface PostInteractionWrapperProps {
  children: React.ReactNode;
}

export const PostInteractionWrapper: React.FC<PostInteractionWrapperProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ❌ WATERFALL STEP 2: Client component mounts and fetches user data
    const fetchCurrentUser = async () => {
      console.log(
        "🔴 CLIENT STEP 2: PostInteractionWrapper fetching current user..."
      );

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock user data
      const userData = {
        id: "user-123",
        name: "Demo User",
        preferences: ["photography", "nature", "architecture"],
      };

      console.log(
        "🔴 CLIENT STEP 2: User data loaded, child components can now mount"
      );
      setCurrentUser(userData);
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Step 2: Loading current user... (this blocks everything below)
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, p: 1, bgcolor: "info.light", borderRadius: 1 }}>
        <Typography variant="body2">
          ✅ PostInteractionWrapper: User loaded - {currentUser?.name}
        </Typography>
      </Box>
      {/* ❌ Children only render AFTER user is loaded */}
      {children}
    </Box>
  );
};
