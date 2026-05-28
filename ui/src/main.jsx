import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

import RedirectBasedOnAuth from './Pages/RedirectBasedOnAuth';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import ProductsPage from './Pages/ProductPage';
import ProductDetailsPage from './Pages/ProductDetailsPage';
import Cart from './Pages/CartPage';
import Orders from './Pages/OrdersPage';
// Add this line below
import LoginSuccess from './Pages/LoginSuccess'; 

const router = createBrowserRouter([
  { path: '/', element: <RedirectBasedOnAuth /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/HomePage', element: <HomePage /> },
  { path: '/products/:category', element: <ProductsPage /> },
  { path: '/product/:product_id', element: <ProductDetailsPage /> },
  { path: '/cart', element: <Cart /> },
  { path: '/orders', element: <Orders /> },
  { path: '/login-success', element: <LoginSuccess /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);