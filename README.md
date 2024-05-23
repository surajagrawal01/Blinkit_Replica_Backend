## Blinkit Type Replica (Nhance Take Home Assignment Back-end)
This project is created using Node.js, Express. It features user authentication, authorization, password hashing using bcryptjs, JWT for token management, form validation with express-validator, and image storage using multer. The database used is MongoDB, accessed via Mongoose.

### Features
User Authentication & Authorization
Admin Functionalities:
      Add categories
      Perform CRUD operations on products
User Functionalities:
      Register and log in
      Add products to cart
      Update item quantity in the cart
  
### Technologies Used

- **Node.js**: A JavaScript runtime environment for server-side development.
- **Express**: A web application framework for Node.js, used for building the backend server.
- **MongoDB**: A NoSQL database used for storing resort and user data.
- **cors**: Express middleware for enabling Cross-Origin Resource Sharing (CORS).
- **jsonwebtoken**: JSON Web Token implementation for user authentication.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.
- **express-validator**: Middleware for request validation in Express.js applications.
- **bcryptjs**: Library for password hashing and encryption.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/surajagrawal01/Blinkit_Replica_Backend.git
   
2. Install Dependencies
   
   ```bash
   cd Blinkit_Replica_Backend
   npm install

4. Start the server
   
   ```bash
    node server.js
