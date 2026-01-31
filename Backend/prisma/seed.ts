import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.workspace.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@elpatron.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create admin workspace
  await prisma.workspace.create({
    data: {
      userId: admin.id,
      state: 'ACTIVE',
      provider: 'SIMULATED',
      notes: 'Admin workspace',
    },
  });

  // Create operator user
  const operatorPassword = await bcrypt.hash('operator123', 10);
  const operator = await prisma.user.create({
    data: {
      email: 'operator@elpatron.com',
      password: operatorPassword,
      name: 'Operator User',
      role: 'OPERATOR',
    },
  });

  // Create operator workspace
  await prisma.workspace.create({
    data: {
      userId: operator.id,
      state: 'ACTIVE',
      provider: 'SIMULATED',
      notes: 'Operator workspace',
    },
  });

  // Create sample operations
  await prisma.operation.create({
    data: {
      title: 'Contact Follow-up',
      description: 'Follow up with prospects from last week',
      status: 'NEW',
      assigneeUserId: operator.id,
    },
  });

  await prisma.operation.create({
    data: {
      title: 'Contract Review',
      description: 'Review and approve new client contract',
      status: 'IN_PROGRESS',
      assigneeUserId: operator.id,
    },
  });

  console.log('✅ Database seed completed!');
  console.log('📧 Admin: admin@elpatron.com / admin123');
  console.log('📧 Operator: operator@elpatron.com / operator123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
