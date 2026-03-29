import { Router } from 'express';
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../../controllers/task.controller';
import { authenticate, authorizeRole } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../../validations/task.validation';

const router = Router();

router.use(authenticate); // Apply authentication to all task routes

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.get('/:id', getTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
