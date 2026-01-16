const readline = require("readline");
const parse = require("./parser");
const { createTable, insertRow, selectAll } = require("./engine");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function execute(sql) {
  const parsed = parse(sql);

  if (parsed.type === "CREATE") {
    // Example: CREATE TABLE users
    const name = sql.split(" ")[2];
    createTable(name, {});
    console.log(`Table ${name} created`);
  }

  if (parsed.type === "SELECT") {
    const table = sql.split(" ")[3];
    console.log(selectAll(table));
  }
}

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
