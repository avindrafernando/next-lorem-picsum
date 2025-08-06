// ❌ PAIN POINT 4: Nested component that demonstrates cascading failures
"use client";

import React, { useState } from "react";
import { Box, Typography, Alert, Button } from "../../lib/mui";

interface NestedErrorComponentProps {
  children: React.ReactNode;
}

export const NestedErrorComponent: React.FC<NestedErrorComponentProps> = ({
  children,
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ❌ MISTAKE 1: Component that can fail during initialization
  React.useEffect(() => {
    // ❌ Random initialization failure
    if (Math.random() < 0.1) {
      setHasError(true);
      setErrorMessage("NestedErrorComponent: Failed to initialize properly");
    }
  }, []);

  // ❌ MISTAKE 2: Operations that can cascade failures to children
  const processData = (data: any) => {
    try {
      // ❌ Operations that can fail and affect child components
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data structure provided");
      }

      // ❌ More potential failure points
      const processed = {
        ...data,
        processed: true,
        timestamp: new Date().toISOString(),
        hash: btoa(JSON.stringify(data)), // Can fail with circular references
      };

      return processed;
    } catch (error) {
      setHasError(true);
      setErrorMessage(
        `Data processing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      throw error; // ❌ Re-throwing without proper handling
    }
  };

  // ❌ MISTAKE 3: Event handlers that can cause errors
  const simulateError = () => {
    const errorTypes = [
      () => {
        throw new Error("Simulated network error");
      },
      () => {
        throw new Error("Simulated permission error");
      },
      () => {
        throw new Error("Simulated timeout error");
      },
      () => {
        // ❌ Accessing undefined properties
        const obj: any = undefined;
        return obj.property.nestedProperty;
      },
      () => {
        // ❌ Invalid JSON parsing
        JSON.parse("invalid json string");
      },
    ];

    const randomError =
      errorTypes[Math.floor(Math.random() * errorTypes.length)];
    try {
      randomError();
    } catch (error) {
      setHasError(true);
      setErrorMessage(
        `Simulated error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // ❌ MISTAKE 4: Recursive operations that can cause stack overflow
  const recursiveOperation = (depth: number = 0): any => {
    if (depth > 1000) {
      throw new Error("Maximum recursion depth exceeded");
    }

    // ❌ Random failure during recursion
    if (Math.random() < 0.001) {
      throw new Error(`Recursive operation failed at depth ${depth}`);
    }

    return recursiveOperation(depth + 1);
  };

  // ❌ MISTAKE 5: Component renders even in error state, potentially causing more errors
  if (hasError) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert severity="error">
          <Typography variant="h6">💥 Nested Component Error</Typography>
          <Typography variant="body2">{errorMessage}</Typography>
          <Button
            size="small"
            onClick={() => {
              setHasError(false);
              setErrorMessage("");
            }}
            sx={{ mt: 1 }}
          >
            Try to Recover (might fail again)
          </Button>
        </Alert>

        {/* ❌ MISTAKE 6: Still rendering children even in error state */}
        <Box sx={{ opacity: 0.5, pointerEvents: "none" }}>{children}</Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, p: 1, bgcolor: "orange.light", borderRadius: 1 }}>
        <Typography variant="body2">
          🟡 NestedErrorComponent: Active (10% init failure, various runtime
          errors possible)
        </Typography>

        {/* ❌ MISTAKE 7: UI that can trigger errors */}
        <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button size="small" variant="outlined" onClick={simulateError}>
            Simulate Random Error
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              try {
                recursiveOperation();
              } catch (error) {
                setHasError(true);
                setErrorMessage(
                  `Recursion failed: ${
                    error instanceof Error ? error.message : "Unknown error"
                  }`
                );
              }
            }}
          >
            Test Recursion
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              try {
                processData(null); // Will cause error
              } catch (error) {
                // Error already handled in processData
              }
            }}
          >
            Process Bad Data
          </Button>
        </Box>
      </Box>

      {/* ❌ MISTAKE 8: Children render without protection from parent errors */}
      {children}
    </Box>
  );
};
