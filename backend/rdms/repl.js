const readline = require("readline");
const parse = require("./parser");
const { createTable, insertRow, selectAll, database } = require("./engine");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* ---------- STEP 1.3: COLUMN PARSER ---------- */
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

/* ---------- QUERY EXECUTION ---------- */
function execute(sql) {
  const parsed = parse(sql);

  /* ---------- CREATE TABLE ---------- */
  if (parsed.type === "CREATE") {
    const name = sql.split(" ")[2];
    const inside = sql.substring(sql.indexOf("(") + 1, sql.lastIndexOf(")"));
    const columns = parseColumns(inside);

    createTable(name, columns);
    console.log(`Table ${name} created`);
    return;
  }

  /* ---------- INSERT ---------- */
  if (parsed.type === "INSERT") {
    const table = sql.split(" ")[2];

    if (!database[table]) {
      console.error(`Table "${table}" does not exist. CREATE it first.`);
      return;
    }

    // Extract values inside parentheses
    const inside = sql.substring(sql.indexOf("(") + 1, sql.lastIndexOf(")"));
    const values = inside.split(",").map(v => {
      v = v.trim();
      // Remove surrounding quotes if it's a string
      if (v.startsWith('"') && v.endsWith('"')) {
        return v.slice(1, -1);
      }
      return v; // numbers stay as strings for now
    });

    insertRow(table, values);
    console.log("Row inserted");
    return;
  }

  /* ---------- SELECT ---------- */
  if (parsed.type === "SELECT") {
    const table = sql.split(" ")[3];

    if (!database[table]) {
      console.error(`Table "${table}" does not exist.`);
      return;
    }

    console.log(selectAll(table));
    return;
  }

  console.error("Unsupported query type");
}

/* ---------- REPL LOOP ---------- */
function start() {
  rl.question("db> ", (input) => {
    try {
      execute(input);
    } catch (e) {
      console.error(e.message);
    }
    start();
  });
}

start();
