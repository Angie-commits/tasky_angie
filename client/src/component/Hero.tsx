import { Box, Button, Container, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h2" fontWeight="bold">
            Welcome to Tasky
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Organize your tasks, stay productive, and never miss a deadline
            again. Tasky is your personal task management assistant simple,
            fast, and reliable.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              color="primary"
              size="large"
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              size="large"
            >
              Login
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
