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
        - picture_url
        - notification_toggle
        - active
        * user
        * categories
        - created_at
        - updated_at

    Article
        - _id
        - headline
        - source_url
        - image_url
        - summary
        - status
        * category
        * comments
        * followers
        * poster
        * warnings
        * voters
        - created_at
        - updated_at

    Category
        - _id
        - name
        - color
        - created_at
        - updated_at

    Comment
        - _id
        - message
        * article
        * poster
        * likes
        * dislikes
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
        * user
        - created_at
        - updated_at
