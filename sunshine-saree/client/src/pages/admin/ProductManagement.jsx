import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiEdit2, FiTrash2, FiChevronRight, FiX, FiCheck } from 'react-icons/fi';
import API from '../../utils/api';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '0',
    category: 'Silk',
    fabric: '',
    color: '',
    imagesString: '',
    stock: '',
    featured: false,
  });

  const categories = ['Silk', 'Cotton', 'Banarasi', 'Chanderi', 'Georgette', 'Designer'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products?limit=100');
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '0',
      category: 'Silk',
      fabric: '',
      color: '',
      imagesString: '',
      stock: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discountPrice: product.discountPrice ? product.discountPrice.toString() : '0',
      category: product.category,
      fabric: product.fabric || '',
      color: product.color || '',
      imagesString: product.images ? product.images.join(', ') : '',
      stock: product.stock.toString(),
      featured: product.featured || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this saree product? This cannot be undone.')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, category, stock, imagesString } = formData;
    if (!name || !description || !price || !category || !stock) {
      return toast.error('Please fill in name, description, price, category and stock');
    }

    const payload = {
      ...formData,
      price: Number(price),
      discountPrice: Number(formData.discountPrice) || 0,
      stock: Number(stock),
      images: imagesString.split(',').map((img) => img.trim()).filter((img) => img !== ''),
    };
    delete payload.imagesString;

    try {
      if (editingId) {
        // Edit Mode
        const { data } = await API.put(`/products/${editingId}`, payload);
        setProducts(products.map((p) => (p._id === editingId ? data : p)));
        toast.success('Saree updated successfully');
      } else {
        // Add Mode
        const { data } = await API.post('/products', payload);
        setProducts([data, ...products]);
        toast.success('New Saree added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const adminMenu = [
    { label: 'Overview', path: '/admin' },
    { label: 'Manage Products', path: '/admin/products', active: true },
    { label: 'Manage Orders', path: '/admin/orders' },
    { label: 'Customers', path: '/admin/customers' },
    { label: 'Support Tickets', path: '/admin/tickets' },
  ];

  if (loading) return <Loader fullPage />;

  return (
    <>
      <Helmet>
        <title>Manage Products | Admin Sunshine Saree</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-maroon">Product Inventory Management</h1>
            <p className="text-gray-500 text-sm mt-1">Add, modify and manage saree inventory catalogs.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="px-5 py-2.5 bg-maroon text-white rounded-xl text-sm font-semibold hover:bg-maroon-dark transition-colors flex items-center space-x-1.5 shadow-md"
          >
            <FiPlus />
            <span>Add New Saree</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Menu Sidebar */}
          <aside className="lg:col-span-3 space-y-1.5 self-start">
            {adminMenu.map((m, i) => (
              <Link
                key={i}
                to={m.path}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  m.active
                    ? 'bg-maroon text-white shadow-md'
                    : 'bg-white hover:bg-maroon/5 text-gray-700 hover:text-maroon border border-maroon/5'
                }`}
              >
                <span>{m.label}</span>
                <FiChevronRight className={m.active ? 'text-white' : 'text-gray-400'} />
              </Link>
            ))}
          </aside>

          {/* Right Inventory list table */}
          <main className="lg:col-span-9 bg-white rounded-2xl border border-maroon/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-xs">
                    <th className="p-4">Saree Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 flex items-center space-x-4">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/80?text=Saree'}
                          alt={product.name}
                          className="w-12 h-15 object-cover rounded border border-gray-100 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                          <span className="text-[10px] text-gray-400">{product.fabric || 'No fabric Specified'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium">{product.category}</td>
                      <td className="p-4 font-bold text-gray-800">
                        {product.discountPrice > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-maroon">₹{product.discountPrice.toLocaleString('en-IN')}</span>
                            <span className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                          </div>
                        ) : (
                          <span>₹{product.price.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          product.stock <= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {product.stock} left
                        </span>
                      </td>
                      <td className="p-4">
                        {product.featured ? (
                          <span className="text-green-600 font-bold flex items-center"><FiCheck className="mr-1" /> Yes</span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-2 text-gray-500 hover:text-maroon hover:bg-maroon/5 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Add / Edit Saree Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-[#FFF8F0] rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="font-playfair text-xl font-bold text-maroon">
                {editingId ? 'Modify Saree Masterpiece' : 'Add New Saree to Shop'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-gray-200">
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Saree Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Peacock Blue Georgette Saree"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe fabric weaving, zari borders, colors..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Original Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 8999"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount Price (₹)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleInputChange}
                    placeholder="e.g. 7499 (0 if none)"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Available Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="e.g. 10"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fabric details</label>
                  <input
                    type="text"
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleInputChange}
                    placeholder="e.g. Pure Georgette Silk"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color name</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g. Peacock Blue"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URLs (comma-separated)</label>
                <input
                  type="text"
                  name="imagesString"
                  value={formData.imagesString}
                  onChange={handleInputChange}
                  placeholder="https://domain.com/pic1.jpg, https://domain.com/pic2.jpg"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-maroon focus:ring-1 focus:ring-maroon/20 bg-white"
                />
              </div>

              <label className="flex items-center space-x-3 text-sm text-gray-600 cursor-pointer pt-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-maroon focus:ring-maroon/20"
                />
                <span>Set as Featured Best-Seller Saree</span>
              </label>

              <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-maroon text-white rounded-lg font-semibold hover:bg-maroon-dark transition-colors"
                >
                  Save Saree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductManagement;
