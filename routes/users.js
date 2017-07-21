'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/' , (req, res, next) => {
  knex('users')
    .select( 'id', 'firstname', 'lastname', 'username', 'phone', 'email')
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/' , (req, res, next) => {
  let firstName = req.body.users.firstName;
  let lastName = req.body.users.lastName;
  let username = req.body.users.username;
  let email = req.body.users.email;
  let phone = req.body.users.phone;

  if (!firstName || firstName.trim() === '') {
   const err = new Error('First name must not be blank');
   err.status = 400;

   return next(err);
 }

 if (!lastName || lastName.trim() === '') {
  const err = new Error('Last name must not be blank');
  err.status = 400;

  return next(err);
}

if (!username || username.trim() === '') {
 const err = new Error('Username must not be blank');
 err.status = 400;

 return next(err);
}

if (username.length < 6) {
 const err = new Error('Username must be at least 6 characters');
 err.status = 400;

 return next(err);
}

if (!isNaN(+username[0])) {
 const err = new Error('Username must start with a letter');
 err.status = 400;

 return next(err);
}

if (username.search(/[.,#!$%&*;:{}=\-_`~()]/) > 0) {
 const err = new Error('Username must have no punctuation');
 err.status = 400;

 return next(err);
}

if (!email || email.trim() === '') {
   const err = new Error('Email must not be blank');
   err.status = 400;

   return next(err);
 }

 if (!email.includes('@') && !email.includes('.')) {
  const err = new Error('Email must be in email format');
  err.status = 400;

  return next(err);
}

if (/^\d{10}$/.test(phone)) {
 const err = new Error('Phone number must be 10 digits');
 err.status = 400;

 return next(err);
}

if (isNaN(+phone)) {
 const err = new Error('Phone number must contain all numbers');
 err.status = 400;

 return next(err);
}




  knex('users')
    .insert({
      firstname: firstName,
      lastname: lastName,
      username: username,
      email: email,
      phone: phone
    })
    .returning(['firstname', 'lastname', 'username','phone','email'])
    .then((results) => {
      res.send(results[0]);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
