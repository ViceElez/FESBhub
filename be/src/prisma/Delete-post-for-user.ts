import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = 1;

  if(!userId){
    console.error(`Please set a valid userId`);
    return;
  }

 const DeletedPost = await prisma.post.deleteMany({
    where: {
      userId: userId,
    },
  });
    console.log('Deleted posts:', DeletedPost);

  
}

main()
  .catch((e) => {
    console.error('Script error:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });