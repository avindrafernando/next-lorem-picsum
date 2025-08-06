// ❌ PAIN POINT 3: Client component that completes the waterfall
"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Chip } from "../../lib/mui";

interface RecommendationEngineProps {
  children: React.ReactNode;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  children,
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ❌ WATERFALL STEP 4: This component only mounts AFTER profile is loaded
    const fetchRecommendations = async () => {
      console.log(
        "🔴 CLIENT STEP 4: RecommendationEngine fetching personalized recommendations..."
      );

      // Simulate complex recommendation algorithm delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock recommendations
      const recommendationsData = [
        { category: "Landscape", confidence: 0.9 },
        { category: "Architecture", confidence: 0.7 },
        { category: "Nature", confidence: 0.8 },
      ];

      console.log(
        "🔴 CLIENT STEP 4: Recommendations loaded, posts can finally render"
      );
      setRecommendations(recommendationsData);
      setLoading(false);
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 100,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Step 4: Computing recommendations... (this blocks the actual posts!)
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, p: 1, bgcolor: "warning.light", borderRadius: 1 }}>
        <Typography variant="body2">
          ✅ RecommendationEngine: Recommendations ready
        </Typography>
        <Box sx={{ mt: 1 }}>
          {recommendations.map((rec, index) => (
            <Chip
              key={index}
              label={`${rec.category} (${Math.round(rec.confidence * 100)}%)`}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      </Box>

      {/* ❌ FINALLY: The actual posts render, but only after ALL the waterfall completes */}
      <Box
        sx={{
          mb: 2,
          p: 2,
          bgcolor: "error.light",
          color: "white",
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">🚨 Waterfall Complete!</Typography>
        <Typography variant="body2">
          The posts below FINALLY render after 4 sequential steps:
          <br />
          1. ✅ Server rendered posts data (~0ms)
          <br />
          2. ✅ Client loaded user (~800ms)
          <br />
          3. ✅ Client loaded profile (~600ms)
          <br />
          4. ✅ Client loaded recommendations (~1000ms)
          <br />
          <strong>Total delay: ~2400ms before users see ANY content!</strong>
          <br />
          <br />
          💡{" "}
          <em>
            But wait, there's more! Each post card will now make its own
            requests...
          </em>
        </Typography>
      </Box>

      {children}

      {/* ❌ MISTAKE 5: Even after the main waterfall, individual components continue the pattern */}
      <Box sx={{ mt: 2, p: 1, bgcolor: "grey.300", borderRadius: 1 }}>
        <Typography variant="body2">
          🔴 And now each post card will independently fetch its interaction
          data...
        </Typography>
      </Box>
    </Box>
  );
};
