import { Box, Typography } from "../lib/mui";

export default function Home() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ py: 3 }}>
        Welcome to My Featured Posts
      </Typography>
      <Typography paragraph={true}>
        Leverage agile frameworks to provide a robust synopsis for high level
        overviews. Iterative approaches to corporate strategy foster
        collaborative thinking to further the overall value proposition.
        Organically grow the holistic world view of disruptive innovation via
        workplace diversity and empowerment.
      </Typography>
      <Typography paragraph={true}>
        Bring to the table win-win survival strategies to ensure proactive
        domination. At the end of the day, going forward, a new normal that has
        evolved from generation X is on the runway heading towards a streamlined
        cloud solution. User generated content in real-time will have multiple
        touchpoints for offshoring.
      </Typography>
      <Typography paragraph={true}>
        Capitalize on low hanging fruit to identify a ballpark value added
        activity to beta test. Override the digital divide with additional
        clickthroughs from DevOps. Nanotechnology immersion along the
        information highway will close the loop on focusing solely on the bottom
        line.
      </Typography>
      <Typography paragraph={true}>
        Oh. You need a little dummy text for your mockup? How quaint.
      </Typography>
      <Typography paragraph={true}>
        I bet you’re still using Bootstrap too…
      </Typography>
    </Box>
  );
}
