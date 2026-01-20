const database = {};

/* ---------- CREATE TABLE ---------- */
function createTable(name, columns) {
  if (database[name]) throw new Error("Table already exists");

  database[name] = {
    columns,   // { colName: { type, primary, unique } }
    rows: [],
    indexes: {}
  };
}

/* ---------- INSERT ---------- */
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

  // Unique constraint check
  cols.forEach(col => {
    if (table.columns[col].unique) {
      if (table.rows.some(r => r[col] === row[col])) {
        throw new Error("Unique constraint violation");
      }
    }
  });

  table.rows.push(row);
}

/* ---------- SELECT ---------- */
function selectAll(tableName) {
  const table = database[tableName];
  if (!table) throw new Error(`Table ${tableName} does not exist`);
  return table.rows;
}

/* ---------- UPDATE ---------- */
function updateRows(tableName, setCol, setVal, whereCol, whereVal) {
  const table = database[tableName];
  if (!table) throw new Error(`Table ${tableName} does not exist`);

  let updated = 0;

  table.rows.forEach(row => {
    if (String(row[whereCol]) === String(whereVal)) {
      row[setCol] = setVal;
      updated++;
    }
  });

  if (updated === 0) {
    throw new Error("No rows matched UPDATE condition");
  }
}

/* ---------- DELETE ---------- */
function deleteRows(tableName, whereCol, whereVal) {
  const table = database[tableName];
  if (!table) throw new Error(`Table ${tableName} does not exist`);

  const before = table.rows.length;

  table.rows = table.rows.filter(
    row => String(row[whereCol]) !== String(whereVal)
  );

  if (before === table.rows.length) {
    throw new Error("No rows matched DELETE condition");
  }
}

/* ---------- EXPORTS ---------- */
module.exports = {
  createTable,
  insertRow,
  selectAll,
  updateRows,
  deleteRows,
  database
};