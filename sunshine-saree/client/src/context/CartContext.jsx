import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Load from localStorage for guests
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(localCart);
      calculateTotal(localCart);
    }
  }, [isAuthenticated]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCartItems(data.items || []);
      setTotalAmount(data.totalAmount || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const { data } = await API.post('/cart/add', {
          productId: product._id,
          quantity,
        });
        setCartItems(data.items || []);
        setTotalAmount(data.totalAmount || 0);
      } catch (error) {
        throw error;
      }
    } else {
      const existingIndex = cartItems.findIndex(
        (item) => (item.product?._id || item.product) === product._id
      );

      let newItems;
      if (existingIndex >= 0) {
        newItems = [...cartItems];
        newItems[existingIndex].quantity += quantity;
      } else {
        newItems = [
          ...cartItems,
          {
            product: {
              _id: product._id,
              name: product.name,
              images: product.images,
              price: product.price,
              discountPrice: product.discountPrice,
              stock: product.stock,
            },
            quantity,
            price: product.discountPrice || product.price,
          },
        ];
      }
      setCartItems(newItems);
      calculateTotal(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        const { data } = await API.put('/cart/update', { productId, quantity });
        setCartItems(data.items || []);
        setTotalAmount(data.totalAmount || 0);
      } catch (error) {
        throw error;
      }
    } else {
      const newItems = cartItems
        .map((item) => {
          const id = item.product?._id || item.product;
          if (id === productId) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      setCartItems(newItems);
      calculateTotal(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const { data } = await API.delete(`/cart/remove/${productId}`);
        setCartItems(data.items || []);
        setTotalAmount(data.totalAmount || 0);
      } catch (error) {
        throw error;
      }
    } else {
      const newItems = cartItems.filter(
        (item) => (item.product?._id || item.product) !== productId
      );
      setCartItems(newItems);
      calculateTotal(newItems);
      localStorage.setItem('cart', JSON.stringify(newItems));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await API.delete('/cart/clear');
        setCartItems([]);
        setTotalAmount(0);
      } catch (error) {
        throw error;
      }
    } else {
      setCartItems([]);
      setTotalAmount(0);
      localStorage.removeItem('cart');
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalAmount,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
