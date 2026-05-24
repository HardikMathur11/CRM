import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { formatCurrency } from '../../utils/helpers';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Plus, X, Tag, Loader2 } from 'lucide-react';

const ProductList = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Steel',
    sku: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching products:', error);
      toast.error('Failed to load products list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await axiosInstance.post('/products', formData);
      toast.success('Product created successfully!');
      setShowAddForm(false);
      setFormData({ name: '', description: '', price: 0, category: 'Steel', sku: '' });
      fetchProducts();
    } catch (error) {
      console.log('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="Products Catalogue" />

        {/* Action Header bar */}
        <div className="bg-white border-b border-gray-100 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Review catalogue items, pricing specs, and stock SKUs
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-between bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all self-start sm:self-center"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          )}
        </div>

        {/* Products Grid */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="h-48 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-xs text-gray-400 font-medium bg-white p-6 shadow-sm">
              No products registered in the catalogue.
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/75 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Item Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">SKU Code</th>
                      <th className="px-6 py-4">Standard Price</th>
                      <th className="px-6 py-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                    {products.map(product => (
                      <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">{product.name}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded border border-gray-100 bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 uppercase font-mono">{product.sku || 'N/A'}</td>
                        <td className="px-6 py-4 font-bold text-indigo-600">{formatCurrency(product.price)}</td>
                        <td className="px-6 py-4 text-gray-400 font-normal">{product.description || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-base">Add New Product</h3>
              <button 
                onClick={() => setShowAddForm(false)} 
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seamless Steel Pipes"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Specs and details..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Standard Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-600 outline-none"
                  >
                    <option value="Steel">Steel</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Gears">Gears</option>
                    <option value="Motors">Motors</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">SKU / Part Number</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="STL-PIPE-001"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-semibold text-gray-700 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>{submitting ? 'Creating...' : 'Register'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
