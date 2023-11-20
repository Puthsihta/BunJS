const getBook = ({ db }: any) => {
  return db.getBooks();
};

const getBookById = ({ db, params }: any) => {
  try {
    return db.getBooksByID(parseInt(params.id));
  } catch (e) {
    return { success: false };
  }
};

const createBook = async ({ db, body }: any) => {
  const id = (await db.addBook(body)).id;
  return {
    success: true,
    data: {
      id,
      name: body.name,
      author: body.author,
    },
  };
};

const updateBook = ({ db, params, body }: any) => {
  try {
    db.updateBook(parseInt(params.id), body);
    return {
      success: true,
      message: "Updated Book Successfully",
      data: {
        id: parseInt(params.id),
        name: body.name,
        author: body.author,
      },
    };
  } catch (e) {
    return { success: false };
  }
};

const deleteBook = ({ db, params }: any) => {
  try {
    db.deleteBook(parseInt(params.id));
    return { success: true, message: "Deleted Book Successfully" };
  } catch (e) {
    return { success: false };
  }
};

export { getBook, getBookById, createBook, updateBook, deleteBook };
