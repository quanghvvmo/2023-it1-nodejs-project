process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import app from "../src/server.js";
import { login } from "../src/services/userServices.js";

const should = chai.should();

chai.use(chaiHttp);
const expect = chai.expect;
let jwtToken;
let existIdUser;
let userIdCreated;
function makeid() {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let counter = 0;
  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * 10));
    counter += 1;
  }
  return result;
}
before(async () => {
  const credentials = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  };
  const user = await login(credentials);
  jwtToken = user.data;
});
const newUser = {
  username: makeid(),
  password: "123123",
  email: makeid() + "@gmail.com",
  RoleId: "2",
  managerId: "1",
};
describe("User API", () => {
  describe("POST /api/users", () => {
    it("it should create a new user ", (done) => {
      chai
        .request(app)
        .post("/api/users/")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.data?.should.be.an("object");
          userIdCreated = res.body.data?.id;
          done();
        });
    });
    it("it should return an error if the username already exists", (done) => {
      chai
        .request(app)
        .post("/api/users/")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.data?.should.be.an("object");
          done();
        });
    });
  });
  describe("/GET /api/user", () => {
    it("it should GET all users", (done) => {
      chai
        .request(app)
        .get("/api/users/")
        .set("Authorization", `Bearer ${jwtToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");

          done();
        });
    });
  });
  describe("/GET /api/user/:id", () => {
    it("it should GET single user", (done) => {
      chai
        .request(app)
        .get("/api/users/2")
        .set("Authorization", `Bearer ${jwtToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });
  describe("/DELETE /api/users/:id", () => {
    it("it should delete single user", (done) => {
      chai
        .request(app)
        .delete(`/api/users/${userIdCreated}`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });
  describe("/UPDATE /api/users/:id", () => {
    it("it should update single user", (done) => {
      chai
        .request(app)
        .put(`/api/users/5`)
        .set("Authorization", `Bearer ${jwtToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });
});
describe("FORM API", () => {
  describe("POST /api/forms/", () => {
    const newForm = {
      name: "sssssssss1min",
      dueDate: "2042-11-12 17:00:00",
      description: "okokok",
      formCategoryId: 2,
      createdBy: "ADMIN",
      updatedBy: "ADMIN",
    };
    it("it should return error because some users haven't finish their form yet ", (done) => {
      chai
        .request(app)
        .post("/api/forms/")
        .set("Authorization", `Bearer ${jwtToken}`)
        .send(newForm)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.data?.should.be.an("object");
          done();
        });
    });
  });
});
