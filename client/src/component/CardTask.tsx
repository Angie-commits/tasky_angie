import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { ArchiveRestore, SquarePen, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../constant";

type TaskProps = {
  title: string;
  description: string;
  id: string;
  variant?: "default" | "trash";
  status?: "complete" | "incomplete";
};

async function deleteTask(id: string) {
  const res = await fetch(`${BASE_URL}/tasks/delete/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

async function restoreTask(id: string) {
  const res = await fetch(`${BASE_URL}/tasks/restore/${id}`, {
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

const CardTask = ({
  title,
  description,
  id,
  variant = "default",
  status = "complete",
}: TaskProps) => {
  const navigate = useNavigate();

  const mutationFn = variant === "trash" ? restoreTask : deleteTask;

  const { mutate, isPending } = useMutation({
    mutationKey: [variant === "trash" ? "restore-task" : "delete-task"],
    mutationFn,
    onSuccess: () => {
      toast.success(
        variant === "trash"
          ? "Successfully restored task!"
          : "Successfully deleted task!",
      );
      navigate(variant === "trash" ? "/tasks" : "/trash");
    },
    onError: () => {
      toast.error(
        variant === "trash" ? "Failed to restore task" : "Error deleting task",
      );
    },
  });

  const statusMutation = useMutation({
    mutationKey: [status === "complete" ? "mark-incomplete" : "mark-complete"],
    mutationFn:
      status === "complete" ? markTaskAsIncomplete : markTaskAsComplete,
    onSuccess: () => {
      toast.success(
        status === "complete"
          ? "Marked task as incomplete!"
          : "Marked task as complete!",
      );
      navigate(status === "complete" ? "/tasks" : "/completed");
    },
    onError: () => {
      toast.error(
        status === "complete"
          ? "Failed to mark as incomplete"
          : "Failed to mark as complete",
      );
    },
  });

  return (
    <Card variant="outlined" sx={{ p: 2, flex: 1 }}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{ color: "primary.main", textTransform: "capitalize" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 1 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} width="100%">
          {variant !== "trash" && (
            <>
              <Button
                fullWidth
                variant="outlined"
                color={status === "complete" ? "warning" : "success"}
                onClick={() => statusMutation.mutate(id)}
              >
                {statusMutation.isPending
                  ? status === "incomplete"
                    ? "Marking..."
                    : "Reverting..."
                  : status === "incomplete"
                    ? "Mark as Complete"
                    : "Mark as Incomplete"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                component={Link}
                to={`/edit/${id}`}
                startIcon={<SquarePen />}
              >
                Update
              </Button>
            </>
          )}

          <Button
            fullWidth
            variant="outlined"
            color={variant === "trash" ? "success" : "error"}
            onClick={() => mutate(id)}
            startIcon={variant === "trash" ? <ArchiveRestore /> : <Trash />}
          >
            {isPending
              ? variant === "trash"
                ? "Restoring..."
                : "Deleting..."
              : variant === "trash"
                ? "Restore"
                : "Delete"}
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default CardTask;
