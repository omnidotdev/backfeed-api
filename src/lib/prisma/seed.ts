import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const user = await prisma.user.upsert({
    where: { walletAddress: "0xauthor" },
    update: {},
    create: {
      walletAddress: "0xauthor",
    },
  });

  await prisma.organization.upsert({
    where: { name: "Anima Reflection" },
    update: {},
    create: {
      name: "Anima Reflection",
      slug: "animareflection",
      projects: {
        create: {
          name: "MirageSwap",
          slug: "mirageswap",
          description:
            "MirageSwap is a multichain, gas-efficient automated market maker for ERC-721s that aggregates liquidity across the NFT ecosystem.",
          image: "/img/mirageswap.png",
          posts: {
            createMany: {
              data: [
                {
                  title: "Make a button",
                  description: "Make a red button",
                  authorId: user.id,
                },
                {
                  title: "Make a theme switcher",
                  description:
                    "Make a theme switcher button that allows switching between light and dark mode",
                  authorId: user.id,
                },
              ],
            },
          },
        },
      },
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
