'use strict';

require('dotenv').config();

const author = process.env.AUTHOR;
const version = process.env.VERSION;
const baseUrl = process.env.BASE_URL + '/' + version;

const username = 'saladthieves';
const email = 'salad@mail.com';
const password = 'awesomeness';

const categoryName = 'politics';
const categoryColor = '00AAFF';

const usersUrl = baseUrl + '/users';
const usersLoginUrl = usersUrl + '/login';
const usersSignUpUrl = usersUrl + '/signup';

exports.data = {
    author, version, baseUrl,

    username, email, password,
    usersUrl, usersLoginUrl, usersSignUpUrl,

    categoryName, categoryColor
};