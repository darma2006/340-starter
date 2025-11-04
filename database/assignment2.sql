-- ============================================
-- Assignment 2 - SQL Queries
-- ============================================

-- 1) Insert Tony Stark (account_id and account_type auto-handled)
INSERT INTO account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

-- 2) Update Tony Stark account_type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- 3) Delete Tony Stark from account table
DELETE FROM account
WHERE account_email = 'tony@starkent.com';

-- 4) Update GM Hummer description using REPLACE()
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5) Inner join: make, model, classification_name for Sport category
SELECT
  i.inv_make,
  i.inv_model,
  c.classification_name
FROM inventory i
INNER JOIN classification c
  ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6) Add "/vehicles" into image paths for all inventory rows
UPDATE inventory
SET 
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

