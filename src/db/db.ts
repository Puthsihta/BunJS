import { Database } from "bun:sqlite";

export interface Book {
  id?: number;
  name: string;
  author: string;
}

export class BooksDatabase {
  private db: Database;

  constructor() {
    this.db = new Database("books.db");
    // Initialize the database
    this.init()
      .then(() => console.log("Database initialized"))
      .catch(console.error);
  }

  // Get all books
  async getBooks() {
    return {
      message: true,
      data: this.db.query("SELECT * FROM books").all(),
    };
  }

  async getBooksByID(id: number) {
    const data = await this.db
      .query(`SELECT * FROM books WHERE id = ${id}`)
      .all()[0];
    if (data) {
      return {
        success: true,
        data: data,
      };
    } else {
      return {
        success: true,
        data: null,
      };
    }
  }

  // Add a book
  async addBook(book: Book) {
    // q: Get id type safely
    return this.db
      .query(`INSERT INTO books (name, author) VALUES (?, ?) RETURNING id`)
      .get(book.name, book.author) as Book;
  }

  // Update a book
  async updateBook(id: number, book: Book) {
    return this.db.run(
      `UPDATE books SET name = '${book.name}', author = '${book.author}' WHERE id = ${id}`
    );
  }

  // Delete a book
  async deleteBook(id: number) {
    return this.db.run(`DELETE FROM books WHERE id = ${id}`);
  }

  // Initialize the database
  async init() {
    return this.db.run(
      "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, author TEXT)"
    );
  }
}
