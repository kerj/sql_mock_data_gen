# What

Some utilities to create mock data for a relational data base

## Installation

`yarn`

or

`npm i`

## Usage

 1. Define each table as an object using the available data types as the value in each kvp.

```
const employees = {
  employee_id: "id", // [PK]
  start_date: "random_date" 
}
```
 
 2. if you need to reference values in another table you may store those values using `getValuesFromTableColumn` arg 1 is the table you want to store the values from arg 2 is its numeric position that it appears on the table object. This snippet would store the `employee_id` from the above `employees` object.

```
const customerIds = getValuesFromTableColumn(customerTableValues, 0)
```
 
 3. go through steps 1 & 2 for the each table in the DB, up to 3 foreign keys are supported by default to use a foreign key the value in the table object should be set to one of the following:

 *  "FK1" | "FK2" | "FK3"

then when using the `outputGeneratedCsv` function you pass the values for the foreign key as the 4th argument like:

 * { fk1: [...], fk2: [...], fk3: [...] } 

You may use any values you like here, for example maybe its not a foreign key you want to define, but a more specific set of values to choose from like:

```
 const trafficTable = outputGeneratedCsv(
  trafficLightsTable,
  "colors",
  { 
    fk1: [
      'red light',
      'yellow light',
      'green light'
    ],
  }
);
```



 4. after completing the set up and running each function and storing the values to be used later for references
 each csv is output as a csv.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)