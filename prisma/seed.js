const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_DEFAULT_PASS; // Replace with your desired password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'jedp082@gmail.com', // Replace with your desired email
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log(`User created with id: ${adminUser.id}`);

  const clientUser = await prisma.user.create({
    data: {
      email: 'dharma@gmail.com', // Replace with your desired email
      password: hashedPassword,
      role: UserRole.CLIENT,
    },
  });

  console.log(`User created with id: ${clientUser.id}`);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
