import { useQuery } from "@tanstack/react-query";
import { AlertTitle, Alert as MuiAlert } from "@mui/material";
import { AlertCircleIcon } from "lucide-react";
import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import CardTask from "../component/CardTask";
import { BASE_URL } from "../constant";

export type TaskProps = {
  id: string;
  title: string;
  description: string;
  isDeleted: boolean;
  isCompleted: boolean;
};

async function getAllIncompleteTasks() {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.specificTask;
}

const AllTasks = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllIncompleteTasks,
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
      <MuiAlert severity="error">
        <AlertTitle>Error</AlertTitle>
        Failed to load your tasks.
      </MuiAlert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" align="center" mt={2} mb={4}>
        Finish all this tasks
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {data.length > 0 ? (
          data.map((task: TaskProps) => (
            <Box key={task.id} width={{ xs: "100%", sm: "45%", md: "30%" }}>
              <CardTask
                id={task.id}
                title={task.title}
                description={task.description}
                variant="default"
                status={task.isCompleted ? "complete" : "incomplete"}
              />
            </Box>
          ))
        ) : (
          <Stack spacing={2} alignItems="center" m="auto" maxWidth="500px">
            <MuiAlert
              severity="info"
              icon={<AlertCircleIcon />}
              sx={{ width: "100%", textAlign: "left" }}
            >
              <AlertTitle>No Tasks Found</AlertTitle>
              <Typography variant="body2">
                You have no tasks at the moment. Start by creating one!
              </Typography>
            </MuiAlert>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default AllTasks;
