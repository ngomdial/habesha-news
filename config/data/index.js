'use strict';

require('dotenv').config();

const author = process.env.AUTHOR;
const databaseUrl = process.env.DATABASE_URL;
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

const profilesUrl = baseUrl + '/profiles';

exports.data = {
    author, databaseUrl, version, baseUrl,

    username, email, password,
    usersUrl, usersLoginUrl, usersSignUpUrl,

    categoryName, categoryColor,

    profilesUrl
};