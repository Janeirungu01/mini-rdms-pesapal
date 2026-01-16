const database = {};

function createTable(name, columns) {
  if (database[name]) throw new Error("Table already exists");

  database[name] = {
    columns,
    rows: [],
    indexes: {}
  };
}

function insertRow(table, row) {
  database[table].rows.push(row);
}

function selectAll(table) {
  return database[table].rows;
}

module.exports = {
  createTable,
  insertRow,
  selectAll,
  database
};
