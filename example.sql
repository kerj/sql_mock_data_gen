CREATE TABLE "employees" (
  "employee_id" varchar(50) PRIMARY KEY,
  "start_date" date
);

CREATE TABLE "inventory" (
  "item_id" varchar(50) PRIMARY KEY,
  "quantity" integer,
  "supplier" varchar(30),
  "unit_price" decimal(8,2),
  "upc" varchar(50),
  "brand" varchar(30),
  "category" varchar(20),
  "model" varchar(50),
  "sku" varchar(50),
  "msrp" decimal(8,2)
);

CREATE TABLE "sale_transactions" (
  "transaction_id" varchar(50) PRIMARY KEY,
  "transaction_date" date,
  "employee_id" varchar(50),
  "net_amount" decimal(8,2),
  "profit" decimal(8,2),
  "item_count" integer,
  "customer_id" varchar(50)
);

CREATE TABLE "sold_items" (
  "transaction_id" varchar(50),
  "item_id" varchar(50),
  "sold_item_count" bigserial PRIMARY KEY
);

CREATE TABLE "customers" (
  "customer_id" varchar(50) PRIMARY KEY,
  "email_address" varchar(100),
  "first_name" varchar(30),
  "last_name" varchar(30)
);

ALTER TABLE "sale_transactions" ADD FOREIGN KEY ("employee_id") REFERENCES "employees" ("employee_id");

ALTER TABLE "sale_transactions" ADD FOREIGN KEY ("customer_id") REFERENCES "customers" ("customer_id");

ALTER TABLE "sold_items" ADD FOREIGN KEY ("transaction_id") REFERENCES "sale_transactions" ("transaction_id");

ALTER TABLE "sold_items" ADD FOREIGN KEY ("item_id") REFERENCES "inventory" ("item_id");
