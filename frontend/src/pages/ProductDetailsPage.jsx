// frontend/src/pages/ProductDetailsPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                setError('Failed to fetch product details.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center mt-8">Loading product details...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!product) return <div className="text-center mt-8">Product not found.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
                {/* Image Gallery Placeholder */}
                <div className="w-full md:w-1/2 p-6 flex items-center justify-center bg-gray-100">
                    <div className="text-gray-500 text-lg">Image Gallery Here</div>
                </div>
                
                {/* Product Details */}
                <div className="w-full md:w-1/2 p-6">
                    <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                    <p className="text-2xl text-blue-600 font-semibold mb-4">${product.price}</p>
                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    
                    {/* Variants and Stock Placeholder */}
                    <div className="mb-6">
                        <h4 className="font-semibold text-lg mb-2">Available Options:</h4>
                        <div className="text-gray-500">Variants (e.g., Size, Color) and stock status will be here.</div>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;