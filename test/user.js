process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import jwt from "jsonwebtoken";
import app from "../src/server.js";

const should = chai.should();

chai.use(chaiHttp);
const expect = chai.expect;
let jwtToken;
let existIdUser;
let userIdCreated;
before(async function () {
  existIdUser = "d9beeab0-dcb1-4d4d-b407-445206e3ae8c";

  jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGVzIjpbIjEiXSwiaWF0IjoxNjgzNDA3MjU1LCJleHAiOjE2ODM0OTM2NTV9.lbMyFZhWllP1czfeYqq6QdGb4ld109YbkXHxaq6a5Sg";
});
describe("/GET /api/user/:id", () => {
  it("it should GET all usernames", (done) => {
    chai
      .request(app)
      .get("/api/user/2")
      .set("Authorization", `Bearer ${jwtToken}`)
      .end((err, res) => {
        res.should.have.status(302);
        done();
      });
  });
});
