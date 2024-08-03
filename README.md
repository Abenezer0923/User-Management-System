User Management System

Welcome to the User Management System! This project is a comprehensive solution for managing users with features for user creation, deletion, updating, and retrieval. Built with modern technologies and best practices, it includes advanced functionalities such as email verification, password resets, and more.
Table of Contents

    Overview
    Technologies Used
    Features
    Installation
    Configuration
    Running the Application
    API Endpoints
    Testing

Overview

This project is designed to offer a robust and scalable user management system. It allows administrators to manage user accounts effectively and provides users with functionalities like password reset and email notifications. The application is built using Node.js with Express for server-side logic, MongoDB for data storage, and various other technologies to enhance functionality and performance.
Technologies Used

    Node.js: JavaScript runtime for server-side logic
    Express: Web application framework for Node.js
    TypeScript: A superset of JavaScript providing static types
    MongoDB: NoSQL database for flexible and scalable data storage
    JWT: JSON Web Tokens for secure authentication
    Swagger: API documentation and testing
    Joi: Data validation
    dotenv: Environment variable management
    jest: test the routes

Features

    User Registration: Allows users to register with email and password.
    User Authentication: Secured routes using JWT authentication.
    User Management: Create, update, delete, and retrieve user profiles.
    Email Verification: Verify email addresses upon registration.
    Password Reset: Allow users to reset their passwords.
    Admin Features: Admins can view all users and delete users as needed.
    Swagger Integration: Interactive API documentation for easy testing and exploration.
    Testing: Comprehensive tests using Jest.


API Endpoints

The User Management System exposes the following API endpoints:

    POST /register: Register a new user.
    POST /updateuser: Update an existing user's information.
    GET /getuserbyid: Retrieve user information by ID.
    GET /getuserspage: Get a paginated list of users (admin access required).
    POST /deleteuser: Delete a user by ID.
    GET /admin/getallusers: Get all users as an admin.
    POST /admin/deleteuser: Delete a user as an admin.

Testing

To run tests, use the following command:

bash

npm test

This will run the test suite using Jest.

