import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import useUser from "../store/userStore";

const Header = () => {
  const { user } = useUser();
  const location = useLocation();

  const capitalize = (name: string) => name?.charAt(0).toUpperCase() || "";

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/tasks", label: "Tasks" },
    { to: "/create", label: "Create" },
    { to: "/completed", label: "Completed" },
    { to: "/trash", label: "Trash" },
    { to: "/profile", label: "Profile" },
  ];

  const renderAvatar = () => {
    if (user?.avatar) {
      return <Avatar src={user.avatar} alt="User Avatar" />;
    }
    return (
      <Avatar sx={{ bgcolor: "primary.main" }}>
        {user && capitalize(user.firstName)}
        {user && capitalize(user.lastName)}
      </Avatar>
    );
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{ boxShadow: "none", padding: { xs: 1, md: 3 } }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Tasky
            </Typography>
          </Box>
        </Link>

        <Box display="flex" gap={2} alignItems="center">
          {!user ? (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button color="primary">Login</Button>
              </Link>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Button variant="outlined" color="primary">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} style={{ textDecoration: "none" }}>
                  <Button
                    variant={isActive(to) ? "contained" : "text"}
                    color="primary"
                  >
                    {label}
                  </Button>
                </Link>
              ))}
              {renderAvatar()}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
