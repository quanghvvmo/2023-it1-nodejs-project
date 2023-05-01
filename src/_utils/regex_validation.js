"use strict";

const EMAIL_REGEX =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_REGEX = /^[A-Za-z\d@$!%*#?&]{6,}$/;
const USERNAME_REGEX = /^(?=.{4,32}$)[a-zA-Z0-9._@]+$/;
const PHONE_NUMBER_REGEX = /^[0-9\s- \+]{8,13}$/;

const UUID_REGEX = /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i;

export { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX, PHONE_NUMBER_REGEX, UUID_REGEX };
