import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Percent, Timer } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import useLangStore from './store/langStore';

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLangStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts({ limit: 20 });
        const all = response.data.products || response.data || [];
        // Filter products that have a discount (original_price > price)
        const onSale = all.filter(
          (p) => p.original_price && p.original_price > p.price
        );
        setProducts(onSale.length > 0 ? onSale : all.slice(0, 8));
      } catch (err) {
        console.error('Failed to fetch sale products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gradient-to-r from-orange-500/20 via-zinc-900 to-orange-500/10 border border-orange-500/20 rounded-2xl p-8 sm:p-12 mb-12 overflow-hidden"
        >
          <div className="absolute top-4 right-4 bg-orange-500 text-black font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <Timer className="w-3 h-3" /> {t('sale.limitedTime')}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-5 h-5 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">{t('sale.discount')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{t('sale.title')}</h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            {t('sale.subtitle')}
          </p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-zinc-800 animate-pulse rounded-2xl h-80" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <Tag className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">{t('sale.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sale;
