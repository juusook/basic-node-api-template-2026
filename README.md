# Node API example

Simple backend server using Node.js

Eri viikkojen esimerkit löydät omista kehityshaaroistaan.

## Validation

Kaikki osat tehty. Syötteet sanitoitu ja validoitu. Tässä haarassa ei ole toteutettu autentikaatiota kokonaan eikä käyttäjätasojen hallintaa.

Virheet käsitellään oikeaoppisesti validationErrors middlewarella, jotta virheellinen data ei päädy tietokantaa ja siitä lähtee asianmukainen virheviesti. Olemattomat reitit määritelty kaikkien oikeiden API-reittien jälkeen ja niistä lähetetään 404 status. Multer ottaa nyt vastaan vain alle 10mb kokoisia tiedostoja ja estää suurempien latauksen virheviestillä höystettynä.

# Kuvia APIn toiminnasta

Seuraavat kuvat ovat virheellisistä syötteistä

![alt text](images/badUserCreate.png)
![alt text](images/invalidFormat.png)
![alt text](<images/Näyttökuva 2026-11-23 kello 6.52.51 ip..png>)
![alt text](<images/Näyttökuva 2026-11-23 kello 6.53.02 ip..png>)
![alt text](<images/Näyttökuva 2026-11-23 kello 6.59.15 ip..png>)
