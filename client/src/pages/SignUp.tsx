import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Grid,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BASE_URL } from "../constant";

type UserProps = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dbError, setDbError] = useState("");

  const navigate = useNavigate();

  async function createUser(user: UserProps) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
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

  const { mutate, isPending } = useMutation({
    mutationKey: ["post-user"],
    mutationFn: createUser,
    onError: (error: Error) => {
      setDbError(error.message);
      toast.error("Problem trying to sign you up");
    },
    onSuccess: () => {
      navigate("/login");
      toast.success("Successfully signed up!");
    },
  });

  function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDbError("");

    if (password !== confirmPassword) {
      setDbError("Password and Confirm Password must match!");
      return;
    }

    mutate({ firstName, lastName, userName, email, password });
  }

  return (
    <Box display="flex" justifyContent="center" px={2} py={5}>
      <Paper elevation={3} sx={{ maxWidth: 500, width: "100%", p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Sign up to Tasky!
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Enter your details below to create your account.
        </Typography>

        <Box mt={2} mb={3}>
          <Button component={Link} to="/login" variant="outlined" fullWidth>
            Already have an account? Login
          </Button>
        </Box>

        {dbError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {dbError}
          </Alert>
        )}

        <form onSubmit={handleSignUp}>
          <Grid container spacing={2}>
            <Grid>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />
            </Grid>
            <Grid>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <CircularProgress
                      size={20}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SignUp;
