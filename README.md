🛒 Full Stack E-Commerce Website (Amazon Clone)

This is a full-stack Amazon-like e-commerce web application built with React.js(Vite+tailwind), Node.js, Express, and MySQL. It allows users to sign up, log in, browse products by category, add items to their cart, place orders, and view order history.

🚀 Features

✅ User Features
- User authentication (signup/login)
- Browse products by categories
- View detailed product info
- Add products to cart
- Place orders via:
  - 🛒 Cart checkout
  - ⚡ "Buy Now" button
- View all past orders (grouped by order)
- Remove items from cart

✅ Admin Features (Coming Soon)
- Add/edit/delete products
- Manage categories
- View all orders

🧰 Tech Stack

Frontend              | Backend               | Database | Others
----------------------|-----------------------|----------|----------------
React + Tailwind CSS | Node.js + Express.js  | MySQL    | JWT, Axios
React Router DOM     | REST API              |          | dotenv, bcrypt

📁 Project Structure

.
├── FRONTEND
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
cd FRONTEND
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

📄 License

This project is licensed under the MIT License.
