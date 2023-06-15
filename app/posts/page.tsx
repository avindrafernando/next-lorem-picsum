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

const getSrc = (id: number) => {
  const imagePostWidth = 250;
  const imagePostHeight = 375;
  return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
};

const getAuthorUserName = (str: string) => {
  return str.substring(str.lastIndexOf("@"));
};

async function getPosts() {
  // Static Data Fetching
  const posts = await fetch("https://picsum.photos/list");

  // Static Data Fetching with Revalidation
  // const posts = await fetch("https://picsum.photos/list", {
  //   next: { revalidate: 5 },
  // });

  // Dynamic Data Fetching
  // const posts = await fetch("https://picsum.photos/list", {
  //   cache: "no-store",
  // });

  return posts.json();
}

const Posts = async () => {
  const posts = await getPosts();
  const first75Posts = posts.slice(0, 75);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography paragraph align="right" sx={{ mb: 0 }}>
        Last Updated: {new Date().toLocaleTimeString()}
      </Typography>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {first75Posts.map((post: any) => (
          <Grid item lg key={post.id}>
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
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Posts;
