const request = require("supertest");
const {app} = require("../src/server");

describe("/", () => {
    test("should respond with 200 OK", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.text).toBe("Give me something to shoot")
    })


//   test("should respond with 401 Unauthorized when not authenticated", () => {
//     return request(app)
//       .post("/webhooks")
//       .send({
//         data: {
//           id: process.env.TEST_ORDER_ID
//         }
//       })
//       .then(res => {
//         expect(res.status).toBe(401);
//       })
//   })
})
