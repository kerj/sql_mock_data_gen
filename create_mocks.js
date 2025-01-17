const { faker } = require("@faker-js/faker");
const createCsv = require("csv-writer").createObjectCsvStringifier;
const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");
//  Add more types from faker if needed
//     [K: string]: 'first_name' | 'last_name' | 'email' | 'address' | 'phone' | 'date' | 'id' | 'random_date' | 'finance' | 'number' | 'bird'

// DB table column name should be the object keys, values are the datatype.
const create_mocks = (obj, length = 1, foreignKeyValues = []) => {
  // fk values are split into an object of arrays { fk1: [fk1], fk2: [fk2], fk3:[fk3] }
  let mocks = [];
  for (let i = 0; i < length; i++) {
    let mockObj = {};
    for (let key in obj) {
      switch (obj[key]) {
        case "first_name":
          mockObj[key] = faker.name.firstName();
          break;
        case "last_name":
          mockObj[key] = faker.name.lastName();
          break;
        case "email":
          mockObj[key] = faker.internet.email();
          break;
        case "address":
          mockObj[key] = faker.address.streetAddress();
          break;
        case "phone":
          mockObj[key] = faker.phone.number();
          break;
        case "date":
          mockObj[key] = faker.date.recent().toISOString().split("T")[0];
          break;
        case "id":
          mockObj[key] = faker.datatype.uuid();
          break;
        case "random_date":
          mockObj[key] = faker.date.birthdate().toISOString().split("T")[0];
          break;
        case "finance":
          mockObj[key] = faker.finance.amount(0, 15000);
          break;
        case "number":
          mockObj[key] = parseInt(faker.random.numeric());
          break;
        case "bird": // fun but it can add an ' to some of the values that will break some insert statements 
          mockObj[key] = faker.animal.bird();
          break;
        case "FK1":
          // if more than one, use a random value
          mockObj[key] =
            foreignKeyValues["fk1"][
              Math.floor(Math.random() * foreignKeyValues["fk1"].length)
            ];
          break;
        case "FK2":
          // if more than one, use a random value
          mockObj[key] =
            foreignKeyValues["fk2"][
              Math.floor(Math.random() * foreignKeyValues["fk2"].length)
            ];
          break;
        case "FK3":
          // if more than one, use a random value
          mockObj[key] =
            foreignKeyValues["fk3"][
              Math.floor(Math.random() * foreignKeyValues["fk3"].length)
            ];
          break;
        default:
          mockObj[key] = obj[key];
          break;
      }
    }
    mocks.push(mockObj);
  }
  return mocks;
};

const csvFromArray = (array) => {
  const header = Object.keys(array[0]);
  const csvStringifier = createCsv({
    header,
    separator: ",",
  });

  return (
    header.join(",") +
    "\n" +
    array.map((row) => csvStringifier.stringifyRecords([row])).join("")
  );
};

const outputGeneratedCsv = (obj, outputName = "output", rows = 1, fks = []) => {
  const mocks = create_mocks(obj, rows, fks);
  const csv = csvFromArray(mocks);

  const filePath = path.join(__dirname, `${outputName}.csv`);
  fs.writeFile(filePath, csv, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`File created at ${filePath}`);
    }
  });

  const parsedArrayData = Papa.parse(csv).data;
  return parsedArrayData;
};

// run the outputGeneratedCsv, open the file in Gsheets,
// copy the values from the column that should be used as the FK
// run the outputGeneratedCSV again but include the values copied
// your new sheet will contain a reference to those values in the FK defined column in the object you pass in.

const getValuesFromTableColumn = (table, columnNumber) => {
  return table.reduce((acc, row, i) => {
    return i === 0 || !row[columnNumber] ? acc : [...acc, row[columnNumber]];
  }, []);
};

module.exports = {
  outputGeneratedCsv,
  getValuesFromTableColumn,
};

/**
 * 1. Define each table as an object using the available data types as the value in each kvp.
 *
 * 2. if you need to reference values in another table you may store those values using getValuesFromTableColumn
 * then stating the column you want to store the values from using its numbered position in the object
 *
 * 3. go through each step for the each table, up to 3 foreign keys are supported by default
 *
 * to use a foreign key the value in the table object should be set to one of the following:
 *  "FK1" | "FK2" | "FK3"
 *
 * then when using the outputGeneratedCsv function you pass the values for the foreign key in the 4th arguement like:
 *
 *  { fk1: [], fk2: [], fk3: [] }
 *
 * You may use any values you like here, for example maybe its not a foreign key you want to define, but a more * * specific set of values to choose from like ['red light', 'yellow light', 'green light']
 *
 * 4. after completing the set up and running each function and storing the values to be used later for references
 * each csv is out put to then be copied into a db or uploaded to google sheets
 */

// ~~~ EXAMPLE ~~~
// objects for building the test app DB
// const employees = {
//   employee_id: "id", // [PK]
//   start_date: "random_date"
// }

// const employeeTableValues = outputGeneratedCsv(employees, 'employees', 10);
// const employeeIds = getValuesFromTableColumn(employeeTableValues, 0)

// const customers = {
//   customer_id: "id", // [PK]
//   email_address: "email",
//   first_name: "first_name",
//   last_name: "last_name",
// }

// const customerTableValues = outputGeneratedCsv(customers, 'customers', 1000);
// const customerIds = getValuesFromTableColumn(customerTableValues, 0)

// const inventory = {
//   "item_id": "id", // [PK],
//   "quantity": "number",
//   "supplier": 'last_name',
//   "unit_price": "finance",
//   "upc": "id",
//   "brand": "first_name",
//   "category": "FK1", // category ['bike', 'accessory', 'parts']
//   "model": "bird",
//   "sku": "id",
//   "msrp": "finance",
// }

// const inventoryTableValues = outputGeneratedCsv(inventory, 'inventory', 1000, { fk1: ['bike', 'accessory', 'parts'] })
// const itemIds = getValuesFromTableColumn(inventoryTableValues, 0)

// const sale_transactions = {
//   transaction_id: "id", // [PK]
//   transaction_date: "date",
//   employee_id: "FK1", // include output on emplyee_id from employee,
//   net_amount: "finance",
//   profit: "finance",
//   item_count: "number",
//   customer_id: 'FK2' // include the output customer_id from customers,
// }

// const saleTTableValues = outputGeneratedCsv(sale_transactions, 'sts', 1500, { fk1: employeeIds, fk2: customerIds })
// const tIds = getValuesFromTableColumn(saleTTableValues, 0)

// const sold_items = {
//   transaction_id: "FK1", // include the output transaction_id from sale_transactions
//   item_id: "FK2", // include the output item_id from inventory
//   // sold_item_count: bigSerial PK autoGenerated
// }

// outputGeneratedCsv(sold_items, 'sold_items', 2000, { fk1: tIds, fk2: itemIds })
// // from cli run `node create_mocks.js`

// ~~~ EXAMPLE END ~~~
