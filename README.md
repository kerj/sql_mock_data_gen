# What

Create relational mock data for your postgreSQL database, fast! This is designed to be used in tandem with dbdiagram.io, quickly take your db design and seed it with mock data.
These utils leverage faker to create it's mocks, there are a number of preset options to choose from here but can simply be extended by extending the statement in create_mocks.

Some cool features:

1. Add additional faker mock data types by updating the switch statement inside create_mocks.js
2. If you want a specific set of values to be used, you can leverage one of the foreign key configs, example included
3. I tried to keep the opinions to minimum while providing a flexible API to work with, have fun! 

There are some limitations to consider when user faker to generate our mocks:

1. make sure that the faker mock will satisfy the datatype constraint you set in dbdiagram. (using uuid's for primary keys and setting the datatype to text for example)
2. some of the faker mocks may include punctuation, nothing kills a SQL statement like an extra apostrophe!
3. Fittingly, I only support 3 foreign keys per table, feel free to add more, it shouldn't take much!


## Installation

`yarn`

or

`npm i`

## Usage

1. Make your db design in dbDiagram then chose to export as PostgreSQL. That will give you something like this: 

```
CREATE TABLE "maps" (
  "id" TEXT PRIMARY KEY,
  "map" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "start_point" TEXT NOT NULL,
  "end_point" TEXT NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (now())
);

CREATE TABLE "pins" (
  "id" TEXT PRIMARY KEY,
  "map_id" TEXT NOT NULL,
  "lat_long" TEXT NOT NULL,
  "content" TEXT,
  "user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (now())
);

ALTER TABLE "pins" ADD FOREIGN KEY ("map_id") REFERENCES "maps" ("id");
```

 2. Create a file and import the utilities:

 ```
 const {
  outputGeneratedCsv,
  getValuesFromTableColumn,
} = require("./create_mocks");
 ```

Next you will want to create the config for the tables. These will be objects named after the tables. Let's look at doing this for the "maps" table below:

the format is for the key to be the column name, and the value for that key will correspond to the type of mock you want to use for it. I set "map" to be a "number"
even though the SQL statement says "text". As long as the constraint passes you won't hit any issues, definitely be creative based on what you need! 

```
const maps = {
  id: "id",
  map: "number",
  start_point: "number",
  end_point: "number",
  start_date: "random_date",
  end_date: "random_date",
  name: "first_name",
  created_at: "random_date",
  updated_at: "random_date",
};
```
Not too bad? After defining one of these I like to go ahead and call the 

```
// params:
// 1: object name to reference.
// 2: name of the table.
// 3: # of mock rows to create
const mapsTableValues = outputGeneratedCsv(maps, "maps", 10);
```

If you have a value from the table you want to reference as a foreign key or you just want all the values for some other reason, you can get them by doing:
```
// params:
// 1: reference to the csv values
// 2: index of the key you want to reference, these are stored as an array internally so we are good to reference in this way

const maps = {
  id: "id", <-- 0 
  map: "number", <-- 1
  ... 
};

const allMapsIds = getValuesFromTableColumn(mapsTableValues, 0);
```

3. Setting the Foreign keys to be used, the 4th ARG!

Let's setup the "pins" table that uses a foreign key constraint for the "map_id" column:

```
const pins = {
  id: "id",
  // denoting that we will be referencing a set of values we supply to create the relationship
  ride_id: "FK1",
  lat_long: "bird",
  content: "email",
  // this could be a FK is we had a "users" table, we would show that as "FK2"
  user_id: "id",
  created_at: "random_date",
  updated_at: "random_date",
};

outputGeneratedCsv(pins, "pins", 100, { fk1: rideIds });

```

the 4th argument may be structured like so:
```
 { fk1: [...], fk2: [...], fk3: [...] } 
```
Where each array value are the values that will be randomly selected from for that columns value.

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


 4. Generate 

 Whatever you named you file and completed the setup in, you just run in the cli:

 `node [yourfilename].js`

This will create a csv for each table you called the `outputGeneratedCsv` for. The name will correspond to the 2nd arg in that function call.


 5. Extra

 With csv's containing values you will likely be good to go, but if you want to add the values using insert statements there is a util for that!

 after you have the csv's generated, you can run `node sqlImport` and follow the prompts in the CLI to get a file containing each insert statement.  

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)