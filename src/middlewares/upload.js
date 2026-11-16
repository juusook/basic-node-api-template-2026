import multer from 'multer';

// Määritellään kansio, johon ladatut tiedostot tallennetaan
const upload = multer({
  dest: 'uploads/',
});

export default upload;
