// ❌ PAIN POINT 4: Client component with various error scenarios
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '../../lib/mui';

interface ProblematicClientComponentProps {
  children: React.ReactNode;
}

export const ProblematicClientComponent: React.FC<ProblematicClientComponentProps> = ({ children }) => {
  const [data, setData] = useState<any>(null);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    // ❌ MISTAKE 1: Async operations without proper error handling
    const fetchClientData = async () => {
      try {
        // ❌ Random client-side failure
        if (Math.random() < 0.2) {
          throw new Error('ProblematicClientComponent: Random client-side fetch failure');
        }

        // ❌ MISTAKE 2: Simulating API call that can fail
        const response = await fetch('/nonexistent-api-endpoint');
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (error) {
        // ❌ MISTAKE 3: Poor error handling - just incrementing counter
        console.error('Client component error:', error);
        setErrorCount(prev => prev + 1);
        
        // ❌ MISTAKE 4: No user-friendly error state
        setData({ error: 'Failed to load client data' });
      }
    };

    fetchClientData();
  }, []);

  // ❌ MISTAKE 5: Component that can throw errors during render
  const triggerRenderError = () => {
    throw new Error('ProblematicClientComponent: Intentional render error triggered!');
  };

  // ❌ MISTAKE 6: State update that can cause errors
  const causeStateError = () => {
    setData(undefined);
    // This will cause errors when trying to access data.something
  };

  // ❌ MISTAKE 7: Dangerous operations without error boundaries
  const performDangerousOperation = () => {
    // Simulating operations that can fail
    const risks = [
      () => { throw new Error('Memory allocation failed'); },
      () => { throw new Error('Network timeout'); },
      () => { throw new Error('Permission denied'); },
      () => { 
        const obj: any = null;
        return obj.someProperty; // Will throw TypeError
      }
    ];
    
    const randomRisk = risks[Math.floor(Math.random() * risks.length)];
    randomRisk();
  };

  return (
    <Box>
      <Box sx={{ mb: 2, p: 1, bgcolor: 'error.light', color: 'white', borderRadius: 1 }}>
        <Typography variant="body2">
          🔴 ProblematicClientComponent: Loaded (20% fetch failure rate)
          <br />
          Error Count: {errorCount} | Data Status: {data ? 'Loaded' : 'Failed'}
        </Typography>
        
        {/* ❌ MISTAKE 8: Buttons that can cause various types of errors */}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={triggerRenderError}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Trigger Render Error
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={causeStateError}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Cause State Error  
          </Button>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={performDangerousOperation}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Dangerous Operation
          </Button>
        </Box>
      </Box>

      {/* ❌ MISTAKE 9: Rendering that can fail based on data state */}
      {data && (
        <Box sx={{ mb: 1, p: 1, bgcolor: 'grey.200', borderRadius: 1 }}>
          <Typography variant="caption">
            {/* This will fail if data is not what we expect */}
            Client Data: {data.someProperty?.nestedValue || 'N/A'}
          </Typography>
        </Box>
      )}

      {children}
    </Box>
  );
};