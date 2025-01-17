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
