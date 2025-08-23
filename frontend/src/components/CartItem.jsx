// frontend/src/components/CartItem.jsx
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';

const imageUrlBase = '/images/';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    return (
        <li className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img src={imageUrlBase + item.image_url || 'https://via.placeholder.com/150'} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Unit Price: Kes {item.price}</p>
                </div>
            </div>

            <div className="flex-shrink-0 flex items-center justify-between w-full sm:w-auto sm:space-x-6 mt-4 sm:mt-0">
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
                        disabled={item.quantity <= 1}
                    >
                        <FaMinus />
                    </button>
                    <span className="text-md font-medium text-gray-700 w-6 text-center">{item.quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full transition-colors"
                    >
                        <FaPlus />
                    </button>
                </div>
                
                <span className="text-lg font-bold text-blue-600 w-24 text-right">Kes {(item.price * item.quantity).toFixed(2)}</span>
                
                <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors ml-4 sm:ml-0">
                    <FaTrashAlt />
                </button>
            </div>
        </li>
    );
};

export default CartItem;