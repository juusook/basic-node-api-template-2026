-- TIETOKANNAN ALUSTUS
-- Poistetaan vanha kanta ja luodaan uusi tyhjä
DROP DATABASE IF EXISTS opijamyy;
CREATE DATABASE opijamyy;
USE opijamyy;

-- TAULUJEN LUONTI

-- 1. USERS-taulu (käyttäjät)
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_level INT NOT NULL DEFAULT 1, 
    avatar VARCHAR(255) DEFAULT 'default_avatar.png',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- 2. CATEGORIES-taulu (tuotekategoriat)
CREATE TABLE categories (
    category_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY (category_id)
);

-- 3. EVENTS-taulu (opiskelijatapahtumat)
CREATE TABLE events (
    event_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL, -- Tapahtuman luoja / järjestäjä
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    venue VARCHAR(150),
    street_address VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL, -- VARCHAR etunollien säilymiseksi
    image VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. PRODUCTS-taulu (myytävät esineet ja tapahtumaliput)
CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL, -- Myyjä
    category_id INT NOT NULL,
    event_id INT NULL, -- NULL normaaleilla tavaroilla, numero lipuilla
    title VARCHAR(200) NOT NULL,
    `condition` INT NULL, -- 1=Uusi, 2=Erinomainen, 3=Hyvä, 4=Kohtalainen, 5=Huono (lipuilla NULL)
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    is_sold BOOLEAN NOT NULL DEFAULT FALSE,
    image VARCHAR(255),
    street_address VARCHAR(150), -- Valinnainen tarkka sijainti
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE SET NULL
);

