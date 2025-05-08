import express from 'express';
import Todo from './TodoModel.js';
import authenticateUser from './Authentication.js';

const router = express.Router();



router.post('/', async (req, res) => {
  const { title } = req.body;
  const todo = new Todo({ title });
  await todo.save();
  res.status(201).json(todo);
});



router.get('/',  async (req, res) => {
  console.log("Inside gettodos route after authenticate ")

  const {email} = req.body;
  console.log("checking email", email)
  const todos = await Todo.find({email});
  res.json(todos); 
}); 



router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, { title }, { new: true });
    res.json(todo);
  });



router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.status(204).send();
});

export default router;