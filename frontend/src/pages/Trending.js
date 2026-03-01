import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import useLangStore from './store/langStore';

const Trending = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLangStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts({ sort: 'popular', limit: 12 });
        setProducts(response.data.products || response.data || []);
      } catch (err) {
        console.error('Failed to fetch trending products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">{t('trending.badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{t('trending.title')}</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('trending.subtitle')}
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            { label: t('trending.statProducts'), value: products.length || '—', icon: TrendingUp },
            { label: t('trending.statUpdated'), value: t('trending.statLive'), icon: Flame },
            { label: t('trending.statThisWeek'), value: t('trending.statTopPicks'), icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
              <stat.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-zinc-500 text-xs">{stat.label}</p>
            </div>
          ))}
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
            transition={{ delay: 0.3 }}
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
            <TrendingUp className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">{t('trending.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
