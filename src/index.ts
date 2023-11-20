import { Elysia, t } from "elysia";
import { book } from "./routes/book.route";
import { swagger } from "@elysiajs/swagger";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { auth } from "./routes/author.route";
import { articles } from "./routes/article.route";

const app = new Elysia();
app.group("/api", (app) => app.use(book));
app.group("/api", (app) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: Bun.env.JWT_SECRET!,
      })
    )
    .use(cookie())
    .use(auth)
    .use(articles)
);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
