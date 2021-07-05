const request = require("supertest");
const {app} = require("../src/server");
const postgres = require('postgres');
const sql = postgres();
const Transaction = require('../src/transaction/transaction')(sql);
// Transaction.migrate();

const date = new Date("6/1/21");
const transaction = Transaction.new({
    memo: "Memo", 
    amount: 9.99, 
    account_id: "Account", 
    date, 
    posted: true, 
    line_item_id: "Line Item"
});

describe("/transactions", () => {
    // test("POST should respond with 200 OK", async () => {
    //     const posted = await request(app).post("/transactions").send(transaction);
    //     const body = posted.body
    //     expect(posted.status).toBe(200);
    //     expect(body.memo).toBe(transaction.memo);
    //     expect(body.amount).toBe(transaction.amount);
    //     expect(body.account).toBe(transaction.account);
    // })

    // test("PUT should respond with 200 OK", async () => {
    //     const posted = await request(app).post("/transactions").send(transaction);
    //     const id = posted.body.id;
    //     const memo = "Updated Memo";
    //     const account_id = "Updated Account";
    //     const updated = await request(app).put(`/transactions/${id}`).send({ memo, account_id });
    //     expect(updated.status).toBe(200);
    //     expect(updated.body.memo).toBe(memo);
    //     expect(updated.body.account_id).toBe(account_id);
    // })

    // test("GET should respond with 200 OK", async () => {
    //     const posted = await request(app).post("/transactions").send(transaction);
    //     const id = posted.body.id;
    //     const found = await request(app).get(`/transactions/${id}`);
    //     expect(found.status).toBe(200);
    //     expect(found.body.id).toBe(id);
    // })

    test("GETALL should respond with 200 OK", async () => {
        const all = await request(app).get(`/transactions`);
        expect(all.status).toBe(200);
        expect(all.body.length).toBeGreaterThan(0);
    })

    // test("DELETE should respond with 200 OK", async () => {
    //     const posted = await request(app).post("/transactions").send(transaction);
    //     const id = posted.body.id;
    //     const destroyed = await request(app).delete(`/transactions/${id}`);
    //     expect(destroyed.status).toBe(200);
    //     expect(destroyed.body.id).toBe(id);
    // })
})
