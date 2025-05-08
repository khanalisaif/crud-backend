import express from "express";
import Todo from "./TodoModel.js";
import authenticateUser from "./Authentication.js";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Inside posttodos route");
  console.log("req.body..", req.body);
  const { title, email, description, dueDate } = req.body;
  if (!title || !email || !description || !dueDate) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const todo = new Todo({ title, email, description, dueDate });
  await todo.save();
  res.status(201).json(todo);
});

router.get("/", authenticateUser, async (req, res) => {
  console.log("Inside gettodos route after authenticate ");
  const user = req.user;

  const { email } = user;
  console.log("checking email", email);
  const todos = await Todo.find({ email });
  console.log("todos..", todos);
  res.json(todos);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const todo = await Todo.findByIdAndUpdate(id, { title }, { new: true });
  res.json(todo);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.status(204).send();
});

export default router;
