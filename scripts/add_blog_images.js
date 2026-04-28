const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const images = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&q=80",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    "https://images.unsplash.com/photo-1571260899304-4250701120f6?w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
];

async function main() {
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Found ${articles.length} articles.`);

    for (let i = 0; i < articles.length; i++) {
        const img = images[i % images.length];
        await prisma.article.update({
            where: { id: articles[i].id },
            data: { coverImage: img }
        });
        console.log(`Updated article ${i+1}: ${articles[i].title} with image.`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
