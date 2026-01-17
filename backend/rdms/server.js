const express = require("express");
const cors = require("cors");
const parse = require("./parser");
const { createTable, insertRow, selectAll, updateRows, deleteRows } = require("./engine");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------- COLUMN PARSER ---------- */
function parseColumns(definition) {
  const cols = {};
  const parts = definition.split(",");

  parts.forEach(p => {
    const tokens = p.trim().split(" ");
    const name = tokens[0];
    const type = tokens[1];

    cols[name] = {
      type,
      primary: tokens.includes("PRIMARY"),
      unique: tokens.includes("UNIQUE")
    };
  });

  return cols;
}

/* ---------- QUERY ENDPOINT ---------- */
app.post("/query", (req, res) => {
  let { sql } = req.body;
  sql = sql.trim();

  try {
    const parsed = parse(sql);

    /* ---------- CREATE TABLE ---------- */
    if (parsed.type === "CREATE") {
      const name = sql.split(" ")[2];

      // extract columns inside parentheses
      const inside = sql.substring(sql.indexOf("(") + 1, sql.lastIndexOf(")"));
      const columns = parseColumns(inside);

      createTable(name, columns);
      return res.json({ success: true });
    }

    /* ---------- SELECT ---------- */
    if (parsed.type === "SELECT") {
      const table = sql.split(" ")[3];
      const data = selectAll(table);
      return res.json({ success: true, data });
    }

    /* ---------- INSERT ---------- */
    if (parsed.type === "INSERT") {
      const table = sql.split(" ")[2];

      // extract values inside parentheses
      const inside = sql.substring(sql.indexOf("(") + 1, sql.lastIndexOf(")"));
      const values = inside.split(",").map(v => v.trim().replace(/"/g, ""));
      insertRow(table, values);

      return res.json({ success: true });
    }

    /* ---------- UPDATE ---------- */
    if (parsed.type === "UPDATE") {
      const table = sql.split(" ")[1];
      const setPart = sql.split("SET")[1].split("WHERE")[0].trim();
      const wherePart = sql.split("WHERE")[1].trim();

      const [col, val] = setPart.split("=");
      const [wCol, wVal] = wherePart.split("=");

      updateRows(
        table,
        col.trim(),
        val.replace(/"/g, "").trim(),
        wCol.trim(),
        wVal.trim()
      );

      return res.json({ success: true });
    }

    /* ---------- DELETE ---------- */
    if (parsed.type === "DELETE") {
      const table = sql.split(" ")[2];
      const where = sql.split("WHERE")[1].trim();
      const [col, val] = where.split("=");

      deleteRows(table, col.trim(), val.replace(/"/g, "").trim());
      return res.json({ success: true });
    }

    return res.status(400).json({ error: "Unsupported query type" });

  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

/* ---------- SERVER ---------- */
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
