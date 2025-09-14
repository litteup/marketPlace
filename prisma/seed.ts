import { PrismaClient } from '@prisma/client';

import { getPasswordHash } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  const hash = await getPasswordHash('Password123@');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'newAdmin@gmail.com' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  const adminUser = await prisma.user.create({
    data: {
      email: 'newAdmin@gmail.com',
      full_name: 'Admin Doe',
      role: 'admin',
      phone: '+1234567890',
      verification_status: 'verified',
      seller_badge: true,
      password: {
        create: {
          hash: hash,
        },
      },
    },
  });

  console.log('Admin user created successfully!', adminUser);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', (e as Error).message);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
