const postgres = require('postgres');
const express = require('express');
const Transaction = require('./transaction/transaction');

if (process.env.DATABASE_URL === undefined)
    process.env.DATABASE_URL = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
else
    process.env.DATABASE_URL += '?sslmode=require'

const sql = process.env.POSTGRES_USER ? postgres(process.env.DATABASE_URL, process.env.DEV ? {} : { ssl: { rejectUnauthorized: false } }) : postgres();

const app = express();
app.use(express.json())

const port = process.env.PORT;
const transaction = Transaction(sql);
app.use('/transactions', transaction.getRoutes());

app.get('/', (_, res) => {
  res.send('Give me something to shoot');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = { app };