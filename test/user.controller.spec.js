process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import server from "../src/server.js";
import config from "../src/config/index.js";
import { userMessages } from "../src/constants/messages.constants.js";

chai.should();

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
            username: "useradfdfasn",
            password: "12345678",
            firstName: "first",
            lastName: "last",
            email: "emafadasfse2@gmail.com",
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
                    res.body.data?.should.be.an("object");
                    res.body.data?.should.have
                        .property("message")
                        .that.equals(userMessages.DUPLICATE_USERNAME);
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
                    res.body.should.be.an("object");
                    res.body.should.have.property("pageIndex");
                    res.body.should.have.property("pageSize");
                    res.body.should.have.property("totalCount");
                    res.body.should.have.property("totalPages");
                    res.body.should.have.property("data");

                    done();
                });
        });
    });

    describe("/PUT /api/v1/users/:id", () => {
        it("it should UPDATE the user first name and return message success", (done) => {
            chai.request(server)
                .put(`/api/v1/users/${userIdCreated}`)
                .set("Authorization", `Bearer ${jwtToken}`)
                .send({ firstName: "new first name" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message").that.equals(userMessages.USER_UPDATED);

                    done();
                });
        });
    });

    describe("/GET /api/v1/users/:id", () => {
        it("it should GET the correct user detail after UPDATE", (done) => {
            chai.request(server)
                .get(`/api/v1/users/${userIdCreated}`)
                .set("Authorization", `Bearer ${jwtToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data?.should.be.an("object");
                    res.body.data?.should.have.property("id").that.equals(userIdCreated);
                    res.body.data?.should.have.property("username").that.equals(newUser.username);
                    res.body.data?.should.have.property("firstName").that.equals("new first name");
                    res.body.data?.should.have.property("lastName").that.equals(newUser.lastName);
                    res.body.data?.should.have.property("email").that.equals(newUser.email);

                    done();
                });
        });
    });

    describe("/DELETE /api/v1/users/:id", () => {
        it("it should DELETE user and return message success", (done) => {
            chai.request(server)
                .delete(`/api/v1/users/${userIdCreated}`)
                .set("Authorization", `Bearer ${jwtToken}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.should.have.property("message").that.equals(userMessages.USER_DELETED);

                    done();
                });
        });
    });
});
