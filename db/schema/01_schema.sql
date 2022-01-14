-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS urls_users CASCADE;
DROP TABLE IF EXISTS url_ratings CASCADE;
DROP TABLE IF EXISTS URLs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR (255) NOT NULL,
  password VARCHAR (255) NOT NULL
);

CREATE TABLE URLs (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR (255) NOT NULL,
  url VARCHAR (255) NOT NULL,
  description TEXT,
  topic VARCHAR (255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE url_ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 0,
  comment TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  url_id INTEGER REFERENCES URLs(id) ON DELETE CASCADE
);

CREATE TABLE urls_users (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  url_id INTEGER REFERENCES URLs(id) ON DELETE CASCADE
);


