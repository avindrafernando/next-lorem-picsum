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
} from "../../lib/mui";
import Image from "next/image";

export async function generateStaticParams() {
  const posts = await fetch("https://picsum.photos/list").then((res) =>
    res.json()
  );

  const first75Posts = posts.slice(0, 75);

  return first75Posts.map((post: { id: number }) => ({
    pid: post?.id.toString(),
  }));
}

const getSrc = (id: string) => {
  const imagePostWidth = 250;
  const imagePostHeight = 375;
  return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
};

async function getPost(id: string) {
  // Static Data Fetching
  const post = await fetch(`https://picsum.photos/id/${id}/info`);

  // Static Data Fetching with Revalidation
  // const post = await fetch(`https://picsum.photos/id/${id}/info`, {
  //   next: { revalidate: 5 },
  // });

  // Dynamic Data Fetching
  // const post = await fetch(`https://picsum.photos/id/${id}/info`, {
  //   cache: "no-store",
  // });

  return post.json();
}

const blurDataURL = `data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNUUl1XDwAC3AF2ZgbhCQAAAABJRU5ErkJggg==`;

const Post = async ({ params: { pid } }: { params: { pid: string } }) => {
  const post = await getPost(pid);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography paragraph align="right">
        Last Updated: {new Date().toLocaleTimeString()}
      </Typography>
      <Card sx={{ margin: 2.5, width: 310, height: 515 }}>
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
                blurDataURL={blurDataURL}
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
              {post.author}
            </Typography>
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
        </CardActions>
      </Card>
    </Box>
  );
};

export default Post;
