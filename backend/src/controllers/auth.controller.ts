import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ status: 'error', message: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: role || 'USER' },
  });

  res.status(201).json({
    status: 'success',
    data: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    status: 'success',
    token,
    data: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

  res.status(200).json({
    status: 'success',
    data: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
};
