import { CircularProgress, Container } from "../lib/mui";

export default function PostsLoading() {
  return (
    <>
      <Container sx={{ py: 3 }}>
        <CircularProgress />
      </Container>
    </>
  );
}
