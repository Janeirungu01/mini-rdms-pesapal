function parse(sql) {
  sql = sql.trim();

  if (sql.startsWith("CREATE TABLE")) {
    return { type: "CREATE", sql };
  }

  if (sql.startsWith("INSERT INTO")) {
    return { type: "INSERT", sql };
  }

  if (sql.startsWith("SELECT")) {
    return { type: "SELECT", sql };
  }

  throw new Error("Unsupported query");
}

module.exports = parse;
