import { useQuery } from "@tanstack/react-query";
import { type TaskProps } from "./AllTasks";

import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Grid,
  Stack,
} from "@mui/material";
import { AlertCircleIcon } from "lucide-react";
import CardTask from "../component/CardTask";
import { BASE_URL } from "../constant";

async function getAllDeletedTasks() {
  try {
    const response = await fetch(`${BASE_URL}/tasks/deleted`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }
    return data.deleted;
  } catch (error) {
    console.error("Error fetching all deleted tasks");
    throw error;
  }
}

const Delete = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["deletedTask"],
    queryFn: getAllDeletedTasks,
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
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">Error fetching deleted tasks</Alert>
      </Box>
    );
  }

  return (
    <Box py={4} px={2}>
      {data.length > 0 && (
        <Stack spacing={2} alignItems="center" mb={4}>
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            textTransform="uppercase"
          >
            These Are All Your Deleted Tasks
          </Typography>
          <Alert
            severity="warning"
            iconMapping={{ warning: <AlertCircleIcon /> }}
          >
            Tasks in trash will be automatically deleted after 30 days
          </Alert>
        </Stack>
      )}

      {data.length > 0 ? (
        <Grid container spacing={2}>
          {data.map((task: TaskProps) => (
            <Grid key={task.id}>
              <CardTask
                title={task.title}
                description={task.description}
                id={task.id}
                variant="trash"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box maxWidth="600px" mx="auto" mt={6}>
          <Alert severity="info" iconMapping={{ info: <AlertCircleIcon /> }}>
            <Typography fontWeight="bold">You have NO deleted tasks</Typography>
            <Typography variant="body2">
              All finished and deleted tasks will be shown here.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default Delete;
