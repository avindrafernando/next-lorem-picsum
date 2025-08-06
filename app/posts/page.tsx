// ❌ PAIN POINT 4: Error Boundary Nightmares
// This file demonstrates poor error handling patterns with RSCs

import React from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Alert,
} from "../lib/mui";
import Link from "next/link";
import Image from "next/image";

// Import error-prone components
import { UnstableServerComponent } from "./components/UnstableServerComponent";
import { ProblematicClientComponent } from "./components/ProblematicClientComponent";
import { NestedErrorComponent } from "./components/NestedErrorComponent";

const getSrc = (id: number) => {
  const imagePostWidth = 250;
  const imagePostHeight = 375;
  return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
};

const getAuthorUserName = (str: string) => {
  return str.substring(str.lastIndexOf("@"));
};

// ❌ MISTAKE 1: Async function that can fail without proper error handling
async function getPosts() {
  console.log('🏗️ SERVER: Fetching posts...');
  
  // ❌ Simulate potential failures without error boundaries
  const random = Math.random();
  if (random < 0.3) {
    throw new Error('SERVER ERROR: Posts API is temporarily unavailable');
  }
  
  const posts = await fetch("https://picsum.photos/list");
  
  // ❌ No error handling for failed fetch
  if (!posts.ok) {
    throw new Error(`HTTP Error: ${posts.status}`);
  }
  
  return posts.json();
}

// ❌ MISTAKE 2: Another async function prone to failure
async function getPostStats() {
  console.log('🏗️ SERVER: Fetching post statistics...');
  
  // ❌ Another potential failure point
  const random = Math.random();
  if (random < 0.4) {
    throw new Error('STATS ERROR: Statistics service is down');
  }
  
  return {
    totalPosts: 300,
    totalAuthors: 50,
    totalViews: 1000000
  };
}

// ❌ MISTAKE 3: Server component with no error boundary protection
const Posts = async () => {
  // ❌ These can fail and crash the entire page
  const posts = await getPosts(); // Can throw error
  const stats = await getPostStats(); // Can throw error
  
  const first75Posts = posts.slice(0, 75);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Error Demo Instructions */}
      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="h6">💥 Error Boundary Nightmare Demo</Typography>
        <Typography variant="body2">
          This page has multiple error scenarios. Refresh the page several times to trigger different errors:
          <br />
          • 30% chance: Posts API failure (crashes entire page)
          <br />
          • 40% chance: Stats service failure (crashes entire page)
          <br />
          • Client components have their own error issues
          <br />
          • No error boundaries to contain failures
          <br />
          • Poor error messages that don't help users
        </Typography>
      </Alert>

      <Typography paragraph align="right" sx={{ mb: 0 }}>
        Last Updated: {new Date().toLocaleTimeString()}
      </Typography>

      {/* ❌ MISTAKE 4: Displaying server data without error context */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="h6">Post Statistics</Typography>
        <Typography>
          Total Posts: {stats.totalPosts} | Authors: {stats.totalAuthors} | Views: {stats.totalViews.toLocaleString()}
        </Typography>
      </Box>

      {/* ❌ MISTAKE 5: Nested components that can fail without isolation */}
      <UnstableServerComponent>
        <NestedErrorComponent>
          <ProblematicClientComponent>
            
            {/* ❌ MISTAKE 6: Main content without error boundaries */}
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {first75Posts.map((post: any, index: number) => (
                <PostCardWithErrors key={post.id} post={post} index={index} />
              ))}
            </Grid>

          </ProblematicClientComponent>
        </NestedErrorComponent>
      </UnstableServerComponent>

      {/* ❌ MISTAKE 7: Footer that depends on potentially failed data */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2">
          Showing {first75Posts.length} posts from {stats.totalAuthors} authors
        </Typography>
      </Box>
    </Box>
  );
};

// ❌ MISTAKE 8: Individual components with error-prone operations
const PostCardWithErrors = ({ post, index }: { post: any; index: number }) => {
  // ❌ Random errors in individual cards
  if (index % 7 === 0 && Math.random() < 0.2) {
    throw new Error(`Card Error: Failed to render post ${post.id}`);
  }

  return (
    <Grid>
      <Card sx={{ margin: 2.5 }}>
        <Link
          href={`/posts/${encodeURIComponent(post.id)}`}
          style={{
            color: "inherit",
            cursor: "inherit",
            textDecoration: "none",
          }}
        >
          <CardActionArea>
            <CardMedia
              sx={{ minHeight: 375, minWidth: 250 }}
              title={post.author}
            >
              <Box
                sx={{
                  position: "relative",
                  minHeight: 375,
                }}
              >
                {/* ❌ MISTAKE 9: Image loading without error handling */}
                <Image
                  src={getSrc(post.id)}
                  alt={`Photo by ${post.author}`}
                  fill
                  placeholder="blur"
                  blurDataURL={`${getSrc(post.id)}?blur=10`}
                  style={{
                    objectFit: "cover",
                  }}
                  // ❌ No onError handler
                />
              </Box>
            </CardMedia>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {post.author}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {getAuthorUserName(post.author_url)}
              </Typography>
              
              {/* ❌ MISTAKE 10: Operations that can fail on each card */}
              {index % 5 === 0 && (
                <Typography variant="caption" color="error">
                  {/* This could throw an error */}
                  Special: {(post.width / post.height).toFixed(2)} ratio
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Link>
        <CardActions>
          <Button size="small" color="primary">
            <Link
              href={post.author_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                cursor: "inherit",
                textDecoration: "none",
              }}
            >
              See My Work
            </Link>
          </Button>
          <Button size="small" color="primary">
            <Link
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                cursor: "inherit",
                textDecoration: "none",
              }}
            >
              Image Source
            </Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Posts;

/* 
💥 PAIN POINT 4 SUMMARY: Error Boundary Nightmares

Common Error Handling Problems:

1. ❌ Missing Error Boundaries
   - Server components can fail and crash the entire page
   - No isolation between components
   - Errors propagate up and break everything

2. ❌ Poor Async Error Handling
   - Server functions don't handle fetch failures
   - No try-catch blocks around critical operations
   - Unhandled promise rejections

3. ❌ Mixed Server-Client Error States
   - Server errors vs client errors handled differently
   - Inconsistent error UX
   - Debugging confusion about where errors originate

4. ❌ No Error Recovery
   - Errors kill the entire page
   - No fallback UI
   - Users see cryptic error messages

5. ❌ Poor Error Context
   - Error messages don't help users
   - Developers can't easily debug issues
   - No error tracking or reporting

6. ❌ Cascading Failures
   - One component failure breaks dependent components
   - No graceful degradation
   - Error boundaries not strategically placed

Why This Is Particularly Bad with RSCs:
- Server errors happen at build/request time
- Client-server error boundary interactions are complex
- Traditional React error boundaries don't catch all RSC errors
- Debugging is harder with server-client split
- Error states are harder to test and reproduce

Impact:
- Poor user experience with cryptic errors
- Difficult debugging and maintenance
- Production failures that break entire pages
- No graceful degradation when services fail
- Lost user data and broken user flows
*/