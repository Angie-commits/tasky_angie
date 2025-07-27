import { useMutation } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../constant";

type CreateTaskProps = {
  title: string;
  description: string;
};

async function createTask(task: CreateTaskProps) {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.createdTask;
  } catch (error) {
    console.error("Error creating task");
    throw error;
  }
}

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dbError, setDbError] = useState("");

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-task"],
    mutationFn: createTask,
    onSuccess: () => {
      navigate("/tasks");
      toast.success("Successfully created task");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setDbError(error.message);
      toast.error("Failed to create task");
    },
  });

  function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDbError("");
    mutate({ title, description });
  }

  return (
    <Box display="flex" justifyContent="center" mt={5} px={2}>
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="bold">
              Create Your Task
            </Typography>
          }
          subheader={
            <Typography variant="body2">
              Enter your task title and description below
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleCreateTask} id="createTaskForm">
            <Box display="flex" flexDirection="column" gap={3}>
              {dbError && (
                <Alert
                  severity="error"
                  icon={<AlertCircleIcon size={18} />}
                  sx={{ fontSize: "0.95rem" }}
                >
                  {dbError}
                </Alert>
              )}
              <TextField
                label="Title"
                placeholder="Enter task title"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Description"
                placeholder="Enter task description"
                required
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePage;
