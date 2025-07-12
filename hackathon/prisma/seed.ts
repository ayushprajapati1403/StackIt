// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
	const tags = ['React', 'JWT', 'Next.js', 'Prisma', 'Tailwind']
	for (const name of tags) {
		await prisma.tag.upsert({
			where: { name },
			update: {},
			create: { name },
		})
	}
}
main().finally(() => prisma.$disconnect())
