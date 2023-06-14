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
} from "../../lib/mui";
import Link from "next/link";

const getSrc = (id: number) => {
  const imagePostWidth = 250;
  const imagePostHeight = 375;
  return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
};

const getAuthorUserName = (str: string) => {
  return str.substring(str.lastIndexOf("@"));
};

async function getData() {
  const postsData = await fetch("https://picsum.photos/list", {
    next: { revalidate: 10 },
  });
  return postsData.json();
}

const Posts = async () => {
  const postsData = await getData();
  const posts = postsData.slice(0, 75);

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ padding: 3 }}
    >
      {posts.map((post: any) => (
        <Grid item lg key={post.id}>
          <Card sx={{ margin: 2.5 }}>
            <Link
              href={`/post/${encodeURIComponent(post.id)}`}
              style={{
                color: "inherit",
                cursor: "inherit",
                textDecoration: "none",
              }}
            >
              <CardActionArea>
                <CardMedia
                  sx={{ minHeight: 375, minWidth: 250 }}
                  image={getSrc(post.id)}
                  title={post.author}
                />
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
  );
};

export default Posts;
