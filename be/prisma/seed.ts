import { PrismaClient,Folder } from '@prisma/client';

const prisma = new PrismaClient();

function randomUpdatedAt() {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - 2);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

async function main() {
  /* =========================
     USERS
     ========================= */
  // await prisma.user.createMany({
  //   data: [
  //     {
  //       email: 'alice@example.com',
  //       firstName: 'Alice',
  //       lastName: 'Anderson',
  //       studij: 'Računarstvo',
  //       currentStudyYear: 3,
  //       isAdmin: true,
  //       isVerified: true,
  //       password: '123',
  //     },
  //     {
  //       email: 'bob@example.com',
  //       firstName: 'Bob',
  //       lastName: 'Brown',
  //       studij: 'Strojarstvo',
  //       currentStudyYear: 4,
  //       isAdmin: false,
  //       isVerified: true,
  //       password: '123',
  //     },
  //     {
  //       email: 'charlie@example.com',
  //       firstName: 'Charlie',
  //       lastName: 'Michaelson',
  //       studij: 'Računarstvo',
  //       currentStudyYear: 2,
  //       isAdmin: false,
  //       isVerified: true,
  //       password: '123',
  //     },
  //     {
  //       email: 'marlie123@example.com',
  //       firstName: 'Marlie',
  //       lastName: 'Markson',
  //       studij: 'Elektrotehnika',
  //       currentStudyYear: 5,
  //       isAdmin: true,
  //       isVerified: true,
  //       password: '123',
  //     },
  //   ],
  //   skipDuplicates: true,
  // });
  //
  // /* =========================
  //    PROFESSORS
  //    ========================= */
  // await prisma.professor.createMany({
  //   data: [
  //     {
  //       email: 'professor1@example.com',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       specialization: 'Strojno učenje',
  //       education: 'FESB',
  //     },
  //     {
  //       email: 'professor2@example.com',
  //       firstName: 'Jane',
  //       lastName: 'Smith',
  //       specialization: 'Mehaničko inženjerstvo',
  //       education: 'FESB',
  //     },
  //     {
  //       email: 'professor3@example.com',
  //       firstName: 'Alice',
  //       lastName: 'Johnson',
  //       specialization: 'Računarstvo',
  //       education: 'FESB',
  //     },
  //   ],
  //   skipDuplicates: true,
  // });

  /* =========================
     FOLDERS
     ========================= */

  const adminUser = await prisma.user.findFirst({
    where: { isAdmin: true },
  });

  if (!adminUser) {
    throw new Error('No admin user found for folder ownership');
  }

  const userId = adminUser.id;

  const root = await prisma.folder.create({
    data: {
      name: 'Racunarstvo',
      userId,
      updatedAt: randomUpdatedAt(),
    },
  });

  const semesters = await Promise.all(
    Array.from({ length: 6 }, (_, i) =>
      prisma.folder.create({
        data: {
          name: `Semestar ${i + 1}`,
          parentFolderId: root.id,
          userId,
          updatedAt: randomUpdatedAt(),
        },
      }),
    ),
  );

  const subjectsBySemester: Record<number, string[]> = {
    1: ['Uvod u racunarstvo', 'Matematika 1', 'Fizika 1', 'Engleski jezik 1', 'Osnove elektrotehnike'],
    2: ['Programiranje', 'Matematika 2', 'Fizika 2', 'Engleski jezik 2', 'Elektronika'],
    3: ['Strukture podataka', 'Diskretna matematika', 'Diskretni sustavi i strukture', 'Praktikum', 'Komunikacijske vještine', 'Objektno orijentirano programiranje'],
    4: ['Algoritmi', 'Arhitektura digitalnih računala', 'Baze podataka', 'Signali i sustavi', 'Vjerojatnost i statistika'],
    5: ['Operacijski sustavi', 'Programsko inženjerstvo', 'Programiranje za Internet', 'Računalne mreže', 'Programiranje u Pythonu', 'Programiranje za UNIX'],
    6: ['Projektiranje informacijskih sustava', 'Uvod u distribuirane informacijske sustave', 'Poslovna informatika', 'Obrada signala', 'Osnove ugradbenih računalnih sustava', 'Završni rad'],
  };

  const subjectFolders: Folder[] = [];

  for (let i = 0; i < semesters.length; i++) {
    for (const subjectName of subjectsBySemester[i + 1]) {
      const subjectFolder = await prisma.folder.create({
        data: {
          name: subjectName,
          parentFolderId: semesters[i].id,
          userId,
          updatedAt: randomUpdatedAt(),
        },
      });
      subjectFolders.push(subjectFolder);
    }
  }

  for (const subject of subjectFolders) {
    await prisma.folder.createMany({
      data: [
        { name: 'Video', parentFolderId: subject.id, userId, updatedAt: randomUpdatedAt() },
        { name: 'Skripta', parentFolderId: subject.id, userId, updatedAt: randomUpdatedAt() },
        { name: 'Ostalo', parentFolderId: subject.id, userId, updatedAt: randomUpdatedAt() },
      ],
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
