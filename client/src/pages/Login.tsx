import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useUser from "../store/userStore";
import { BASE_URL } from "../constant";

type UserProps = {
  email: string;
  password: string;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dbError, setDbError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useUser();

  async function loginUser(user: UserProps) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }

  const { isPending, mutate } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser(data);
      navigate("/tasks");
      toast.success("Successfully logged in");
    },
    onError: (error: Error) => {
      setDbError(error.message);
      toast.error("Login failed");
    },
  });

  function handleLoginUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDbError("");
    mutate({ email, password });
  }

  return (
    <Box display="flex" justifyContent="center" px={2} py={5}>
      <Paper elevation={3} sx={{ maxWidth: 450, width: "100%", p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Login to your account
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Enter your email below to login
        </Typography>

        <Box my={2}>
          <Button component={Link} to="/signup" variant="outlined" fullWidth>
            Don&apos;t have an account? Sign Up
          </Button>
        </Box>

        {dbError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {dbError}
          </Alert>
        )}

        <form id="loginForm" onSubmit={handleLoginUser}>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Email"
              type="email"
              required
              value={email}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />

            <Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="body1">Password</Typography>
                <MuiLink component="button" variant="body2" underline="hover">
                  Forgot your password?
                </MuiLink>
              </Box>
              <TextField
                label="Password"
                type="password"
                required
                value={password}
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isPending}
              startIcon={
                isPending && <CircularProgress size={20} color="inherit" />
              }
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
