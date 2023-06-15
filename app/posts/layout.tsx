import { Alert, Box } from "../lib/mui";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Box sx={{ paddingTop: 2 }}>
        <Alert severity="info">Check out our new posts.</Alert>
      </Box>
      <Box>{children}</Box>
    </>
  );
}
