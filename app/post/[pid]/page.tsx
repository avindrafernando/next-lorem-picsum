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
} from "@/lib/mui";

const getSrc = (id: string) => {
  const imagePostWidth = 250;
  const imagePostHeight = 375;
  return `https://picsum.photos/id/${id}/${imagePostWidth}/${imagePostHeight}`;
};

async function getData(id: string) {
  const postsData = await fetch(`https://picsum.photos/id/${id}/info`, {
    next: { revalidate: 10 },
  });
  return postsData.json();
}

const Post = async ({ params: { pid } }: { params: { pid: string } }) => {
  const post = await getData(pid);

  return (
    <Box sx={{ padding: 3 }}>
      <Card sx={{ margin: 2.5, width: 310, height: 515 }}>
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
