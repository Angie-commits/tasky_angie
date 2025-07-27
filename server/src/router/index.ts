import { Router } from "express";
import {
  loginUser,
  logOut,
  getLoggedinUserDetails,
  updateLoggedInUserInfo,
  updateUserPassword,
  registerUser,
} from "../controllers/user.controller";
import {
  createTask,
  getAllUserTasks,
  getSpecificTaskById,
  updateTaskById,
  markTaskAsDeleted,
  restoreDeletedTask,
  markTaskAsComplete,
  markTaskAsInComplete,
  getCompletedTask,
  getAllDeletedTask,
} from "../controllers/task.controller";
import { checkFieldsRegister } from "../middleware/checkFieldsRegister";
import { ensureUniqueEmail } from "../middleware/ensureEmailUnique";
import { checkPasswordStrength } from "../middleware/checkPasswordStrength";
import { checkLoginFields } from "../middleware/checkLoginFields";
import { checkUserPresent } from "../middleware/checkUserPresent";
import { checkFieldsTask } from "../middleware/checkFieldsTask";

const router = Router();

router.post(
  "/auth/register",
  checkFieldsRegister,
  ensureUniqueEmail,
  checkPasswordStrength,
  registerUser
);
router.post("/auth/login", checkLoginFields, loginUser);
router.post("/auth/logout", logOut);
router.get("/user", checkUserPresent, getLoggedinUserDetails);
router.patch("/user", checkUserPresent, updateLoggedInUserInfo);
router.patch("/user/password", checkUserPresent, updateUserPassword);

router.post("/tasks", checkFieldsTask, checkUserPresent, createTask);
router.get("/tasks", checkUserPresent, getAllUserTasks);
router.get("/tasks/completed", checkUserPresent, getCompletedTask);
router.get("/tasks/deleted", checkUserPresent, getAllDeletedTask);
router.get("/tasks/:id", checkUserPresent, getSpecificTaskById);
router.patch("/tasks/:id", checkUserPresent, updateTaskById);
router.patch("/tasks/delete/:id", checkUserPresent, markTaskAsDeleted);
router.patch("/tasks/restore/:id", checkUserPresent, restoreDeletedTask);
router.patch("/tasks/complete/:id", checkUserPresent, markTaskAsComplete);
router.patch("/tasks/incomplete/:id", checkUserPresent, markTaskAsInComplete);

export default router;
