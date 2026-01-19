import { PrismaClient,Folder } from '@prisma/client';

const prisma = new PrismaClient();

function randomUpdatedAt() {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - 2);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

async function main() {

    const crypto= await import('node:crypto');
    const password= crypto.createHmac('sha256', process.env.HASHING_SECRET!).update("123123").digest('hex')
    const hashedPasswordModule= await import('argon2');
    const hashedPassword= await hashedPasswordModule.hash(password);

    await prisma.user.createMany({
        data: [
            {
                id: 1,
                email: 'admin@fesb.hr',
                firstName: 'Admin',
                lastName: 'User',
                password: hashedPassword,
                isVerified: true,
                isEmailVerified: true,
                isAdmin: true,
            },
            {
                id: 2,
                email: 'regular@fesb.hr',
                firstName: 'Regular',
                lastName: 'User',
                password: hashedPassword,
                isVerified: false,
                isEmailVerified: true,
                isAdmin: false,
            },
        ],
    })

    const users = await prisma.user.findMany();

    if (users.length === 0) {
        throw new Error("No users found. Create users first.");
    }

    const adminUser = await prisma.user.findFirst({
        where: { isAdmin: true },
    });
    if (!adminUser) {
        throw new Error('No admin user found for folder ownership');
    }
    const userId = adminUser.id;

    await prisma.professor.createMany({
    data: [
        {
            id: 1,
            email: 'Linda.Vickovic@fesb.hr',
            firstName: 'Linda',
            lastName: 'Vicković',
            specialization: "Tehničke znanosti | Računarstvo",
            education: "FESB",
            professorImageUrl:"https://i.postimg.cc/bw6Pn8wX/linda.jpg",
            rating:0
        },
        {
            id: 2,
            email: 'Sven.Gotovac@fesb.hr',
            firstName: 'Sven',
            lastName: 'Gotovac',
            specialization: "Tehničke znanosti | Elektrotehnika | Elektronika",
            education: "FESB",
            professorImageUrl:"https://i.postimg.cc/QdNsVVhx/gotovac.jpg",
            rating:0
        },
        {
            id: 3,
            email: 'Maja.Stula@fesb.hr',
            firstName: 'Maja',
            lastName: 'Štula',
            specialization: "Tehničke znanosti | Računarstvo",
            education: "FESB",
            professorImageUrl:"https://i.postimg.cc/x1jYqqn0/kiki.jpg",
            rating:0
        },
        {
            id: 4,
            email: 'Ante.Kristic@fesb.hr',
            firstName: 'Ante',
            lastName: 'Kristić',
            specialization: "Tehničke znanosti | Elektrotehnika",
            education: "FESB",
            professorImageUrl:"https://i.postimg.cc/wjxH33gq/akristic.jpg",
            rating:0
        },
        {
            id: 5,
            email: 'Ivan.Krolo@fesb.hr',
            firstName: 'Ivan',
            lastName: 'Krolo',
            specialization: "Tehničke znanosti | Elektrotehnika",
            education: "FESB",
            professorImageUrl:"https://i.postimg.cc/zGdNh5GY/I_K.jpg",
            rating:0
        },
        {
            id: 6,
            email: 'Ivan.Slapnicar@fesb.hr',
            firstName: 'Ivan',
            lastName: 'Slapničar',
            specialization: "Prirodne znanosti | Matematika | Matematika",
            education: "FESB",
            professorImageUrl:"https://i.postimg.cc/bwY8ddpY/slap.jpg",
            rating:0
        },
        {
            id: 7,
            email:'Marija.Dedic.00@fesb.hr',
            firstName: 'Marija',
            lastName: 'Mijaljević ',
            specialization: "Tehničke znanosti | Računarstvo ",
            education: "FESB",
            professorImageUrl:"https://i.postimg.cc/wjxH33gq/akristic.jpg",
            rating:0
        },
        {
            id: 8,
            email:'Duje.Vatavuk.00@fesb.hr',
            firstName: 'Duje',
            lastName: 'Vatavuk',
            specialization: "Tehničke znanosti | Računarstvo",
            education: "FESB",
            professorImageUrl:"",
            rating:0
        },
        {
            id: 9,
            email:'Anita.Carevic@fesb.hr',
            firstName: 'Anita',
            lastName: 'Carević',
            specialization: "Prirodne znanosti | Matematika",
            education: "FESB",
            professorImageUrl:"",
            rating:0
        },
    ]
    })

    await prisma.subject.createMany({
        data:[
            {
                id: 1,
                title: "Programsko inženjerstvo",
                idNositelja: 1,
                idAuditornih: 1,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 2,
                title: "Strukture podataka",
                idNositelja: 1,
                idAuditornih: 8,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 3,
                title: "Arhitektura digitalnih računala",
                idNositelja: 2,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 4,
                title: "Operacijski sustavi",
                idNositelja: 2,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 5,
                title: "Osnove ugradbenih računalnih sustava",
                idNositelja: 2,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 6,
                title: "Programiranje za Internet ",
                idNositelja: 3,
                idAuditornih:7,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 7,
                title: "Projektiranje informacijskih sustava",
                idNositelja: 3,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 8,
                title: "Računalne mreže",
                idNositelja: 4,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 9,
                title: "Elektrotehnika",
                idNositelja: 5,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 10,
                title: "Matematika 1",
                idNositelja: 6,
                idAuditornih: 9,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            },
            {
                id: 11,
                title: "Matematika 2",
                idNositelja: 6,
                idAuditornih: 9,
                ratingDifficulty:0,
                ratingExpectations:0,
                ratingPracticality:0,
            }
        ]
    })

    await prisma.post.createMany({
        data: [
            {
                title: "First student post",
                content: "This is a test post about the subject.",
                userId: users[0].id,
                verified: true,
            },
            {
                title: "Exam experience",
                content: "The exam was difficult but fair.",
                userId: users[0].id,
            },
            {
                title: "Study tips",
                content: "Focus on past exams and practice tasks.",
                userId: users[1]?.id ?? users[0].id,
            },
        ],
    });

    const posts = await prisma.post.findMany();

    await prisma.postImage.createMany({
        data: [
            {
                postId: posts[0].id,
                url: "https://i.postimg.cc/g2xSMPKh/FEsb_Logo.jpg",
            },
            {
                postId: posts[0].id,
                url: "https://i.postimg.cc/NfjBj5Qp/school-exam-stress-f8ac6b93e6ce404c9dae63c33fba7aad.jpg",
            },
            {
                postId: posts[1].id,
                url: "https://i.postimg.cc/nhXRdt1q/FESBZrak.jpg",
            },
            {
                postId: posts[2].id,
                url: "https://i.postimg.cc/52X7PMmv/Zrak2.jpg",
            },
            {
                postId: posts[2].id,
                url: "https://i.postimg.cc/xT8VShR8/images.png",
            },
            {
                postId: posts[2].id,
                url: "https://i.postimg.cc/52X7PMmv/Zrak2.jpg",
            },
        ],
    });


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
