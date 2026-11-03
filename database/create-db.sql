
-- Reset whole database as root user
DROP DATABASE IF EXISTS mediashare;
CREATE DATABASE mediashare;
USE mediashare;

-- Create database structure
CREATE TABLE Users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE MediaItems (
  media_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


-- Skriptin käyttö, mysql: source tiedostopolku
-- tiedostopolku (copy path): /Users/juuso/Library/Mobile Documents/com~apple~CloudDocs/Metropolia/käyttäjäkeskeinen_sovelluskehitys/template1/database/create-db.sql
-- Olemassa olevan kannan export (terminaali: mysqldump -p [tietokannan nimi] > kohdetiedosto.sql)