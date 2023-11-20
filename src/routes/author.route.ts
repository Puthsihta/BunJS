import { Elysia, t } from "elysia";
import { isAuthenticated } from "../middlewares/auth";
import { login, signUp } from "../controllers/author.controller";
export const auth = (app: Elysia) =>
  app.group("/auth", (app) =>
    app
      .post("/signup", signUp)
      .post(
        "/login",
        // @ts-ignore
        login
      )
      .use(isAuthenticated)
      // protected route
      .get("/profile", ({ user }) => {
        return {
          success: true,
          message: "Fetch authenticated user details",
          data: {
            user,
          },
        };
      })
  );
