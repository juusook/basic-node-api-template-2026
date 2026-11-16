
-- Reset whole database as root user
DROP DATABASE IF EXISTS mediashare;
CREATE DATABASE mediashare;
USE mediashare;

-- Create database structure
-- users-taulu
CREATE TABLE Users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- media_items-taulu
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

-- Kommentit-taulu
CREATE TABLE Comments (
  comment_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Tykkäykset-taulu
CREATE TABLE Likes (
  like_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


-- Skriptin käyttö, mysql: source tiedostopolku
-- tiedostopolku (copy path): /Users/juuso/Library/Mobile Documents/com~apple~CloudDocs/Metropolia/käyttäjäkeskeinen_sovelluskehitys/template1/database/create-db.sql
-- Olemassa olevan kannan export (terminaali: mysqldump -p [tietokannan nimi] > kohdetiedosto.sql)

-- TESTIDATAN LISÄÄMINEN

-- INSERT users
INSERT INTO Users VALUES (260, 'VCHar', 'secret123', 'vchar@example.com', 1, null);
INSERT INTO Users VALUES (305, 'Donatello', 'secret234', 'dona@example.com', 1, null);

-- Inserting multiple records at once
INSERT INTO MediaItems (filename, filesize, title, description, user_id, media_type) 
  VALUES ('ffd8.jpg', 887574, 'Favorite drink', null, 305, 'image/jpeg'),
         ('dbbd.jpg', 60703, 'Miika', 'My Photo', 305, 'image/jpeg'),
         ('2f9b.jpg', 30635, 'Aksux and Jane', 'friends', 260, 'image/jpeg');

-- Lisätään  kommentteja
INSERT INTO Comments (media_id, user_id, comment_text) 
  VALUES (1, 260, 'Hyvä kuva!'),
         (3, 305, 'Mahtavaa!!! Onneksi olkoon!.');

-- Lisätään tykkäyksiä
INSERT INTO Likes (media_id, user_id) 
  VALUES (1, 260),
         (2, 260),
         (3, 305);

-- QUERIES

-- Hae tietyn julkaisun kommentit 
SELECT Comments.comment_text, Comments.created_at, Users.username
FROM Comments
JOIN Users ON Comments.user_id = Users.user_id
WHERE Comments.media_id = 1;

-- Laske tietyn julkaisun tykkäykset
SELECT COUNT(*) AS like_count 
FROM Likes 
WHERE media_id = 1;

-- 3. Hae kaikki käyttäjän 305 julkaisemat kuvat
SELECT media_id, filename, title, description, created_at 
FROM MediaItems 
WHERE user_id = 305;