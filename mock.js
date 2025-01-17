const {
  outputGeneratedCsv,
  getValuesFromTableColumn,
} = require("./create_mocks");

/**
 * From DB diagram.io we started with:
 Table maps {
  id TEXT [primary key]
  map TEXT [not null]
  start_point TEXT [not null]
  end_point TEXT [not null]
  start_date TIMESTAMP [not null]
  end_date TIMESTAMP [not null]
  distance DECIMAL [not null]
  elevation_gain INTEGER [not null]
  name TEXT [not null]
  ave_speed DECIMAL [not null]
  ave_watts DECIMAL [not null]
  pr_count INTEGER [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
}

Table pins {
  id TEXT [primary key]
  map_id TEXT [ref: > maps.id, not null]
  lat_long TEXT [not null]
  content TEXT
  user_id TEXT [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
}

 */

/**
CREATE TABLE "maps" (
  "id" TEXT PRIMARY KEY,
  "map" TEXT NOT NULL,
  "start_point" TEXT NOT NULL,
  "end_point" TEXT NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "distance" DECIMAL NOT NULL,
  "elevation_gain" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "ave_speed" DECIMAL NOT NULL,
  "ave_watts" DECIMAL NOT NULL,
  "pr_count" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (now())
);
 */
const maps = {
  id: "id", // [PK]
  map: "number",
  start_point: "number",
  end_point: "number",
  start_date: "random_date",
  end_date: "random_date",
  distance: "number",
  elevation_gain: "number",
  name: "first_name",
  ave_speed: "number",
  ave_watts: "number",
  pr_count: "number",
  created_at: "random_date",
  updated_at: "random_date",
};
// creates 10 mock records to populate the "maps" table, values correspond to the switch case in create_mocks
// mocks are build from the faker library so you can add whatever they support by including more cases
const mapsTableValues = outputGeneratedCsv(maps, "maps", 10);
// store the id reference so we can create the FK relationship on other tables
const mapIds = getValuesFromTableColumn(mapsTableValues, 0);

/**
CREATE TABLE "pins" (
  "id" TEXT PRIMARY KEY,
  "map_id" TEXT NOT NULL,
  "lat_long" TEXT NOT NULL,
  "content" TEXT,
  "user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT (now()),
  "updated_at" TIMESTAMP NOT NULL DEFAULT (now())
);
 */

const pins = {
  id: "id",
  // denoting that we will be referencing a set of values we supply to create the relationship
  map_id: "FK1",
  lat_long: "bird",
  content: "email",
  // this could be a FK is we had a "users" table, we would show that as "FK2"
  user_id: "id",
  created_at: "random_date",
  updated_at: "random_date",
};

outputGeneratedCsv(pins, "pins", 100, { fk1: mapIds });

// node mock.js will create both mock value csv with the pins csv using a FK reference to the map.id column
