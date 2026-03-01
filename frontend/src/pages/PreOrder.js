import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Bell, Rocket, CalendarDays } from 'lucide-react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import useLangStore from './store/langStore';

const PreOrder = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState({});
  const { t } = useLangStore();

  const comingSoonItems = [
    {
      title: t('preOrder.item1Title'),
      description: t('preOrder.item1Desc'),
      date: 'Q2 2026',
      icon: Rocket,
    },
    {
      title: t('preOrder.item2Title'),
      description: t('preOrder.item2Desc'),
      date: 'Q3 2026',
      icon: Clock,
    },
    {
      title: t('preOrder.item3Title'),
      description: t('preOrder.item3Desc'),
      date: 'Q4 2026',
      icon: CalendarDays,
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getProducts({ sort: 'newest', limit: 4 });
        setProducts(response.data.products || response.data || []);
      } catch (err) {
        console.error('Failed to fetch pre-order products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleNotify = (title) => {
    setNotified((prev) => ({ ...prev, [title]: true }));
  };

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
            <Rocket className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">{t('preOrder.badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">{t('preOrder.title')}</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('preOrder.subtitle')}
          </p>
        </motion.div>

        {/* Coming Soon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {comingSoonItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-zinc-500 text-sm">{item.date}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm mb-5 flex-1">{item.description}</p>
              <button
                onClick={() => handleNotify(item.title)}
                disabled={notified[item.title]}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                  notified[item.title]
                    ? 'bg-zinc-800 text-zinc-400 cursor-default'
                    : 'bg-orange-500 hover:bg-orange-600 text-black'
                }`}
              >
                <Bell className="w-4 h-4" />
                {notified[item.title] ? t('preOrder.notifSet') : t('preOrder.notifyMe')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Available for Pre-Order */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">{t('preOrder.availableNow')}</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-zinc-800 animate-pulse rounded-2xl h-80" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">{t('preOrder.empty')}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PreOrder;
