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


const getValuesFromTableColumn = (table, columnNumber) => {
  return table.reduce((acc, row, i) => {
    return i === 0 || !row[columnNumber] ? acc : [...acc, row[columnNumber]];
  }, []);
};

module.exports = {
  outputGeneratedCsv,
  getValuesFromTableColumn,
};
