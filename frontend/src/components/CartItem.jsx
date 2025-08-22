// frontend/src/components/CartItem.jsx
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';

const imageUrlBase = '/images/';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <li className="p-4 flex items-center">
            <img src={imageUrlBase + item.image_url || 'https://via.placeholder.com/150'} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center space-x-2 mt-1">
                    <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={item.quantity <= 1}
                    >
                        <FaMinus />
                    </button>
                    <span className="text-gray-500 text-sm">{item.quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                </button>
            </div>
        </li>
    );
};

export default CartItem;