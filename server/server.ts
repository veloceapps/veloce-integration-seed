import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  cors({
    origin: '*'
  })
);

app.use('/templates', require('./routes/templates.route'));
app.use('/catalogs', require('./routes/catalogs.route'));
app.use('/models', require('./routes/models.route'));

app.listen(port, () => {
  console.log(`Veloce Integration API app is listenning at http://localhost:${port}`);
});
