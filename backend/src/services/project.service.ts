import { prisma } from '../config/db.js';
import { CreateProjectInput, UpdateProjectInput } from '../schemas/project.schema.js';
import { AppError } from '../utils/appError.js';

export const getAllProjectsService = async (isFeatured?: boolean) => {
  return prisma.project.findMany({
    where: isFeatured !== undefined ? { isFeatured } : undefined,
    orderBy: { order: 'asc' },
    include: {
      technologies: {
        include: {
          technology: true, // Join tablosu üzerinden asıl teknolojileri çekiyoruz
        },
      },
    },
  });
};

export const getProjectBySlugService = async (slug: string) => {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { technologies: { include: { technology: true } } },
  });

  if (!project) throw new AppError('Proje bulunamadı.', 404);
  return project;
};

export const createProjectService = async (input: CreateProjectInput) => {
  const { technologyIds, ...projectData } = input;

  // Aynı slug var mı kontrolü
  const existing = await prisma.project.findUnique({ where: { slug: projectData.slug } });
  if (existing) throw new AppError('Bu slug zaten kullanılıyor.', 409);

  return prisma.project.create({
    data: {
      ...projectData,
      technologies: {
        create: technologyIds?.map((id) => ({ technologyId: id })) || [],
      },
    },
    include: { technologies: true },
  });
};

export const updateProjectService = async (id: string, input: UpdateProjectInput) => {
  const { technologyIds, ...projectData } = input;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError('Proje bulunamadı.', 404);

  return prisma.project.update({
    where: { id },
    data: {
      ...projectData,
      // Eğer yeni teknolojiler gönderildiyse, öncekileri sil ve yenilerini bağla
      ...(technologyIds !== undefined && {
        technologies: {
          deleteMany: {},
          create: technologyIds.map((techId) => ({ technologyId: techId })),
        },
      }),
    },
  });
};

export const deleteProjectService = async (id: string) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new AppError('Proje bulunamadı.', 404);

  // CASCADE ayarlı olduğu için bağlı ProjectTechnology kayıtları da otomatik silinir
  await prisma.project.delete({ where: { id } });
};