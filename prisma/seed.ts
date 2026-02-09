import { PrismaClient, ResourceType, UserRole } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

// Use the same Turso/libSQL configuration as the app
function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  let url: string;
  if (tursoUrl && tursoUrl.startsWith("libsql://")) {
    url = tursoUrl;
    console.log("[Seed] Using TURSO remote database");
  } else {
    url = "file:prisma/dev.db";
    console.log("[Seed] FALLBACK to local SQLite dev.db - TURSO_DATABASE_URL was:", tursoUrl);
  }

  const adapter = new PrismaLibSql({
    url,
    authToken: tursoUrl?.startsWith("libsql://") ? authToken : undefined,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const prisma = createPrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "aminofab@gmail.com" },
    update: {},
    create: {
      email: "aminofab@gmail.com",
      name: "Admin",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create test student
  const studentPassword = await bcrypt.hash("student123", 12);
  const student = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: {
      email: "student@test.com",
      name: "Test Student",
      passwordHash: studentPassword,
      role: UserRole.STUDENT,
      yearOfStudy: 2,
      programType: "BSN",
      school: "State University School of Nursing",
    },
  });
  console.log("✅ Created test student:", student.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "fundamentals" },
      update: {},
      create: {
        name: "Fundamentals of Nursing",
        slug: "fundamentals",
        description: "Basic nursing concepts, skills, and patient care",
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "medical-surgical" },
      update: {},
      create: {
        name: "Medical-Surgical Nursing",
        slug: "medical-surgical",
        description: "Care of adult patients with acute and chronic conditions",
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "pediatrics" },
      update: {},
      create: {
        name: "Pediatric Nursing",
        slug: "pediatrics",
        description: "Care of infants, children, and adolescents",
        order: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "obstetrics" },
      update: {},
      create: {
        name: "Maternal-Newborn Nursing",
        slug: "obstetrics",
        description: "Pregnancy, labor, delivery, and postpartum care",
        order: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "mental-health" },
      update: {},
      create: {
        name: "Mental Health Nursing",
        slug: "mental-health",
        description: "Psychiatric and mental health care",
        order: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "community-health" },
      update: {},
      create: {
        name: "Community Health Nursing",
        slug: "community-health",
        description: "Public health and community-based care",
        order: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "pharmacology" },
      update: {},
      create: {
        name: "Pharmacology",
        slug: "pharmacology",
        description: "Drug therapy and medication administration",
        order: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: "nclex-prep" },
      update: {},
      create: {
        name: "NCLEX Preparation",
        slug: "nclex-prep",
        description: "NCLEX-RN and NCLEX-PN exam preparation",
        order: 8,
      },
    }),
  ]);
  console.log("✅ Created", categories.length, "categories");

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "nclex-style" },
      update: {},
      create: { name: "NCLEX Style", slug: "nclex-style" },
    }),
    prisma.tag.upsert({
      where: { slug: "clinical" },
      update: {},
      create: { name: "Clinical", slug: "clinical" },
    }),
    prisma.tag.upsert({
      where: { slug: "high-yield" },
      update: {},
      create: { name: "High Yield", slug: "high-yield" },
    }),
    prisma.tag.upsert({
      where: { slug: "beginner-friendly" },
      update: {},
      create: { name: "Beginner Friendly", slug: "beginner-friendly" },
    }),
    prisma.tag.upsert({
      where: { slug: "advanced" },
      update: {},
      create: { name: "Advanced", slug: "advanced" },
    }),
    prisma.tag.upsert({
      where: { slug: "rationales" },
      update: {},
      create: { name: "With Rationales", slug: "rationales" },
    }),
  ]);
  console.log("✅ Created", tags.length, "tags");

  // Create sample resources
  const resources = await Promise.all([
    // Study Notes
    prisma.resource.upsert({
      where: { slug: "fundamentals-nursing-notes" },
      update: {},
      create: {
        title: "Fundamentals of Nursing - Complete Study Guide",
        description:
          "Comprehensive notes covering vital signs, patient assessment, nursing process, documentation, and basic care skills. Perfect for first-year students.",
        slug: "fundamentals-nursing-notes",
        resourceType: ResourceType.NOTES,
        categoryId: categories[0].id,
        yearLevel: 1,
        difficulty: "beginner",
        fileUrl: "https://example.com/files/fundamentals.pdf",
        previewUrl: "https://example.com/previews/fundamentals.pdf",
        isPremium: false,
        downloadCount: 1245,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "medsurg-nursing-notes" },
      update: {},
      create: {
        title: "Medical-Surgical Nursing Notes",
        description:
          "Detailed notes on cardiac, respiratory, GI, renal, and neurological disorders. Includes pathophysiology, assessments, and nursing interventions.",
        slug: "medsurg-nursing-notes",
        resourceType: ResourceType.NOTES,
        categoryId: categories[1].id,
        yearLevel: 2,
        difficulty: "intermediate",
        fileUrl: "https://example.com/files/medsurg.pdf",
        isPremium: true,
        downloadCount: 892,
      },
    }),

    // Practice Exams
    prisma.resource.upsert({
      where: { slug: "nclex-fundamentals-practice" },
      update: {},
      create: {
        title: "NCLEX-Style Practice Exam: Fundamentals",
        description:
          "75 NCLEX-style questions with detailed rationales. Covers safety, infection control, basic care, and nursing process.",
        slug: "nclex-fundamentals-practice",
        resourceType: ResourceType.PRACTICE_EXAM,
        categoryId: categories[0].id,
        yearLevel: 1,
        difficulty: "intermediate",
        fileUrl: "https://example.com/files/nclex-fundamentals.pdf",
        isPremium: true,
        price: 499, // $4.99
        downloadCount: 2134,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "nclex-medsurg-practice" },
      update: {},
      create: {
        title: "NCLEX-Style Practice Exam: Med-Surg",
        description:
          "100 challenging med-surg questions with comprehensive rationales. Focus on prioritization and delegation.",
        slug: "nclex-medsurg-practice",
        resourceType: ResourceType.PRACTICE_EXAM,
        categoryId: categories[1].id,
        yearLevel: 2,
        difficulty: "advanced",
        fileUrl: "https://example.com/files/nclex-medsurg.pdf",
        isPremium: true,
        price: 499, // $4.99
        downloadCount: 1876,
      },
    }),

    // Care Plans
    prisma.resource.upsert({
      where: { slug: "pneumonia-care-plan" },
      update: {},
      create: {
        title: "Care Plan Template: Pneumonia",
        description:
          "Complete care plan with nursing diagnoses, SMART goals, evidence-based interventions, and evaluation criteria.",
        slug: "pneumonia-care-plan",
        resourceType: ResourceType.CARE_PLAN,
        categoryId: categories[1].id,
        yearLevel: 2,
        difficulty: "intermediate",
        fileUrl: "https://example.com/files/pneumonia-cp.pdf",
        isPremium: true,
        downloadCount: 678,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "diabetes-care-plan" },
      update: {},
      create: {
        title: "Care Plan Template: Diabetes Mellitus Type 2",
        description:
          "Comprehensive care plan covering blood glucose management, patient education, and complication prevention.",
        slug: "diabetes-care-plan",
        resourceType: ResourceType.CARE_PLAN,
        categoryId: categories[1].id,
        yearLevel: 2,
        difficulty: "intermediate",
        fileUrl: "https://example.com/files/diabetes-cp.pdf",
        isPremium: true,
        downloadCount: 812,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "chf-care-plan" },
      update: {},
      create: {
        title: "Care Plan Template: Heart Failure",
        description:
          "Evidence-based care plan for CHF patients including fluid management, medication teaching, and lifestyle modifications.",
        slug: "chf-care-plan",
        resourceType: ResourceType.CARE_PLAN,
        categoryId: categories[1].id,
        yearLevel: 3,
        difficulty: "advanced",
        fileUrl: "https://example.com/files/chf-cp.pdf",
        isPremium: true,
        downloadCount: 534,
      },
    }),

    // Drug Guides
    prisma.resource.upsert({
      where: { slug: "cardiac-drugs-guide" },
      update: {},
      create: {
        title: "Cardiac Medications Quick Reference",
        description:
          "Complete guide to cardiac drugs including beta blockers, ACE inhibitors, antiarrhythmics, and anticoagulants. Nursing considerations for each.",
        slug: "cardiac-drugs-guide",
        resourceType: ResourceType.DRUG_GUIDE,
        categoryId: categories[6].id,
        yearLevel: 2,
        difficulty: "intermediate",
        fileUrl: "https://example.com/files/cardiac-drugs.pdf",
        isPremium: true,
        downloadCount: 1098,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "antibiotic-guide" },
      update: {},
      create: {
        title: "Antibiotics Quick Reference Guide",
        description:
          "Essential antibiotic reference covering drug classes, spectrum of activity, common uses, and key nursing considerations.",
        slug: "antibiotic-guide",
        resourceType: ResourceType.DRUG_GUIDE,
        categoryId: categories[6].id,
        yearLevel: 1,
        difficulty: "beginner",
        fileUrl: "https://example.com/files/antibiotics.pdf",
        isPremium: false,
        downloadCount: 1523,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "dosage-calculations" },
      update: {},
      create: {
        title: "Dosage Calculations Made Easy",
        description:
          "Step-by-step guide to medication calculations including dimensional analysis, IV drip rates, and pediatric dosing.",
        slug: "dosage-calculations",
        resourceType: ResourceType.DRUG_GUIDE,
        categoryId: categories[6].id,
        yearLevel: 1,
        difficulty: "beginner",
        fileUrl: "https://example.com/files/dosage-calc.pdf",
        isPremium: true,
        downloadCount: 2341,
      },
    }),

    // NCLEX Prep
    prisma.resource.upsert({
      where: { slug: "nclex-strategies" },
      update: {},
      create: {
        title: "NCLEX Test-Taking Strategies",
        description:
          "Master the NCLEX with proven test-taking strategies. Learn to break down questions, eliminate wrong answers, and manage time effectively.",
        slug: "nclex-strategies",
        resourceType: ResourceType.NCLEX,
        categoryId: categories[7].id,
        yearLevel: 4,
        difficulty: "intermediate",
        fileUrl: "https://example.com/files/nclex-strategies.pdf",
        isPremium: false,
        downloadCount: 3456,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "nclex-prioritization" },
      update: {},
      create: {
        title: "NCLEX Prioritization & Delegation",
        description:
          "150 practice questions focused on priority, delegation, and assignment. The most challenging NCLEX topics explained.",
        slug: "nclex-prioritization",
        resourceType: ResourceType.NCLEX,
        categoryId: categories[7].id,
        yearLevel: 4,
        difficulty: "advanced",
        fileUrl: "https://example.com/files/nclex-priority.pdf",
        isPremium: true,
        downloadCount: 2789,
      },
    }),

    // Clinical Guides
    prisma.resource.upsert({
      where: { slug: "clinical-survival-guide" },
      update: {},
      create: {
        title: "Clinical Rotation Survival Guide",
        description:
          "Everything you need for clinical success: what to bring, how to prepare, documentation tips, and how to impress your instructor.",
        slug: "clinical-survival-guide",
        resourceType: ResourceType.CLINICAL,
        categoryId: categories[5].id,
        yearLevel: 1,
        difficulty: "beginner",
        fileUrl: "https://example.com/files/clinical-guide.pdf",
        isPremium: true,
        downloadCount: 1867,
      },
    }),
    prisma.resource.upsert({
      where: { slug: "head-to-toe-assessment" },
      update: {},
      create: {
        title: "Head-to-Toe Assessment Checklist",
        description:
          "Complete systematic assessment guide with normal and abnormal findings. Perfect for clinical preparation.",
        slug: "head-to-toe-assessment",
        resourceType: ResourceType.CLINICAL,
        categoryId: categories[0].id,
        yearLevel: 1,
        difficulty: "beginner",
        fileUrl: "https://example.com/files/h2t-assessment.pdf",
        isPremium: false,
        downloadCount: 4123,
      },
    }),
  ]);
  console.log("✅ Created", resources.length, "sample resources");

  // Create a sample bundle
  const bundle = await prisma.bundle.upsert({
    where: { slug: "nclex-prep-bundle" },
    update: {},
    create: {
      name: "Complete NCLEX Prep Bundle",
      slug: "nclex-prep-bundle",
      description:
        "Everything you need to prepare for the NCLEX - includes practice exams, test strategies, and high-yield review materials.",
      price: 1999, // $19.99
      isActive: true,
    },
  });
  console.log("✅ Created bundle:", bundle.name);

  // Add resources to bundle (get NCLEX-related resources)
  const nclexResources = resources.filter(
    (r) =>
      r.resourceType === ResourceType.NCLEX || r.resourceType === ResourceType.PRACTICE_EXAM
  );

  // Use individual creates for SQLite (doesn't support skipDuplicates)
  for (const r of nclexResources) {
    try {
      await prisma.bundleResource.create({
        data: {
          bundleId: bundle.id,
          resourceId: r.id,
        },
      });
    } catch {
      // Ignore duplicate errors
    }
  }
  console.log("✅ Added", nclexResources.length, "resources to bundle");

  // Create care plan bundle
  const carePlanBundle = await prisma.bundle.upsert({
    where: { slug: "care-plan-bundle" },
    update: {},
    create: {
      name: "Care Plan Template Bundle",
      slug: "care-plan-bundle",
      description:
        "Collection of ready-to-use care plan templates for common conditions. Save hours on clinical paperwork.",
      price: 999, // $9.99
      isActive: true,
    },
  });

  const carePlanResources = resources.filter(
    (r) => r.resourceType === ResourceType.CARE_PLAN
  );

  // Use individual creates for SQLite (doesn't support skipDuplicates)
  for (const r of carePlanResources) {
    try {
      await prisma.bundleResource.create({
        data: {
          bundleId: carePlanBundle.id,
          resourceId: r.id,
        },
      });
    } catch {
      // Ignore duplicate errors
    }
  }
  console.log("✅ Created care plan bundle with", carePlanResources.length, "resources");

  console.log("🎉 Database seeding completed!");
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
