import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create 10 users
  const users = Array.from({ length: 10 }, (_, index) => ({
    name: `User ${index + 1}`,
    email: `user${index + 1}@vitstudent.ac.in`,
    roomId: index + 1,
  }));

  // Create 10 rooms
  const rooms = Array.from({ length: 10 }, (_, index) => ({
    number: index + 1,
    block: `Block ${String.fromCharCode(65 + (index % 3))}`,
  }));

  // Create 10 cleaning jobs, half of which are completed
  const cleaningJobs = Array.from({ length: 10 }, (_, index) => ({
    time: new Date(),
    roomId: index + 1,
    assigned: false,
    completed: index % 2 === 0, // Half of the cleaning jobs are completed
  }));

  // Create 10 staff members
  const staffMembers = Array.from({ length: 10 }, (_, index) => ({
    name: `Staff ${index + 1}`,
    email: `staff${index + 1}@example.com`,
    role: index % 2 === 0 ? Role.cleaner : Role.cleaningAdmin,
    phone: `123-456-${index.toString().padStart(2, '0')}`,
    block: `Block ${String.fromCharCode(65 + (index % 3))}`,
  }));

  // Seed data into the database
  await prisma.room.createMany({ data: rooms });
  await prisma.student.createMany({ data: users });
  await prisma.cleaningJob.createMany({ data: cleaningJobs });
  await prisma.staff.createMany({ data: staffMembers });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
