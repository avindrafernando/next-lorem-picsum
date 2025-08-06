// ❌ PAIN POINT 4: Unstable server component that can randomly fail
import React from 'react';
import { Box, Typography } from '../../lib/mui';

interface UnstableServerComponentProps {
  children: React.ReactNode;
}

// ❌ Server component that randomly fails
export const UnstableServerComponent: React.FC<UnstableServerComponentProps> = async ({ children }) => {
  // ❌ MISTAKE 1: Random server-side failure without error boundary
  const random = Math.random();
  if (random < 0.15) {
    throw new Error('UnstableServerComponent: Random server failure occurred! This will crash the page.');
  }

  // ❌ MISTAKE 2: Async operation that can fail
  try {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async work
  } catch (error) {
    // ❌ Poor error handling - just rethrowing
    throw new Error('UnstableServerComponent: Async operation failed');
  }

  // ❌ MISTAKE 3: Data processing that can fail
  const serverData = {
    timestamp: new Date().toISOString(),
    serverLoad: Math.random(),
    memoryUsage: Math.random() * 100
  };

  // ❌ Potential division by zero or other math errors
  if (serverData.serverLoad === 0) {
    throw new Error('UnstableServerComponent: Invalid server load detected');
  }

  const efficiency = (serverData.memoryUsage / serverData.serverLoad).toFixed(2);

  return (
    <Box>
      <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
        <Typography variant="body2">
          ⚠️ UnstableServerComponent: Running (15% failure rate)
          <br />
          Server Load: {serverData.serverLoad.toFixed(3)} | Efficiency: {efficiency}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};