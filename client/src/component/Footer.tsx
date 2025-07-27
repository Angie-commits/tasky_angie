import { Box, Grid, Typography, Link, Container, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "grey.100", mt: 8, pt: 6, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid
          container
          sx={{
            display: "flex",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tasky
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay organized and boost your productivity with Tasky — your
              all-in-one task manager.
            </Typography>
          </Grid>

          <Grid>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Navigation
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Link href="/tasks" underline="hover" color="text.primary">
                Tasks
              </Link>
              <Link href="/create" underline="hover" color="text.primary">
                Create Task
              </Link>
              <Link href="/completed" underline="hover" color="text.primary">
                Completed
              </Link>
              <Link href="/trash" underline="hover" color="text.primary">
                Trash
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" color="#f24a50" align="center">
          © {new Date().getFullYear()} Tasky. Made with love by Angie
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
