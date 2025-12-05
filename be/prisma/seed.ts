import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
    { email: 'alice@example.com', 
        firstName: 'Alice', 
        lastName: 'Anderson', 
        studij: 'Računarstvo',
        currentStudyYear: 3,
        isAdmin: true,
        isVerified: true,
        password: '123',

    },
    { email: 'bob@example.com', 
        firstName: 'Bob', 
        lastName: 'Brown', 
        studij: 'Strojarstvo',
        currentStudyYear: 4,
        isAdmin: false,
        isVerified: true,
        password: '123',
    },
    { email: 'charlie@example.com', 
        firstName: 'Charlie', 
        lastName: 'Michaelson', 
        studij: 'Računarstvo',
        currentStudyYear: 2,
        isAdmin: false,
        isVerified: true,
        password: '123',
    },
    { email: 'marlie123@example.com', 
        firstName: 'Marlie', 
        lastName: 'Markson', 
        studij: 'Elektrotehnika',
        currentStudyYear: 5,
        isAdmin: true,
        isVerified: true,
        password: '123',
    },
    ],
    skipDuplicates: true,
  });
  
    await prisma.professor.createMany({
      data: [
        { email: 'professor1@example.com', 
            firstName: 'John', 
            lastName: 'Doe', 
            specialization: 'Strojno učenje', 
            education: 'FESB' },
        { email: 'professor2@example.com', 
            firstName: 'Jane', 
            lastName: 'Smith', 
            specialization: 'Mehaničko inženjerstvo', 
            education: 'FESB' },
        { email: 'professor3@example.com', 
            firstName: 'Alice', 
            lastName: 'Johnson', 
            specialization: 'Računarstvo', 
            education: 'FESB' },
      ],
      skipDuplicates: true,
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

