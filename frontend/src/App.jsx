// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';


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

    return (
        <>
            <Header setSearchTerm={setSearchTerm} />
            <main>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/" element={<ProductsPage searchTerm={debouncedSearchTerm} />} />
                    <Route path="/products/:id" element={<ProductDetailsPage />} />
                </Routes>
            </main>
        </>
    );
}

export default App;