-- 5. COMMENTS-taulu (tuotesivun julkiset kysymykset ja kommentit)
CREATE TABLE comments (
    comment_id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL, -- Kommentin kirjoittaja
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 6. FAVORITES-taulu (suosikit / sydämet)
CREATE TABLE favorites (
    favorite_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (favorite_id),
    UNIQUE KEY unique_user_product_favorite (user_id, product_id), -- Estää saman tuotteen tuplatykkäyksen
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 7. REVIEWS-taulu (myyjän tähtiarvostelut 1–5)
CREATE TABLE reviews (
    review_id INT NOT NULL AUTO_INCREMENT,
    reviewer_id INT NOT NULL, -- Ostaja
    seller_id INT NOT NULL,   -- Myyjä
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (review_id),
    CHECK (reviewer_id != seller_id), -- Estää itsensä arvostelun
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- TESTIDATAN LISÄÄMINEN


-- Käyttäjät (Users)
INSERT INTO users (user_id, first_name, last_name, username, password, email, user_level, avatar) VALUES 
(1, 'Matti', 'Meikäläinen', 'mattim', '$2b$10$hashedpass1', 'matti@metropolia.fi', 1, 'avatar1.png'),
(2, 'Laura', 'Opiskelija', 'laura_o', '$2b$10$hashedpass2', 'laura@aalto.fi', 1, 'avatar2.png'),
(3, 'Admin', 'Järjestäjä', 'opiskelijakunta', '$2b$10$hashedpass3', 'hallitus@opkunta.fi', 3, 'admin_logo.png');

-- Kategoriat (Categories)
INSERT INTO categories (category_id, name) VALUES 
(1, 'Kurssikirjat & opiskelutarvikkeet'),
(2, 'Tapahtumaliput & bileet'),
(3, 'Haalarimerkit & opiskelijakulttuuri'),
(4, 'Elektroniikka & IT'),
(5, 'Koti & soluasuminen');

-- Tapahtumat (Events)
INSERT INTO events (event_id, user_id, title, description, event_date, venue, street_address, city, postal_code, image) VALUES 
(1, 3, 'Helsingin Wappuapprot 2027', 'Vuoden suurin opiskelijatapahtuma kantakaupungissa.', '2027-04-29 16:00:00', 'Kansalaistori', 'Mannerheiminaukio 1', 'Helsinki', '00100', 'appro27.jpg'),
(2, 3, 'Insinöörien Kevätsitsit', 'Perinteiset sitsit teemalla kasari.', '2027-05-15 18:00:00', 'Uudisrakennuksen kerhohuone', 'Vanha viertotie 23', 'Helsinki', '00350', 'sitsit.jpg');

-- Tuotteet (Products)
-- Huom: 1 & 2 ovat tavallisia tavaroita (event_id = NULL). 3 on tapahtumalippu (kytketty eventtiin 1).
INSERT INTO products (product_id, user_id, category_id, event_id, title, `condition`, description, price, quantity, is_sold, image, street_address, city, postal_code) VALUES 
(1, 1, 1, NULL, 'Tekniikan kaavasto & TI-84 Plus', 3, 'Hyväkuntoiset matematiikan apuvälineet insinöörille.', 45.00, 1, FALSE, 'laskin.jpg', 'Karaportti 2', 'Espoo', '02610'),
(2, 2, 5, NULL, 'Airfryer 4.2L kompakti', 2, 'Soluhuoneeseen sopiva kiertoilmakypsennin vähän käytettynä.', 30.00, 1, FALSE, 'airfryer.jpg', 'Ruoholahdenkatu 14', 'Helsinki', '00180'),
(3, 3, 2, 1, 'Wappuappro 2027 Pääsylippu + Haalarimerkki', NULL, 'Virallinen osallistujaranneke suoraan järjestäjältä.', 15.00, 50, FALSE, 'lippu.jpg', 'Mannerheiminaukio 1', 'Helsinki', '00100');

-- Kommentit (Comments)
INSERT INTO comments (product_id, user_id, content) VALUES 
(1, 2, 'Onko laskimessa tuoreet paristot mukana?'),
(1, 1, 'Joo, vaihdettu viime viikolla!');

-- Suosikit (Favorites)
INSERT INTO favorites (user_id, product_id) VALUES 
(1, 2), -- Matti tykkää Lauran airfryerista
(2, 1); -- Laura tykkää Matin laskimesta

-- Arvostelut (Reviews)
INSERT INTO reviews (reviewer_id, seller_id, rating) VALUES 
(2, 1, 5); -- Laura antaa Matille 5 tähteä sujuvista kaupoista


-- ESIMERKKIKYSELYT (Backendin SQL-toteutuksia varten)

--  Hae kaikki myynnissä olevat tuotteet ja niiden kategorian sekä myyjän nimi
SELECT p.product_id, p.title, p.price, p.city, c.name AS category_name, u.username AS seller
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN users u ON p.user_id = u.user_id
WHERE p.is_sold = FALSE
ORDER BY p.created_at DESC;

-- Hae tietyn tapahtuman myynnissä olevat liput
SELECT products.product_id, products.title, products.price, products.quantity, events.title AS event_title, events.event_date
FROM products
JOIN events ON products.event_id = events.event_id
WHERE products.event_id = 1 AND products.is_sold = FALSE;

-- Laske käyttäjän (myyjän) saama keskimääräinen tähtiarvosana
SELECT seller_id, ROUND(AVG(rating), 1) AS average_rating, COUNT(*) AS review_count
FROM reviews
WHERE seller_id = 1
GROUP BY seller_id;

-- Hae käyttäjän (user_id = 2) tallentamat suosikkituotteet
SELECT products.product_id, products.title, products.price, products.city
FROM favorites
JOIN products ON favorites.product_id = products.product_id
WHERE favorites.user_id = 2;


-- Poista tuote käyttäjän suosikeista 
DELETE FROM favorites 
WHERE user_id = 2 AND product_id = 1;

-- Merkitse tuote myydyksi (is_sold = TRUE) käyttäjän toimesta
UPDATE products 
SET is_sold = TRUE 
WHERE product_id = 1 AND user_id = 1;

-- Päivitä käyttäjän profiilitiedot (esim. avatar ja etunimi)
UPDATE users 
SET avatar = 'uusi_kuva.png', first_name = 'Matti-Pekka' 
WHERE user_id = 1;




-- PATH: /Users/juuso/Library/Mobile Documents/com~apple~CloudDocs/Metropolia/käyttäjäkeskeinen_sovelluskehitys/template1/database/opi-ja-myy.sql