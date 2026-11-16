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