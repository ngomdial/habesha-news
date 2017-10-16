'use strict';

const baseUrl = process.env.BASE_URL + '/' + process.env.VERSION;

const usersUrl = baseUrl + '/users';
const signUpUrl = usersUrl + '/signup';
const loginUrl = usersUrl + '/login';

module.exports = {
    email: 'salad@mail.com',
    username: 'saladthieves',
    password: 'helloworld',
    usersUrl, signUpUrl, loginUrl
};