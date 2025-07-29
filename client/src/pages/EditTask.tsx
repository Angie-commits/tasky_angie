import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BASE_URL } from "../constant";

type TaskUpdateByIdProps = {
  title: string;
  description: string;
};

async function markTaskAsIncomplete(id: string) {
  const res = await fetch(`${BASE_URL}/tasks/incomplete/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

async function markTaskAsComplete(id: string) {
  const res = await fetch(`${BASE_URL}/tasks/complete/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

const EditTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const getTaskById = async () => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.task;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["getTaskById", id],
    queryFn: getTaskById,
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
    }
  }, [data]);

  const updateTaskById = async (task: TaskUpdateByIdProps) => {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  };

  const mutation = useMutation({
    mutationKey: ["task-update", id],
    mutationFn: updateTaskById,
    onSuccess: () => {
      toast.success("Task updated successfully!");
      navigate("/tasks");
    },
    onError: () => toast.error("Failed to update task"),
  });

  const statusMutation = useMutation({
    mutationKey: [data?.isCompleted ? "mark-incomplete" : "mark-complete"],
    mutationFn: () =>
      data?.isCompleted
        ? markTaskAsIncomplete(id as string)
        : markTaskAsComplete(id as string),
    onSuccess: () => {
      toast.success(
        data?.isCompleted ? "Marked as Incomplete" : "Marked as Complete",
      );
      navigate(data?.isCompleted ? "/tasks" : "/completed");
    },
    onError: () => toast.error("Failed to change task status"),
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ title, description });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography color="error">Error fetching task</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" py={6} px={2}>
      <Card sx={{ width: "100%", maxWidth: 500 }}>
        <CardHeader
          title="Edit Task"
          subheader="Update the title and description below"
        />
        <form onSubmit={handleUpdate}>
          <CardContent>
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Box>
          </CardContent>
          <CardActions sx={{ display: "flex", gap: 2, px: 2, pb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => statusMutation.mutate()}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending
                ? data?.isCompleted
                  ? "Reverting..."
                  : "Marking..."
                : data?.isCompleted
                  ? "Mark as Incomplete"
                  : "Mark as Complete"}
            </Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};

export default EditTask;
