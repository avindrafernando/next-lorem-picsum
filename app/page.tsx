import { Box, Typography } from "./lib/mui";

export default function Home() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ py: 3 }}>
        Welcome to My Featured Posts
      </Typography>
      <Typography paragraph>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. A condimentum vitae
        sapien pellentesque habitant morbi. Nam libero justo laoreet sit amet
        cursus sit amet. In arcu cursus euismod quis viverra nibh cras pulvinar
        mattis. Morbi leo urna molestie at elementum eu facilisis sed. Auctor
        neque vitae tempus quam pellentesque nec nam.
      </Typography>
      <Typography paragraph>
        Integer vitae justo eget magna fermentum. Aenean et tortor at risus
        viverra adipiscing at in tellus. Auctor elit sed vulputate mi. Massa
        tincidunt nunc pulvinar sapien et. Est lorem ipsum dolor sit amet
        consectetur adipiscing elit. Cursus euismod quis viverra nibh. Ornare
        arcu dui vivamus arcu felis.
      </Typography>
      <Typography paragraph>
        Non tellus orci ac auctor augue. Enim nec dui nunc mattis. Dolor sit
        amet consectetur adipiscing elit. Euismod lacinia at quis risus sed
        vulputate odio ut. Adipiscing enim eu turpis egestas. Ac turpis egestas
        maecenas pharetra.
      </Typography>
      <Typography paragraph>
        Oh. You need a little dummy text for your mockup? How quaint.
      </Typography>
      <Typography paragraph>I bet you’re still using Bootstrap too…</Typography>
    </Box>
  );
}
