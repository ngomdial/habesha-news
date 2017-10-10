# HABEHSA NEWS - API

## Overview
This is the API for the Habesha News Android app used for Modern Software
Development and its subsequent Android App Development class. API is
written as a monolithic API (for now) then hosted on Heroku. Later it will
be decomposed into a microservices architecture.

### Structure
#### Models
    User
        -_id
        - username
        - email
        - password
        * profile
        - created_at
        - updated_at

    Profile
        - _id
        * user
        - picture_url
        * categories
        - notification_toggle
        - active
        - created_at
        - updated_at

    Article
        - _id
        - headline
        - source_url
        - image_url
        - summary
        * category
        * poster
        * article_data
        - status
        - created_at
        - updated_at

    ArticleData
        - _id
        * article
        * comments
        * followers
        * warnings
        * voters

    Category
        - _id
        - name
        - color
        - created_at
        - updated_at

    Comment
        - _id
        - message
        * poster
        * likers
        * dislikers
        - created_at
        - updated_at

    Warning
        - _id
        - message
        * poster
        * article
        - created_at
        - updated_at

    Notification
        - _id
        - type
        - category
        - message
        - created_at
        - updated_at
        * user