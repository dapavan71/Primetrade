import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import prisma from './utils/prisma';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 API documentation is available at http://localhost:${PORT}/api-docs\n`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});
