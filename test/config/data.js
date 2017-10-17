'use strict';

const baseUrl = process.env.BASE_URL + '/' + process.env.VERSION;

const usersUrl = baseUrl + '/users';
const signUpUrl = usersUrl + '/signup';
const loginUrl = usersUrl + '/login';

const articlesUrl = baseUrl + '/articles';
const categoriesUrl = baseUrl + '/categories';

module.exports = {
    email: 'salad@mail.com',
    username: 'saladthieves',
    password: 'helloworld',
    usersUrl, signUpUrl, loginUrl,

    headline: 'New flying cars in Addis Ababa',
    source_url: 'http://www.cool-news/com/story/39874.html',
    image_url: 'http://www.cool-news/com/images/flying-car-3987.png',
    summary: 'Checkout the new flying cars that are all the attention in Addis Ababa!',
    category: '59e1fb19032cc7284ab7c55a',
    poster: '59e1fb19032cc7284ab7c55c',
    articlesUrl,

    category_name: 'Politics',
    categoriesUrl,

    comment_message: 'This is a cool new article message!'
};