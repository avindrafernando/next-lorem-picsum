// ❌ PAIN POINT 2: The Fetch Fiasco - Unnecessary Network Calls
// This file demonstrates poor data fetching patterns with RSCs

"use client"; // ❌ MISTAKE 1: Making everything client-side unnecessarily

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Link,
  Typography,
  CircularProgress,
  Divider,
  Chip,
} from "../../lib/mui";
import Image from "next/image";
import { useState, useEffect } from "react";

// ❌ MISTAKE 2: Moving server-side data generation to client-side
// This should be done with generateStaticParams on the server
const PostPageClient = ({ params }: { params: { pid: string } }) => {
  const [post, setPost] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [authorPosts, setAuthorPosts] = useState<any[]>([]);
  const [authorInfo, setAuthorInfo] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [postStats, setPostStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authorLoading, setAuthorLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const getSrc = (id: string) => {
    const imagePostWidth = 250;
    const imagePostHeight = 375;
    return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
  };

  // ❌ MISTAKE 3: Unnecessary API call waterfall in useEffect
  // All of this data could be fetched on the server in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ❌ First API call - get single post info
        console.log('🌐 API Call 1: Fetching post info...');
        const postResponse = await fetch(`https://picsum.photos/id/${params.pid}/info`);
        const postData = await postResponse.json();
        setPost(postData);
        setLoading(false);

        // ❌ MISTAKE 4: Sequential API calls instead of parallel
        // These should be done in parallel, not one after another
        
        // Second API call - get all posts (unnecessary over-fetching)
        console.log('🌐 API Call 2: Fetching ALL posts (over-fetching)...');
        const allPostsResponse = await fetch('https://picsum.photos/list');
        const allPostsData = await allPostsResponse.json();
        setAllPosts(allPostsData);

        // ❌ Third API call - filter author posts (could be done on server)
        console.log('🌐 API Call 3: Re-fetching to find author posts...');
        const authorPostsData = allPostsData.filter((p: any) => p.author === postData.author);
        setAuthorPosts(authorPostsData);
        setAuthorLoading(false);

        // ❌ Fourth API call - get "related" posts (unnecessary logic on client)
        console.log('🌐 API Call 4: Processing related posts on client...');
        setTimeout(() => {
          const related = allPostsData
            .filter((p: any) => p.id !== postData.id && p.author !== postData.author)
            .slice(0, 3);
          setRelatedPosts(related);
          setRelatedLoading(false);
        }, 1000); // Artificial delay to show loading

        // ❌ Fifth API call - get post "statistics" (fake API call)
        console.log('🌐 API Call 5: Fetching post statistics...');
        setTimeout(() => {
          setPostStats({
            views: Math.floor(Math.random() * 10000),
            likes: Math.floor(Math.random() * 1000),
            downloads: Math.floor(Math.random() * 500),
          });
          setStatsLoading(false);
        }, 1500); // Another artificial delay

      } catch (error) {
        console.error('❌ Error in client-side data fetching:', error);
        setLoading(false);
        setAuthorLoading(false);
        setRelatedLoading(false);
        setStatsLoading(false);
      }
    };

    fetchData();
  }, [params.pid]); // ❌ Re-runs on every pid change, even if data hasn't changed

  // ❌ MISTAKE 5: More unnecessary API calls on user interaction
  const handleRefresh = async () => {
    console.log('🌐 API Call 6: Unnecessary refresh call...');
    setLoading(true);
    // Refetch data that hasn't changed
    const response = await fetch(`https://picsum.photos/id/${params.pid}/info`);
    const data = await response.json();
    setPost(data);
    setLoading(false);
  };

  // ❌ MISTAKE 6: Another unnecessary API call for "checking" data
  const handleCheckAuthor = async () => {
    if (!post) return;
    
    console.log('🌐 API Call 7: Redundant author verification...');
    // This data is already available!
    const response = await fetch('https://picsum.photos/list');
    const allPosts = await response.json();
    const authorPosts = allPosts.filter((p: any) => p.author === post.author);
    
    alert(`Found ${authorPosts.length} posts by ${post.author} (data we already had!)`);
  };

  if (loading) {
    return (
      <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Making unnecessary API calls... Check console to see the fiasco!
        </Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ padding: 3 }}>
        <Typography>Post not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* ❌ MISTAKE 7: Real-time data that doesn't need to be real-time */}
      <Typography paragraph align="right">
        Last Updated: {new Date().toLocaleTimeString()} 
        (❌ This updates every second for no reason)
      </Typography>

      {/* Debug Information */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
        <Typography variant="h6">🔥 Fetch Fiasco Debug Info:</Typography>
        <Typography variant="body2">
          • Made 5+ API calls for a single post page
          <br />
          • Fetched ALL posts when we only needed one
          <br />
          • Did server-side work on the client
          <br />
          • Created unnecessary loading states
          <br />
          • Check browser console to see all the API calls!
        </Typography>
      </Box>

      <Card sx={{ margin: 2.5, width: 310, height: 'auto' }}>
        <CardActionArea>
          <CardMedia sx={{ minHeight: 375, minWidth: 250 }} title={post.author}>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                minHeight: 375,
              }}
            >
              <Image
                src={getSrc(post.id)}
                alt={`Photo by ${post.author}`}
                fill
                placeholder="blur"
                blurDataURL="data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUUl1XDwAC3AF2ZgbhCQAAAABJRU5ErkJggg=="
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
            <Typography variant="body2" color="textSecondary" component="p">
              Post ID: {post.id}
            </Typography>
            
            {/* ❌ MISTAKE 8: Showing loading states for data that could be pre-rendered */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Post Statistics:</Typography>
            {statsLoading ? (
              <CircularProgress size={20} />
            ) : (
              <Box>
                <Chip label={`Views: ${postStats?.views}`} sx={{ m: 0.5 }} />
                <Chip label={`Likes: ${postStats?.likes}`} sx={{ m: 0.5 }} />
                <Chip label={`Downloads: ${postStats?.downloads}`} sx={{ m: 0.5 }} />
              </Box>
            )}
          </CardContent>
        </CardActionArea>
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
          {/* ❌ MISTAKE 9: Buttons that trigger unnecessary API calls */}
          <Button size="small" color="secondary" onClick={handleRefresh}>
            Refresh (❌ Unnecessary)
          </Button>
          <Button size="small" color="warning" onClick={handleCheckAuthor}>
            Check Author (❌ Redundant)
          </Button>
        </CardActions>
      </Card>

      {/* ❌ MISTAKE 10: Separate sections with their own loading states and API calls */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Other Posts by {post.author}:</Typography>
        {authorLoading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {authorPosts.slice(0, 5).map((p: any) => (
              <Chip 
                key={p.id} 
                label={`Post ${p.id}`} 
                onClick={() => window.location.href = `/posts/${p.id}`}
                clickable
              />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Related Posts:</Typography>
        {relatedLoading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            {relatedPosts.map((p: any) => (
              <Chip 
                key={p.id} 
                label={`${p.author} - ${p.id}`} 
                onClick={() => window.location.href = `/posts/${p.id}`}
                clickable
              />
            ))}
          </Box>
        )}
      </Box>

      {/* Performance Impact Indicator */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
        <Typography variant="body2">
          ⚠️ Performance Impact: This page made {5 + (post ? 2 : 0)} API calls
          <br />
          📊 Data fetched: {allPosts.length} posts (needed: 1)
          <br />
          ⏱️ Loading time: Artificial delays + network latency
          <br />
          🔄 Re-renders: Multiple state updates trigger re-renders
        </Typography>
      </Box>
    </Box>
  );
};

// ❌ MISTAKE 11: No static generation, everything is dynamic
// We lost all the benefits of generateStaticParams and server-side rendering
const Post = async (props: { params: Promise<{ pid: string }> }) => {
  const params = await props.params;
  return <PostPageClient params={params} />;
};

export default Post;

/* 
🔥 PAIN POINT 2 SUMMARY: The Fetch Fiasco - Unnecessary Network Calls

Common Mistakes Developers Make:
1. ❌ Moving server-side data fetching to client-side with useEffect
2. ❌ Making multiple sequential API calls instead of parallel/server-side
3. ❌ Over-fetching data (getting all posts when only one is needed)
4. ❌ Duplicate API calls for the same data
5. ❌ Creating unnecessary loading states for static data
6. ❌ Not utilizing server-side data fetching capabilities
7. ❌ Adding "use client" directive unnecessarily
8. ❌ Client-side filtering/processing that could be done on server
9. ❌ Refreshing data that doesn't change
10. ❌ Multiple components each making their own API calls for related data

Performance Impact:
- 5+ API calls instead of 1
- Unnecessary loading states and spinners
- Client-side processing overhead
- Poor user experience with loading delays
- Lost benefits of static generation
- Increased bundle size from client-side fetch logic

Why This Happens:
- Old habits from traditional React (useEffect for data fetching)
- Not understanding RSC server-side capabilities
- Fear of server-side complexity
- Over-engineering simple data requirements
- Not leveraging Next.js built-in features properly
*/