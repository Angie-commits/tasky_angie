import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getTaskById } from "../helpGetTaskById/getTaskById";

const client = new PrismaClient();

export async function createTask(req: Request, res: Response) {
  try {
    const { title, description } = req.body;
    const { id } = req.user;
    const createdTask = await client.task.create({
      data: {
        title,
        description,
        userId: id,
      },
    });

    res
      .status(201)
      .send({ message: "successfully created a task", createdTask });
  } catch (error) {
    res.status(500).send({ message: "failed to create task" });
  }
}

export async function getAllUserTasks(req: Request, res: Response) {
  try {
    const { id } = req.user;
    const specificTask = await client.task.findMany({
      where: {
        userId: id,
        isDeleted: false,
        isCompleted: false,
      },
    });
    res
      .status(200)
      .send({ messsage: "successfully fetched the blog", specificTask });
  } catch (error) {
    res.status(500).send({ message: "error in fetching this specific task" });
  }
}

export async function getSpecificTaskById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const task = await getTaskById(id);

    if (!task) {
      res.status(404).send({ message: "Task not found or has been deleted" });
      return;
    }

    res.status(200).send({
      message: "successfully fetched the specific task",
      task,
    });
  } catch (error) {
    res.status(500).send({ message: "error fetching this specific task" });
  }
}

export async function updateTaskById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const existingTask = await getTaskById(id);

    if (!existingTask) {
      res.status(404).send({ message: "Task not found or has been deleted" });
      return;
    }

    await client.task.update({
      where: { id },
      data: {
        title: title && title,
        description: description && description,
      },
    });

    res.status(200).send({ message: "successfully updated the task" });
  } catch (error) {
    res.status(500).send({ message: "failed to update this task" });
  }
}

export async function markTaskAsDeleted(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await client.task.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).send({ message: "successfully mark task as deleted" });
  } catch (error) {
    res.status(500).send({ message: "error in marking task as deleted" });
  }
}

export async function restoreDeletedTask(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const task = await client.task.findFirst({
      where: {
        id,
        isDeleted: true,
      },
    });

    if (!task) {
      res.status(404).send({ message: "Task not found or is not deleted" });
      return;
    }

    await client.task.update({
      where: { id },
      data: {
        isDeleted: false,
      },
    });

    res.status(200).send({ message: "successfully restored deleted message" });
  } catch (error) {
    res.status(500).send({ message: "error restoring the deleted task" });
  }
}

export async function markTaskAsComplete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await client.task.update({
      where: { id },
      data: {
        isCompleted: true,
      },
    });
    res.status(200).send({ message: "successfully marked task as complete" });
  } catch (error) {
    res.status(500).send({ message: "error marking task as complete" });
  }
}

export async function markTaskAsInComplete(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const task = await client.task.findFirst({
      where: { id, isDeleted: false },
    });
    if (!task) {
      res.status(400).send({ message: "task not found or not incomplete" });
      return;
    }
    const incomplete = await client.task.update({
      where: { id },
      data: {
        isCompleted: false,
      },
    });
    res
      .status(200)
      .send({ message: "successfully marked task as incomplete", incomplete });
  } catch (error) {
    res.status(500).send({ message: "error marking tas as incomplete" });
  }
}

export async function getCompletedTask(req: Request, res: Response) {
  try {
    const { id } = req.user;

    const completed = await client.task.findMany({
      where: {
        userId: id,
        isCompleted: true,
        isDeleted: false,
      },
    });

    res
      .status(200)
      .send({ message: "successfully fetched all completedTasks", completed });
  } catch (error) {
    res.status(500).send({ message: "ERROR fetching your specific task" });
  }
}

export async function getAllDeletedTask(req: Request, res: Response) {
  try {
    const { id } = req.user;
    const deleted = await client.task.findMany({
      where: { userId: id, isDeleted: true },
    });
    res
      .status(200)
      .send({ message: "successfully fetched all deleted task", deleted });
  } catch (error) {
    res.status(500).send({ message: "error getting all deleted tasks" });
  }
}
