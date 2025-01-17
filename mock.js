const {
  outputGeneratedCsv,
  getValuesFromTableColumn,
} = require("./create_mocks");

/**
CREATE TABLE "rides" (
  "id" bigserial PRIMARY KEY,
  "map" TEXT NOT NULL,
  "start_point" TEXT NOT NULL,
  "end_point" TEXT NOT NULL,
  "start_date" DATETIME NOT NULL,
  "end_date" DATETIME NOT NULL,
  "distance" DECIMAL NOT NULL,
  "elevation_gain" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "ave_speed" DECIMAL NOT NULL,
  "ave_watts" DECIMAL NOT NULL,
  "pr_count" INTEGER NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT (now()),
  "updated_at" DATETIME NOT NULL DEFAULT (now())
);
 */
const rides = {
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
// creates 10 mock records to populate the "rides" table, values correspond to the switch case in create_mocks
// mocks are build from the faker library so you can add whatever they support by including more cases
const ridesTableValues = outputGeneratedCsv(rides, "rides", 10);
// store the id reference so we can create the FK relationship on other tables
const rideIds = getValuesFromTableColumn(ridesTableValues, 0);

/**
 CREATE TABLE "pins" (
  "id" bigserial PRIMARY KEY,
  "ride_id" bigint NOT NULL,
  "lat_long" TEXT NOT NULL,
  "content" TEXT,
  "user_id" INTEGER NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT (now()),
  "updated_at" DATETIME NOT NULL DEFAULT (now())
);
 */

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

// node mock.js will create both mock value csv with the pins csv using a FK reference to the ride.id column
