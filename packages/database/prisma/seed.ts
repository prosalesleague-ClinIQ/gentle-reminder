import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo patient user
  const patientUser = await prisma.user.create({
    data: {
      email: 'margaret@example.com',
      passwordHash: await hash('demo123456', 12),
      firstName: 'Margaret',
      lastName: 'Thompson',
      role: 'patient',
      profilePhotoUrl: null,
    },
  });

  // Create patient profile
  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      dateOfBirth: new Date('1945-03-15'),
      diagnosisDate: new Date('2023-06-01'),
      cognitiveStage: 'mild',
      preferredName: 'Maggie',
      city: 'Portland',
      timezone: 'America/Los_Angeles',
      primaryLanguage: 'en',
    },
  });

  // Create caregiver user
  const caregiverUser = await prisma.user.create({
    data: {
      email: 'nurse.sarah@example.com',
      passwordHash: await hash('demo123456', 12),
      firstName: 'Sarah',
      lastName: 'Mitchell',
      role: 'caregiver',
    },
  });

  const caregiver = await prisma.caregiver.create({
    data: {
      userId: caregiverUser.id,
      licenseNumber: 'RN-12345',
      specialty: 'Geriatric Care',
      facilityName: 'Sunrise Memory Care',
    },
  });

  await prisma.caregiverAssignment.create({
    data: {
      caregiverId: caregiver.id,
      patientId: patient.id,
      isPrimary: true,
    },
  });

  // Create family members
  const familyUser = await prisma.user.create({
    data: {
      email: 'lisa.thompson@example.com',
      passwordHash: await hash('demo123456', 12),
      firstName: 'Lisa',
      lastName: 'Thompson',
      role: 'family_member',
    },
  });

  await prisma.familyMember.create({
    data: {
      patientId: patient.id,
      userId: familyUser.id,
      displayName: 'Lisa',
      relationship: 'child',
      notes: "Margaret's eldest daughter",
    },
  });

  await prisma.familyMember.create({
    data: {
      patientId: patient.id,
      displayName: 'Robert',
      relationship: 'spouse',
      notes: "Margaret's husband of 55 years",
    },
  });

  await prisma.familyMember.create({
    data: {
      patientId: patient.id,
      displayName: 'Emma',
      relationship: 'grandchild',
      notes: "Lisa's daughter, age 12",
    },
  });

  await prisma.familyMember.create({
    data: {
      patientId: patient.id,
      displayName: 'James',
      relationship: 'child',
      notes: "Margaret's son",
    },
  });

  // Create sample session with exercise results
  const session = await prisma.session.create({
    data: {
      patientId: patient.id,
      status: 'completed',
      startedAt: new Date('2026-03-29T10:00:00Z'),
      completedAt: new Date('2026-03-29T10:06:30Z'),
      durationSeconds: 390,
      exerciseCount: 5,
      overallScore: 0.75,
    },
  });

  await prisma.exerciseResult.createMany({
    data: [
      {
        sessionId: session.id,
        exerciseType: 'orientation_date',
        domain: 'orientation',
        prompt: 'What day is today?',
        expectedAnswer: 'Saturday',
        givenAnswer: 'Saturday',
        isCorrect: true,
        responseTimeMs: 4200,
        feedbackType: 'celebrated',
        score: 1.0,
      },
      {
        sessionId: session.id,
        exerciseType: 'orientation_name',
        domain: 'orientation',
        prompt: 'What is your name?',
        expectedAnswer: 'Margaret',
        givenAnswer: 'Maggie',
        isCorrect: true,
        responseTimeMs: 2100,
        feedbackType: 'celebrated',
        score: 1.0,
      },
      {
        sessionId: session.id,
        exerciseType: 'orientation_location',
        domain: 'orientation',
        prompt: 'What city are we in?',
        expectedAnswer: 'Portland',
        givenAnswer: 'Seattle',
        isCorrect: false,
        responseTimeMs: 8500,
        feedbackType: 'guided',
        score: 0.3,
      },
      {
        sessionId: session.id,
        exerciseType: 'identity_recognition',
        domain: 'identity',
        prompt: 'Who is this person?',
        expectedAnswer: 'Lisa',
        givenAnswer: 'Lisa',
        isCorrect: true,
        responseTimeMs: 3200,
        feedbackType: 'celebrated',
        score: 1.0,
      },
      {
        sessionId: session.id,
        exerciseType: 'memory_category',
        domain: 'memory',
        prompt: 'Name three fruits',
        expectedAnswer: 'apple, banana, orange',
        givenAnswer: 'apple, banana',
        isCorrect: false,
        responseTimeMs: 12000,
        feedbackType: 'supported',
        score: 0.5,
      },
    ],
  });

  await prisma.cognitiveScore.create({
    data: {
      patientId: patient.id,
      sessionId: session.id,
      overallScore: 0.75,
      orientationScore: 0.77,
      identityScore: 1.0,
      memoryScore: 0.5,
      languageScore: 0,
      executiveFunctionScore: 0,
      attentionScore: 0,
    },
  });

  // Create sample memories
  await prisma.memory.create({
    data: {
      patientId: patient.id,
      type: 'story',
      title: 'Our Wedding Day',
      description: 'Margaret tells the story of her wedding to Robert in 1968.',
      isFavorite: true,
      recordedAt: new Date('2026-03-20'),
      tags: {
        create: [{ tag: 'wedding' }, { tag: 'robert' }, { tag: 'family' }],
      },
    },
  });

  await prisma.memory.create({
    data: {
      patientId: patient.id,
      type: 'story',
      title: 'First Day Teaching',
      description: 'Margaret recalls her first day as a schoolteacher in 1970.',
      isFavorite: false,
      recordedAt: new Date('2026-03-22'),
      tags: {
        create: [{ tag: 'career' }, { tag: 'teaching' }],
      },
    },
  });

  // Create clinician user
  await prisma.user.create({
    data: {
      email: 'dr.chen@example.com',
      passwordHash: await hash('demo123456', 12),
      firstName: 'David',
      lastName: 'Chen',
      role: 'clinician',
    },
  });

  console.log('Seed complete!');
  console.log(`  Patient: ${patientUser.email} / demo123456`);
  console.log(`  Caregiver: ${caregiverUser.email} / demo123456`);
  console.log(`  Family: ${familyUser.email} / demo123456`);
  console.log(`  Clinician: dr.chen@example.com / demo123456`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
