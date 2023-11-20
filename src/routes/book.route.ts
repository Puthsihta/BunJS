import Elysia, { t } from "elysia";
import {
  createBook,
  deleteBook,
  getBook,
  getBookById,
  updateBook,
} from "../controllers/book.controller";
import { html } from "@elysiajs/html";
import { BooksDatabase } from "../db/db";

export const book = (app: Elysia) =>
  app.group("/books", (app) =>
    app
      .decorate("db", new BooksDatabase())
      .use(html())
      .get("/", () => Bun.file("index.html").text())
      .get("/script.js", () => Bun.file("script.js").text())
      .get("/", getBook)
      .get("/:id", getBookById)
      .post("/", createBook)
      .put("/:id", updateBook)
      .delete("/:id", deleteBook)
  );
