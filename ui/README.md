🛒 Full Stack E-Commerce Website

This is a full-stack e-commerce web application built with React.js(Vite+tailwind), Node.js, Express, and MySQL. It allows users to sign up, log in, browse products by category, add items to their cart, place orders, and view order history.

🚀 Features Implemented:

 1)Product listing by category

 2)Product details page with image and pricing

 3)Add to Cart & Buy Now functionality

 4)Order placement and order history

 5)Manager and admin control panel (UI designed)

🛠️ Upcoming Updates:

 1)Authentication and Authorization using JWT

 2)Role-based access: Customer / Manager / Admin

 3)Admin features: Add/Delete products, manage users

 4)Manager features: Category and product management

 5)Real-time Messenger (for users to chat)

 6)AI Chatbot to assist users with product search & FAQs

🧰 Tech Stack

Frontend              | Backend               | Database | Others
----------------------|-----------------------|----------|----------------
React + Tailwind CSS | Node.js + Express.js  | MySQL    | JWT, Axios
React Router DOM     | REST API              |          | dotenv, bcrypt

📁 Project Structure

.
├── UI
│   ├── src
│   │   ├── Pages/
│   │   ├── API.js
│   │   └── main.jsx
├── BACKEND
│   ├── Controller/
│   │   ├── ProductRoute.js
│   │   ├── CartRoute.js
│   │   ├── OrderRoute.js
│   │   └── UserRoute.js
│   ├── database.js
│   └── server.js
└── README.md


⚙️ How to Run Locally

1. Clone the repo
```
git clone https://github.com/KRANTHIAKURATHI/Full-Stack-Ecommerce-Website.git
cd Full-Stack-Ecommerce-Website
```

2. Setup the backend
```
cd BACKEND
npm install
npm start
```

3. Setup the frontend
```
cd UI
npm install
npm run dev
```

4. MySQL Setup
- Create database: ecommerce
- Import tables: user, product, category, cart, cart_items, orders, order_item
  
🔒 Future Improvements in Authentication & Authorization

- Passwords are hashed using bcryptjs
- JWT tokens are used for login sessions
- Protected routes are secured via middleware

✨ Future Improvements

- Admin dashboard
- Product search & filtering
- Order status tracking
- Payment integration
- Wishlist functionality

🙋‍♂️ Author

A. Kranthi Kumar
📧 (akurathikranthi12@gmail.com)
🔗 https://github.com/KRANTHIAKURATHI
