import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@prime.ci" },
  });

  if (!admin) {
    console.error("Admin user not found. Please run seed.ts first.");
    return;
  }

  const articles = [
    {
      title: "L'importance de l'anglais dans le milieu professionnel ivoirien",
      slug: "importance-anglais-professionnel-ivoirien",
      content: "Dans un monde de plus en plus globalisé, la maîtrise de l'anglais n'est plus une option mais une nécessité pour les professionnels en Côte d'Ivoire. Que ce soit pour négocier des contrats internationaux ou accéder à des ressources techniques de pointe, l'anglais ouvre des portes jusque-là fermées.\n\nChez Prime Language Academy, nous comprenons ces enjeux et adaptons notre formation pour répondre aux besoins spécifiques du marché local.",
      category: "CARRIÈRE",
      published: true,
      authorId: admin.id,
    },
    {
      title: "Comment la méthode ISO+ accélère votre apprentissage",
      slug: "methode-iso-apprentissage-accelere",
      content: "La méthode ISO+ (Input, Structure, Output, Automatisation) est au cœur de notre pédagogie. Contrairement aux méthodes traditionnelles qui se concentrent sur la théorie, ISO+ privilégie l'immersion et la pratique immédiate.\n\nDécouvrez comment nous transformons votre compréhension passive en une capacité d'expression fluide en seulement 02 mois.",
      category: "MÉTHODOLOGIE",
      published: true,
      authorId: admin.id,
    },
    {
      title: "3 astuces pour pratiquer l'anglais au quotidien à Abidjan",
      slug: "astuces-pratique-anglais-abidjan",
      content: "Vivre dans une ville francophone ne doit pas être un frein à votre progression. Entre les meetups, les podcasts et les échanges avec la communauté anglophone de plus en plus présente, les opportunités ne manquent pas.\n\nVoici notre sélection des meilleurs endroits et applications pour ne jamais perdre le fil.",
      category: "CONSEILS",
      published: true,
      authorId: admin.id,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }

  console.log("Articles seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
