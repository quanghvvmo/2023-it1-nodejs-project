process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import server from "../src/server.js";
import config from "../src/config/index.js";

const should = chai.should();

chai.use(chaiHttp);

let jwtToken;
let existIdUser;
let userIdCreated;

before(async function () {
    existIdUser = "d9beeab0-dcb1-4d4d-b407-445206e3ae8c";

    jwtToken = jwt.sign({ id: existIdUser }, config.tokenSecret, {
        expiresIn: config.tokenExpiry,
    });
});

describe("User API", () => {
    describe("POST /api/v1/users", () => {
        const newUser = {
            username: "username4123in",
            password: "12345678",
            firstName: "first",
            lastName: "last",
            email: "emafsade2@gmail.com",
            role: "ADMIN",
        };

        it("should create a new user with valid input", (done) => {
            chai.request(server)
                .post("/api/v1/users")
                .set("Authorization", `Bearer ${jwtToken}`)
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data?.should.be.an("object");
                    res.body.data?.should.have.property("id");
                    res.body.data?.should.have.property("username").that.equals(newUser.username);
                    res.body.data?.should.have.property("firstName").that.equals(newUser.firstName);
                    res.body.data?.should.have.property("lastName").that.equals(newUser.lastName);
                    res.body.data?.should.have.property("email").that.equals(newUser.email);

                    userIdCreated = res.body.data?.id;
                    done();
                });
        });

        it("should return an error if the username already exists", (done) => {
            chai.request(server)
                .post("/api/v1/users")
                .set("Authorization", `Bearer ${jwtToken}`)
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(409);
                    done();
                });
        });
    });

    describe("/GET /api/v1/users", () => {
        it("it should GET all usernames", (done) => {
            chai.request(server)
                .get("/api/v1/users")
                .set("Authorization", `Bearer ${jwtToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("/GET /api/v1/users/:id", () => {
        it("it should GET user detail with customer property", (done) => {
            chai.request(server)
                .get(`/api/v1/users/${userIdCreated}`)
                .set("Authorization", `Bearer ${jwtToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe("/DELETE /api/v1/users/:id", () => {
        it("it should DELETE user and return userId which is deleted", (done) => {
            chai.request(server)
                .delete(`/api/v1/users/${userIdCreated}`)
                .set("Authorization", `Bearer ${jwtToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
