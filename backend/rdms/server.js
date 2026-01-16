const express = require("express");
const cors = require("cors");
const parse = require("./parser");
const { createTable, insertRow, selectAll } = require("./engine");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/query", (req, res) => {
  const { sql } = req.body;

  try {
    const parsed = parse(sql);

    if (parsed.type === "CREATE") {
      const name = sql.split(" ")[2];
      createTable(name, {});
      return res.json({ success: true });
    }

    if (parsed.type === "SELECT") {
      const table = sql.split(" ")[3];
      const data = selectAll(table);
      return res.json({ success: true, data });
    }

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
