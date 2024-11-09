# Ebook API - Backend
## Description
Hello everyone,
This is a project that is based on industry standard practices.
I have used **TypeScript** to write the API and **TypeORM** as the ORM.
The API is organized in a **MVC** pattern, with **Controllers** that handle the http requests, **Services** that encapsulate the business logic and **Repositories** that encapsulate the data access layer.
The API uses **JWT** for authentication, and **Multer** for handling file uploads.

## Features

* User Management:
	+ Create User
	+ Delete User
	+ Update User
	+ Get User
	+ Get All Users
* Book Management:
	+ Create Book
	+ Delete Book
	+ Update Book
	+ Get Book
	+ Get All Books
* Authentication:
	+ Login
	+ Register
* File Management:
	+ Upload File

## Installation

1. Clone the repository: `git clone https://github.com/ahsan-zahoor/ebook-api.git`
2. Install the dependencies: `npm install`
3. Create a **.env** file with the following variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
4. Run the migrations: `npm run typeorm migration:run`
5. Run the server: `npm run dev`

## API Documentation

The API documentation is available at: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Technologies Used

* **Node.js**: As the runtime environment
* **TypeScript**: As the programming language
* **TypeORM**: As the ORM
* **Express.js**: As the web framework
* **Multer**: For handling file uploads
* **JWT**: For authentication
