import { useQuery } from "@tanstack/react-query";
import { type TaskProps } from "./AllTasks";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { AlertCircleIcon } from "lucide-react";
import { BASE_URL } from "../constant";
import CardTask from "../component/CardTask";

async function fetchAllCompletedTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks/completed`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    return data.completed;
  } catch (error) {
    console.error("error fetching all completed tasks", error);
    throw error;
  }
}

const CompletedTask = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks-completed"],
    queryFn: fetchAllCompletedTasks,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        Failed to fetch completed tasks.
      </Alert>
    );
  }

  return (
    <Box>
      {data.length > 0 && (
        <Typography variant="h5" fontWeight="bold" align="center" mt={2} mb={4}>
          These are all your completed tasks
        </Typography>
      )}

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {data.length > 0 ? (
          data.map((completed: TaskProps) => (
            <Box
              key={completed.id}
              width={{ xs: "100%", sm: "45%", md: "30%" }}
            >
              <CardTask
                id={completed.id}
                title={completed.title}
                description={completed.description}
                status="complete"
              />
            </Box>
          ))
        ) : (
          <Stack spacing={2} alignItems="center" m="auto" maxWidth="500px">
            <Alert
              severity="info"
              icon={<AlertCircleIcon />}
              sx={{ width: "100%", textAlign: "left" }}
            >
              <AlertTitle>No Completed Tasks</AlertTitle>
              <Typography variant="body2">
                Please mark some tasks as completed to see them here.
              </Typography>
            </Alert>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default CompletedTask;
