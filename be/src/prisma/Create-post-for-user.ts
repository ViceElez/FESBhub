import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


//manualno dodavanje posta preko userida smao promini userId i dodat ce ti post
async function main() {
  const userId = 1; // set to an existing user id (number)

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.error(`User with id=${userId} not found`);
    return;
  }

  const post = await prisma.post.create({
    data: {
      title: 'novi post',
      content: 'This post was created by an admin user.',
      userId: user.id,
      verified: true,
    },
  });

  console.log('Created post:', post);
}

main()
  .catch((e) => {
    console.error('Script error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });