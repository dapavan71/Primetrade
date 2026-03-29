import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createTask = async (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || 'PENDING',
      userId: req.user!.userId,
    },
  });
  res.status(201).json({ status: 'success', data: task });
};

export const getTasks = async (req: Request, res: Response) => {
  const { role, userId } = req.user!;
  
  const tasks = await prisma.task.findMany({
    where: role === 'ADMIN' ? undefined : { userId },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
  
  res.status(200).json({ status: 'success', data: tasks });
};

export const getTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await prisma.task.findUnique({ 
    where: { id: parseInt(id as string) },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });
  
  if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
  
  if (req.user!.role !== 'ADMIN' && task.userId !== req.user!.userId) {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }

  res.status(200).json({ status: 'success', data: task });
};

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const task = await prisma.task.findUnique({ where: { id: parseInt(id as string) } });
  if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
  
  if (req.user!.role !== 'ADMIN' && task.userId !== req.user!.userId) {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }

  const updatedTask = await prisma.task.update({
    where: { id: parseInt(id as string) },
    data: req.body,
  });

  res.status(200).json({ status: 'success', data: updatedTask });
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const task = await prisma.task.findUnique({ where: { id: parseInt(id as string) } });
  if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
  
  if (req.user!.role !== 'ADMIN' && task.userId !== req.user!.userId) {
    return res.status(403).json({ status: 'error', message: 'Forbidden' });
  }

  await prisma.task.delete({ where: { id: parseInt(id as string) } });
  
  res.status(200).json({ status: 'success', message: 'Task deleted successfully' });
};
