export const userTable = async (db) => {
  await db.none(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullname VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `);
};

export const allUsers = async (db) => {
  return db.any("SELECT * FROM users");
};

export const addUser = async (db, { fullname, email, password }) => {
  return db.one(
    "INSERT INTO users(fullname, email, password) VALUES($1, $2, $3) RETURNING *",
    [fullname, email, password]
  );
};
