const fs = require("fs");
const csv = require("csv-parser");
const readline = require("readline");

// Create an interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function generateSqlFromCsv(csvFilePath, tableName, outputFilePath) {
  const sqlStatements = [];
  const columns = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("headers", (headerRow) => {
      // Capture column names from the first row (CSV header)
      headerRow.forEach((col) => columns.push(col));
    })
    .on("data", (row) => {
      // For each row, generate an SQL INSERT statement
      const values = columns.map((col) => `'${row[col]}'`).join(", ");
      const sql = `INSERT INTO "${tableName}" (${columns.join(
        ", "
      )}) VALUES (${values});`;
      sqlStatements.push(sql);
    })
    .on("end", () => {
      // Once all rows are processed, write the SQL statements to a file
      const sqlOutput = sqlStatements.join("\n");
      fs.writeFile(outputFilePath, sqlOutput, (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log(`SQL statements have been written to ${outputFilePath}`);
        }
      });
    })
    .on("error", (err) => {
      console.error("Error reading CSV file:", err);
    });
}

// Prompt the user for the CSV file path, table name, and output file path
rl.question("Enter the path to your CSV file: ", (csvFilePath) => {
  rl.question("Enter the name of the table: ", (tableName) => {
    rl.question(
      "Enter the path for the output SQL file (e.g., output.sql): ",
      (outputFilePath) => {
        generateSqlFromCsv(csvFilePath, tableName, outputFilePath);
        rl.close();
      }
    );
  });
});
