const database = {};

function createTable(name, columns) {
  if (database[name]) throw new Error("Table already exists");

  database[name] = {
    columns,   // {colName: {type, primary, unique}}
    rows: [],
    indexes: {}
  };
}

function insertRow(tableName, values) {
  const table = database[tableName];
  if (!table) throw new Error(`Table ${tableName} does not exist`);

  const row = {};
  const cols = Object.keys(table.columns);

  if (values.length !== cols.length) {
    throw new Error("Column count does not match value count");
  }

  cols.forEach((col, i) => {
    row[col] = values[i];
  });

  // Primary key check
  cols.forEach(col => {
    if (table.columns[col].primary) {
      if (table.rows.some(r => r[col] === row[col])) {
        throw new Error("Primary key violation");
      }
    }
  });

  // Unique check
  cols.forEach(col => {
    if (table.columns[col].unique) {
      if (table.rows.some(r => r[col] === row[col])) {
        throw new Error("Unique constraint violation");
      }
    }
  });

  table.rows.push(row);
}

function selectAll(tableName) {
  const table = database[tableName];
  if (!table) throw new Error(`Table ${tableName} does not exist`);
  return table.rows;
}

// export ALL functions
module.exports = {
  createTable,
  insertRow,
  selectAll,
  database
};
