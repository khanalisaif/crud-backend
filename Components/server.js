import express from 'express';
import cors from 'cors';
import connectDB from './Db.js';
import router from './Routes.js';

const app = express();
const PORT = 5000;
app.use(express.json());


app.use(cors());


connectDB();


app.use('/api/todos', router);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});