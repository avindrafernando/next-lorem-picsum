// ❌ PAIN POINT 1: State Management Confusion
// This file demonstrates common mistakes developers make with RSCs

import React, { useState, useEffect } from 'react'; // ❌ Importing useState in a server component
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
  TextField,
  Switch,
  FormControlLabel,
} from "../lib/mui";
import Link from "next/link";
import Image from "next/image";

const getSrc = (id: number) => {
  const imagePostWidth = 250;
  const imagePostHeight = 375;
  return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
};

const getAuthorUserName = (str: string) => {
  return str.substring(str.lastIndexOf("@"));
};

async function getPosts() {
  const posts = await fetch("https://picsum.photos/list");
  return posts.json();
}

// ❌ MISTAKE 1: Trying to use state hooks in a Server Component
// This component cannot use useState, useEffect, or other client-side hooks
const Posts = async () => {
  // ❌ This will cause an error - useState cannot be used in Server Components
  const [searchTerm, setSearchTerm] = useState(''); // Error: React Hook "useState" cannot be called in a Server Component
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // Error: Same issue
  const [favorites, setFavorites] = useState<number[]>([]); // Error: Same issue
  
  // ❌ This will also cause an error - useEffect cannot be used in Server Components  
  useEffect(() => {
    // Error: React Hook "useEffect" cannot be called in a Server Component
    console.log('Posts loaded');
  }, []);

  const posts = await getPosts();
  const first75Posts = posts.slice(0, 75);

  // ❌ MISTAKE 2: Trying to filter data based on client state in a server component
  // This won't work because searchTerm is client state but we're in a server component
  const filteredPosts = first75Posts.filter((post: any) => 
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!showOnlyFavorites || favorites.includes(post.id))
  );

  // ❌ MISTAKE 3: Event handlers in Server Components don't work
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Error: This won't work in a server component
  };

  const toggleFavorite = (postId: number) => {
    setFavorites(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    ); // Error: This won't work in a server component
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* ❌ MISTAKE 4: Interactive elements in Server Components */}
      {/* These components require client-side JavaScript but we're in a server component */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search posts..."
          value={searchTerm}
          onChange={handleSearch} // ❌ Event handler won't work
          variant="outlined"
          size="small"
          sx={{ minWidth: 300 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={showOnlyFavorites}
              onChange={(e) => setShowOnlyFavorites(e.target.checked)} // ❌ Won't work
            />
          }
          label="Show only favorites"
        />
      </Box>

      <Typography paragraph align="right" sx={{ mb: 0 }}>
        Last Updated: {new Date().toLocaleTimeString()}
        {/* ❌ MISTAKE 5: Trying to show client state in server component */}
        | Showing {filteredPosts.length} of {first75Posts.length} posts
        {showOnlyFavorites && ` (${favorites.length} favorites)`}
      </Typography>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {filteredPosts.map((post: any) => (
          <Grid key={post.id}>
            <Card sx={{ 
              margin: 2.5,
              // ❌ MISTAKE 6: Conditional styling based on client state
              border: favorites.includes(post.id) ? '2px solid gold' : 'none'
            }}>
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
                      {/* ❌ MISTAKE 7: Showing client state in server-rendered content */}
                      {favorites.includes(post.id) && ' ⭐'}
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
                {/* ❌ MISTAKE 8: Interactive buttons in Server Components */}
                <Button 
                  size="small" 
                  color="secondary"
                  onClick={() => toggleFavorite(post.id)} // ❌ onClick won't work
                >
                  {favorites.includes(post.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* ❌ MISTAKE 9: Complex client-side logic in Server Component */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6">
          Developer Confusion Examples:
        </Typography>
        <Typography variant="body2" component="div">
          • Search term: "{searchTerm}" (❌ This won't update)
          <br />
          • Show favorites only: {showOnlyFavorites ? 'Yes' : 'No'} (❌ This won't update)
          <br />
          • Total favorites: {favorites.length} (❌ This won't update)
          <br />
          • Filtered results: {filteredPosts.length} (❌ This won't update)
        </Typography>
      </Box>
    </Box>
  );
};

export default Posts;

/* 
🔥 PAIN POINT 1 SUMMARY: State Management Confusion

Common Mistakes Developers Make:
1. ❌ Using useState/useEffect in Server Components
2. ❌ Adding event handlers to Server Components  
3. ❌ Trying to filter/modify data based on client state in server components
4. ❌ Mixing server and client rendering without understanding the boundaries
5. ❌ Not knowing when to use "use client" directive
6. ❌ Attempting to show client state in server-rendered content
7. ❌ Interactive elements (forms, buttons with onClick) in Server Components
8. ❌ Conditional rendering/styling based on client state in server components

Why This Happens:
- Developers are used to traditional React where everything runs on the client
- The mental model shift from "everything is client-side" to "server vs client" is difficult
- Error messages can be confusing for newcomers
- The "use client" directive placement and scope is not intuitive

Solutions (for next branches):
- Proper component boundaries (server vs client)
- Strategic use of "use client" directive  
- Props passing patterns
- State lifting strategies
- Composition patterns that work well with RSCs
*/