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
        * devices
        - created_at
        - updated_at

    Device
        - _id
        - token
        * user
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

#### Services
    Notification
        - when a general notification arrives
            - visible - always
        - when someone posts a comment
            - silent - if on comments page
                {
                    "type": "silent",
                    "category": "comment",
                    "target": "TARGET_ARTICLE_COMMENT_POSTED",
                    "article": "{article_id}"
                }
            - visible - if off comments page and following article
                {
                    "type": "visible",
                    "category": "comment",
                    "target": "TARGET_ARTICLE_COMMENT_POSTED",
                    "article": "{article_id}"
                }
        - when a new article has been added
            - silent - if on home page
                {
                    "type": "silent",
                    "category": "article",
                    "target": "TARGET_HOME_PAGE"
                }
        - when info about an article changes
            - when the status of an article changes
                - silent - if on same page
                    {
                        "type": "silent",
                        "category": "article",
                        "target": "TARGET_ARTICLE_STATUS_CHANGED",
                        "article": "{article_id}",
                        "status_from": "pending",
                        "status_to": "approved"
                    }
                - visible - if you posted the article
                    {
                        "type": "visible",
                        "category": "article",
                        "target": "TARGET_ARTICLE_STATUS_CHANGED",
                        "article": "{article_id}",
                        "status_from": "pending",
                        "status_to": "approved"
                    }
            - when warning is added to an article
                - silent - if on same page
                    {
                        "type": "silent",
                        "category": "article",
                        "target": "TARGET_ARTICLE_WARNING_ADDED",
                        "article": "{article_id}"
                    }
                - visible - if you posted the article
                    {
                        "type": "visible",
                        "category": "article",
                        "target": "TARGET_ARTICLE_WARNING_ADDED",
                        "article": "{article_id}"
                    }
            - when vote is added to an article
                - silent - if on same page
                    {
                        "type": "silent",
                        "category": "article",
                        "target": "TARGET_ARTICLE_VOTE_ADDED",
                        "article": "{article_id}"
                    }
                - visible - if you posted the article
                    {
                        "type": "visible",
                        "category": "article",
                        "target": "TARGET_ARTICLE_VOTE_ADDED",
                        "article": "{article_id}"
                    }