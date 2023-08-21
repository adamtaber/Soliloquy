# social-media-site

This project is a social media site built with Node, Express, and React. Data is stored in a Postgresql database, with the exception of images, which are stored using Cloudinary. The project's API uses Apollo GraphQL.
The project can easily be setup and run using Docker. 

Features of this project include:
- the ability to follow other users
- posts with likes and nested comments
- notifications
- instant messaging (with the help of Apoll GraphQL Subscriptions)