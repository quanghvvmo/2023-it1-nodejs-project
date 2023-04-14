process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
const should = chai.should();

chai.use(chaiHttp);

describe("User API", () => {
    const userNameTest = "testUser8";
    let userIdCreated;

    describe("POST /api/v1/users", () => {
        it("should create a new user with valid input", (done) => {
            const newUser = {
                username: userNameTest,
                password: "password123",
                age: 25,
                mail: "testuser@test.com",
                phone: "1234567890",
                address: "123 Main St.",
            };

            chai.request(server)
                .post("/api/v1/users")
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("string");

                    userIdCreated = res.body;

                    done();
                });
        });

        it("should return an error if the username already exists", (done) => {
            const newUser = {
                username: userNameTest,
                password: "password123",
                age: 25,
                mail: "testuser@test.com",
                phone: "1234567890",
                address: "123 Main St.",
            };

            chai.request(server)
                .post("/api/v1/users")
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    done();
                });
        });
    });

    describe("/GET /api/v1/users", () => {
        it("it should GET all usernames", (done) => {
            chai.request(server)
                .get("/api/v1/users")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array").that.contains(userNameTest);
                    done();
                });
        });
    });

    describe("/GET /api/v1/users/:id", () => {
        it("it should GET user detail with customer property", (done) => {
            const userId = "3ee68110-d858-4217-bc74-cbce28d5e4e8";

            chai.request(server)
                .get(`/api/v1/users/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("Customer");
                    done();
                });
        });
    });

    describe("/DELETE /api/v1/users/:id", () => {
        it("it should DELETE user and return userId which is deleted", (done) => {
            chai.request(server)
                .delete(`/api/v1/users/${userIdCreated}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("string");
                    done();
                });
        });
    });
});
