const express = require("express");
const app = express();
const { Pool } = require("pg");
const cors = require("cors");

const db = new Pool({
  host: "dpg-ckqrbvg5vl2c7395ck20-a.oregon-postgres.render.com",
  user: "gabcatani",
  password: "rZzL8V1ozBaAxs1SkymzAaE1Mj2vNN7z",
  database: "crudgames",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

// Criar tabela se ela não existir
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    cost FLOAT,
    category VARCHAR(255)
  )
`;

db.query(createTableQuery)
  .then(() => {
    console.log("Table created or already exists");
  })
  .catch((err) => {
    console.log("Error creating table: ", err);
  });

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { name, cost, category } = req.body;
  const sql = "INSERT INTO games (name, cost, category) VALUES ($1, $2, $3)";
  await db.query(sql, [name, cost, category]);
  res.send("Inserted");
});

app.post("/search", async (req, res) => {
  const { name, cost, category } = req.body;
  const sql = "SELECT * FROM games WHERE name = $1 AND cost = $2 AND category = $3";
  const result = await db.query(sql, [name, cost, category]);
  res.send(result.rows);
});

app.get("/getCards", async (req, res) => {
  const sql = "SELECT * FROM games";
  const result = await db.query(sql);
  res.send(result.rows);
});

app.put("/edit", async (req, res) => {
  const { id, name, cost, category } = req.body;
  const sql = "UPDATE games SET name = $1, cost = $2, category = $3 WHERE id = $4";
  await db.query(sql, [name, cost, category, id]);
  res.send("Updated");
});

app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM games WHERE id = $1";
  await db.query(sql, [id]);
  res.send("Deleted");
});

app.listen(3001, () => {
  console.log("Running on port 3001");
});
