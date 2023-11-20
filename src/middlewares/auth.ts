import { Elysia } from "elysia";
import { prisma } from "../libs/prisma";
import { mergeLifeCycle } from "elysia/dist/utils";
import { setDefaultAutoSelectFamily } from "net";

export const isAuthenticated = (app: Elysia) =>
  // @ts-ignore
  app.derive(async ({ cookie, jwt, set }) => {
    if (!cookie!.access_token) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    // console.log("userId : ", cookie!.access_token);
    const { userId } = await jwt.verify(cookie!.access_token);

    if (!userId) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const user = await prisma.author.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
    return {
      user,
    };
  });
