// ❌ PAIN POINT 3: Client-Server Waterfalls
// This file demonstrates how poor component architecture creates request waterfalls

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
} from "../lib/mui";
import Link from "next/link";
import Image from "next/image";

// Import our problematic client components
import { PostInteractionWrapper } from "./components/PostInteractionWrapper";
import { UserProfileLoader } from "./components/UserProfileLoader";
import { RecommendationEngine } from "./components/RecommendationEngine";

const getSrc = (id: number) => {
  const imagePostWidth = 250;
  const imagePostHeight = 375;
  return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
};

const getAuthorUserName = (str: string) => {
  return str.substring(str.lastIndexOf("@"));
};

// ✅ Server-side data fetching (this part is good)
async function getPosts() {
  console.log('🏗️ SERVER: Fetching posts data...');
  const posts = await fetch("https://picsum.photos/list");
  return posts.json();
}

// ❌ MISTAKE 1: Server component that triggers a waterfall of client-side requests
const Posts = async () => {
  // ✅ Server fetches initial data
  const posts = await getPosts();
  const first75Posts = posts.slice(0, 75);

  console.log('🏗️ SERVER: Posts component rendered, now client components will mount...');

  return (
    <Box sx={{ padding: 3 }}>
      <Typography paragraph align="right" sx={{ mb: 0 }}>
        Last Updated: {new Date().toLocaleTimeString()}
      </Typography>

      {/* ❌ MISTAKE 2: Waterfall Alert Box */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
        <Typography variant="h6">🌊 Client-Server Waterfall Alert!</Typography>
        <Typography variant="body2">
          Watch the browser console to see the waterfall effect:
          <br />
          1. 🏗️ SERVER: Page renders with posts data
          <br />
          2. 🔴 CLIENT: PostInteractionWrapper mounts → fetches user data
          <br />
          3. 🔴 CLIENT: UserProfileLoader waits for user → fetches profile  
          <br />
          4. 🔴 CLIENT: RecommendationEngine waits for profile → fetches recommendations
          <br />
          5. 🔴 CLIENT: Each post card independently fetches interaction data
        </Typography>
      </Box>

      {/* ❌ MISTAKE 3: Nested client components that create dependencies */}
      <PostInteractionWrapper>
        <UserProfileLoader>
          <RecommendationEngine>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {first75Posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Grid>
          </RecommendationEngine>
        </UserProfileLoader>
      </PostInteractionWrapper>
    </Box>
  );
};

// ❌ MISTAKE 4: Individual post cards that each make their own client requests
const PostCard = ({ post }: { post: any }) => {
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
                <Image
                  src={getSrc(post.id)}
                  alt={`Photo by ${post.author}`}
                  fill
                  placeholder="blur"
                  blurDataURL={`${getSrc(post.id)}?blur=10`}
                  style={{
                    objectFit: "cover",
                  }}
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
          
          {/* ❌ MISTAKE 5: Each card triggers its own client-side data request */}
          <PostCardInteractions postId={post.id} />
        </CardActions>
      </Card>
    </Grid>
  );
};

// ❌ Component that creates another waterfall dependency
const PostCardInteractions = ({ postId }: { postId: number }) => {
  return (
    <Box sx={{ display: 'inline-block' }}>
      {/* This will be a client component that fetches data for each post */}
      <PostLikeButton postId={postId} />
    </Box>
  );
};

// ❌ Another client component that adds to the waterfall
const PostLikeButton = ({ postId }: { postId: number }) => {
  // This would be imported from a client component file
  // For demo purposes, just showing the structure
  return (
    <Button size="small" color="secondary">
      ❤️ (Loading...)
    </Button>
  );
};

export default Posts;

/* 
🌊 PAIN POINT 3 SUMMARY: Client-Server Waterfalls

The Waterfall Problem:
1. 🏗️ SERVER: Initial page renders with posts data
2. 🔴 CLIENT: PostInteractionWrapper mounts → fetches current user
3. 🔴 CLIENT: UserProfileLoader waits for user → fetches user profile
4. 🔴 CLIENT: RecommendationEngine waits for profile → fetches recommendations  
5. 🔴 CLIENT: Each PostCard independently fetches interaction data
6. 🔴 CLIENT: Each PostLikeButton fetches like status

Result: 6 sequential request chains instead of parallel loading!

Common Mistakes:
1. ❌ Nested client components with data dependencies
2. ❌ Component composition that forces sequential loading
3. ❌ Poor Suspense boundary placement
4. ❌ Individual components each making their own requests
5. ❌ Not batching related data requests
6. ❌ Client components that depend on other client component data
7. ❌ Missing parallel data fetching opportunities

Why This Happens:
- Developers don't think about the loading sequence
- Component composition creates unintended dependencies  
- Poor understanding of when client components mount
- Not leveraging server-side data composition
- Treating each component as an independent unit
- Missing opportunities for data co-location

Performance Impact:
- Slow perceived loading time
- Users see content appearing in waves
- Poor Core Web Vitals scores
- Unnecessary loading states everywhere
- Mobile users suffer the most
*/