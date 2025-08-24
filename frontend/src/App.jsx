// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';

import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CategoryPage from './pages/CategoryPage';


function App() {
  const useDebounce = (value, delay) => {
      const [debouncedValue, setDebouncedValue] = useState(value);

      useEffect(() => {
          const handler = setTimeout(() => {
              setDebouncedValue(value);
          }, delay);

          return () => {
              clearTimeout(handler);
          };
      }, [value, delay]);

      return debouncedValue;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5014', {
        transports: ['websocket', 'polling']
    });
    newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server.');
    });
    newSocket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

    return (
        <>
            <Header setSearchTerm={setSearchTerm} />
            <main>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/products" element={<ProductsPage searchTerm={debouncedSearchTerm} />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                </Routes>
            </main>
        </>
    );
}

export default App;