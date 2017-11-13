'use strict';

require('dotenv').config();

const author = process.env.AUTHOR;
const databaseUrl = process.env.DATABASE_URL;
const version = process.env.VERSION;
const baseUrl = process.env.BASE_URL + '/' + version;

const username = 'saladthieves';
const email = 'salad@mail.com';
const password = 'awesomeness';
const token = '1234567890abcdef';

const categoryName = 'politics';
const categoryColor = '00AAFF';

const commentMessage = 'This article actually opened my eyes to a whole lot of things for the first time :)';
const warningMessage = 'The article has been posted before at http://article.com/29873.html';

const articleHeadline = 'New Flying Cars in Addis Abbaba';
const sourceUrl = 'http://www.cool-buzz.com/articles/39878.html';
const imageUrl = 'http://www.cool-buzz.com/images/39878-headline.png';
const articleSummary = 'A new innovative flying car has been launched in Addis Ababa to help with the congested traffic...';

const usersUrl = baseUrl + '/users';
const usersLoginUrl = usersUrl + '/login';
const usersSignUpUrl = usersUrl + '/signup';

const profilesUrl = baseUrl + '/profiles';
const categoriesUrl = baseUrl + '/categories';
const commentsUrl = baseUrl + '/comments';
const likesCommentUrl = '/likes';
const dislikesCommentUrl = '/dislikes';

const warningsUrl = baseUrl + '/warnings';

const articlesUrl = baseUrl + '/articles';
const followersUrl = '/followers';
const votersUrls = '/voters';

exports.data = {
    author, databaseUrl, version, baseUrl,

    username, email, password, token,
    usersUrl, usersLoginUrl, usersSignUpUrl,

    categoryName, categoryColor,

    commentMessage,
    profilesUrl, categoriesUrl, commentsUrl, likesCommentUrl, dislikesCommentUrl,

    warningMessage,
    warningsUrl,

    articleHeadline, sourceUrl, imageUrl, articleSummary,
    articlesUrl, followersUrl, votersUrls
};