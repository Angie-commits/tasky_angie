/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useUserQuery } from "../hooks/useUserQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUser from "../store/userStore";
import { BASE_URL } from "../constant";

const Account = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState<File | string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const queryClient = useQueryClient();
  const { data: user } = useUserQuery();
  const navigate = useNavigate();
  const { logOut } = useUser();

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setUserName(user.userName);
      setProfileImage(user.avatar ?? null);
    }
  }, [user]);

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "antooo");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhetijarg/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Image upload failed");
    return data.secure_url;
  };

  const updateUserInfo = async (data: any) => {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    if (!response.ok) throw new Error(res.message);
    return res.updatedUser;
  };

  const updatePassword = async () => {
    const response = await fetch(`${BASE_URL}/user/password`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const res = await response.json();
    if (!response.ok) throw new Error(res.message);
    return res;
  };

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const { mutate: changePassword, isPending: isUpdatingPassword } = useMutation(
    {
      mutationFn: updatePassword,
      onSuccess: () => {
        toast.success("Password updated");
        setCurrentPassword("");
        setNewPassword("");
      },
      onError: (err: any) => toast.error(err.message),
    },
  );

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    logOut();
    localStorage.removeItem("tasky-user");
    toast.success("Logged out");
    navigate("/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUploadingImage || isUpdatingProfile) return;

    try {
      setIsUploadingImage(true);

      let avatarUrl = profileImage;

      if (profileImage instanceof File) {
        avatarUrl = await uploadImageToCloudinary(profileImage);
      }

      updateProfile({
        firstName,
        lastName,
        email,
        userName,
        avatar: avatarUrl,
      });
    } catch (err: any) {
      toast.error(err.message || "Error uploading avatar");
    } finally {
      setIsUploadingImage(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid
        container
        direction="column"
        spacing={4}
        sx={{ maxWidth: 600, mx: "auto", py: 4 }}
      >
        <Grid>
          <Card>
            <CardHeader
              title="Edit Profile"
              subheader="Manage your personal information"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid>
                  <Button variant="outlined" component="label">
                    Upload Avatar
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setProfileImage(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isUploadingImage || isUpdatingProfile}
              >
                {isUploadingImage
                  ? "Uploading..."
                  : isUpdatingProfile
                    ? "Updating..."
                    : "Save Changes"}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid>
          <Card>
            <CardHeader
              title="Change Password"
              subheader="Update your account security"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => changePassword()}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardActions>
            <Divider />
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
};

export default Account;
