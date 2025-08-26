import express from "express";
import { body, param } from "express-validator";
import { authRequired } from "../middleware/auth.js";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/tasks", authRequired, getTasks);

router.post(
  "/tasks",
  authRequired,
  [
    body("name").isString().trim().notEmpty(),
    body("description").optional().isString(),
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
    body("totalTask").optional().isInt({ min: 0 }),
    body("status").optional().isIn(["todo", "in_progress", "done"]),
  ],
  createTask
);

router.put(
  "/tasks/:id",
  authRequired,
  [
    param("id").isMongoId(),
    body("name").optional().isString().trim().notEmpty(),
    body("description").optional().isString(),
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
    body("totalTask").optional().isInt({ min: 0 }),
    body("status").optional().isIn(["todo", "in_progress", "done"]),
  ],
  updateTask
);

router.delete("/tasks/:id", authRequired, [param("id").isMongoId()], deleteTask);

export default router;


