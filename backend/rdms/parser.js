function parse(sql) {
  sql = sql.trim();
  const upper = sql.toUpperCase();

  if (upper.startsWith("CREATE TABLE")) return { type: "CREATE", sql };
  if (upper.startsWith("INSERT INTO")) return { type: "INSERT", sql };
  if (upper.startsWith("SELECT")) return { type: "SELECT", sql };
  if (upper.startsWith("UPDATE")) return { type: "UPDATE", sql };
  if (upper.startsWith("DELETE")) return { type: "DELETE", sql };

  throw new Error("Unsupported query type");
}

module.exports = parse;
