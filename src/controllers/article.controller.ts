import { prisma } from "../libs/prisma";

const getArticle = async ({ body }: any) => {
  const { page, limit } = body;
  const articles = await prisma.article.findMany();
  return {
    success: true,
    message: "Fetch articles",
    data: {
      articles,
    },
  };
};

const createArticle = async ({ body, user }: any) => {
  console.log("user!.id : ", user);
  const article = await prisma.article.create({
    data: {
      authorId: user!.id,
      ...body,
    },
  });

  return {
    success: true,
    message: "Article created",
    data: {
      article,
    },
  };
};

export { getArticle, createArticle };
