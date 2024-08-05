import express from 'express'

const app = express();

// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));


// body parser (req.body)
app.use(express.urlencoded({ extended: false }));


app.listen(3000);
