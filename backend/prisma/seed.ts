import { PrismaClient, Role, TechCategory, SkillCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Database seeding işlemi başlatılıyor...');

  // Var olan verileri temizle (Sıralama Foreign Key ilişkilerine dikkat ederek yapıldı)
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();

  // 1. Admin Kullanıcısı Oluşturma
  const defaultPassword = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@portfolio.dev',
      name: 'Senior Admin',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin kullanıcısı oluşturuldu: ${admin.email}`);

  // 2. Temel Teknolojileri Oluşturma
  const react = await prisma.technology.create({
    data: { name: 'React', category: TechCategory.FRONTEND },
  });
  const nodejs = await prisma.technology.create({
    data: { name: 'Node.js', category: TechCategory.BACKEND },
  });
  const postgres = await prisma.technology.create({
    data: { name: 'PostgreSQL', category: TechCategory.DATABASE },
  });
  const typescript = await prisma.technology.create({
    data: { name: 'TypeScript', category: TechCategory.FRONTEND },
  });
  console.log('✅ Teknolojiler oluşturuldu.');

  // 3. Örnek Proje ve N:M İlişkisi Oluşturma
  const sampleProject = await prisma.project.create({
    data: {
      title: 'Full-Stack Developer Portfolio',
      slug: 'full-stack-developer-portfolio',
      description: 'Next.js, Node.js, Express ve PostgreSQL mimarisi ile hazırlanmış yönetim panelli portfolyo projesi.',
      content: 'Bu proje production standartlarında temiz mimari ve type-safety gözetilerek geliştirilmiştir.',
      isFeatured: true,
      order: 1,
      githubUrl: 'https://github.com/example/portfolio',
      liveUrl: 'https://portfolio.dev',
      // Join table (ProjectTechnology) üzerinden N:M ilişkiyi Prisma nested create ile kuruyoruz
      technologies: {
        create: [
          { technologyId: react.id },
          { technologyId: nodejs.id },
          { technologyId: postgres.id },
          { technologyId: typescript.id },
        ],
      },
    },
  });
  console.log(`✅ Örnek proje ve teknoloji bağları oluşturuldu: ${sampleProject.title}`);

  // 4. Örnek Yetenekler (Skills)
  await prisma.skill.createMany({
    data: [
      { name: 'TypeScript', level: 90, category: SkillCategory.FRONTEND, order: 1 },
      { name: 'Node.js / Express', level: 85, category: SkillCategory.BACKEND, order: 2 },
      { name: 'PostgreSQL & Prisma', level: 80, category: SkillCategory.BACKEND, order: 3 },
    ],
  });
  console.log('✅ Örnek yetenekler oluşturuldu.');

  console.log('🚀 Seeding başarıyla tamamlandı!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });