import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, TrendingUp, DollarSign, Percent,
  AlertTriangle, Loader2, RefreshCw, Download, Eye, EyeOff
} from 'lucide-react';
import axios from 'axios';

const TaxManager = () => {
  const [activeSection, setActiveSection] = useState('calculator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculator form data
  const [calcType, setCalcType] = useState('basic');
  const [formData, setFormData] = useState({
    costPrice: '',
    sellingPrice: '',
    quantity: 1,
    taxRate: 15,
    interestRate: 5,
    desiredProfit: '',
    profitMarginPercent: ''
  });
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(true);

  // Reports
  const [summary, setSummary] = useState(null);
  const [report, setReport] = useState([]);

  const getAuthToken = () => localStorage.getItem('adminToken') || localStorage.getItem('authToken');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTax = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let endpoint = '';
      let data = {};

      switch (calcType) {
        case 'basic':
          endpoint = '/api/tax/calculate';
          data = {
            costPrice: parseFloat(formData.costPrice),
            sellingPrice: parseFloat(formData.sellingPrice),
            quantity: parseInt(formData.quantity),
            taxRate: parseFloat(formData.taxRate) / 100,
            interestRate: parseFloat(formData.interestRate) / 100
          };
          break;

        case 'sellingPrice':
          endpoint = '/api/tax/calculate-selling-price';
          data = {
            costPrice: parseFloat(formData.costPrice),
            desiredProfit: parseFloat(formData.desiredProfit),
            taxRate: parseFloat(formData.taxRate) / 100,
            interestRate: parseFloat(formData.interestRate) / 100
          };
          break;

        case 'margin':
          endpoint = '/api/tax/calculate-by-margin';
          data = {
            costPrice: parseFloat(formData.costPrice),
            profitMarginPercent: parseFloat(formData.profitMarginPercent),
            taxRate: parseFloat(formData.taxRate) / 100,
            interestRate: parseFloat(formData.interestRate) / 100
          };
          break;

        default:
          return;
      }

      const token = getAuthToken();
      const response = await axios.post(`http://localhost:5000${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setResult(response.data.data);
      setSuccess('تم الحساب بنجاح!');
      setShowResult(true);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في الحساب');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:5000/api/tax/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSummary(response.data.data);
    } catch (err) {
      setError('فشل تحميل الملخص');
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:5000/api/tax/report', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReport(response.data.data);
    } catch (err) {
      setError('فشل تحميل التقرير');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'summary') fetchSummary();
    if (activeSection === 'report') fetchReport();
  }, [activeSection]);

  const ResultCard = () => {
    if (!result) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            CALCULATION RESULTS
          </h3>
          <button
            onClick={() => setShowResult(!showResult)}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            {showResult ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {showResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.costPrice && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-1">COST PRICE</p>
                <p className="text-white font-bold text-lg">{result.costPrice} DZD</p>
              </div>
            )}
            {result.sellingPrice && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-1">SELLING PRICE</p>
                <p className="text-white font-bold text-lg">{result.sellingPrice} DZD</p>
              </div>
            )}
            {result.costTotal && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-1">TOTAL COST</p>
                <p className="text-white font-bold text-lg">{result.costTotal} DZD</p>
              </div>
            )}
            {result.sellingTotal && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-1">TOTAL REVENUE</p>
                <p className="text-white font-bold text-lg">{result.sellingTotal} DZD</p>
              </div>
            )}
            {result.profit !== undefined && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-sm mb-1">GROSS PROFIT</p>
                <p className="text-green-400 font-bold text-lg">{result.profit} DZD</p>
              </div>
            )}
            {result.taxAmount && (
              <div className="bg-zinc-800 rounded-xl p-4 border border-red-500/20">
                <p className="text-zinc-400 text-sm mb-1">TAX ({result.taxRate}%)</p>
                <p className="text-red-400 font-bold text-lg">{result.taxAmount} DZD</p>
              </div>
            )}
            {result.interestAmount && (
              <div className="bg-zinc-800 rounded-xl p-4 border border-orange-500/20">
                <p className="text-zinc-400 text-sm mb-1">INTEREST ({result.interestRate}%)</p>
                <p className="text-orange-400 font-bold text-lg">{result.interestAmount} DZD</p>
              </div>
            )}
            {result.netProfit !== undefined && (
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/50 lg:col-span-1 sm:col-span-2">
                <p className="text-zinc-300 text-sm mb-1">NET PROFIT ✅</p>
                <p className="text-emerald-400 font-black text-2xl">{result.netProfit} DZD</p>
                {result.netProfitMargin !== undefined && (
                  <p className="text-emerald-400/70 text-xs mt-1">{result.netProfitMargin}% MARGIN</p>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white font-black text-2xl flex items-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-orange-400" />
          TAXES & PROFIT CALCULATOR
        </h2>
        <p className="text-zinc-400 text-sm">Calculate taxes and interest on sales based on supplier and selling prices</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'calculator', label: '🧮 Calculator', icon: Calculator },
          { id: 'summary', label: '📊 Summary', icon: TrendingUp },
          { id: 'report', label: '📋 Report', icon: RefreshCw }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-orange-500 text-black'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500 rounded-xl p-4 flex items-start gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
          <p className="text-green-400 text-sm">{success}</p>
        </div>
      )}

      {/* Calculator Section */}
      {activeSection === 'calculator' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-bold">CALCULATION TYPE</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'basic', label: 'BASIC CALCULATION' },
                { id: 'sellingPrice', label: 'CALCULATE SELLING PRICE' },
                { id: 'margin', label: 'CALCULATE BY MARGIN' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setCalcType(type.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                    calcType === type.id
                      ? 'bg-orange-500 text-black'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={calculateTax} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-400 text-sm font-bold mb-2 block">SUPPLIER COST PRICE</label>
                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  placeholder="100"
                  step="0.01"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 outline-none transition-colors"
                  required
                />
              </div>

              {calcType === 'basic' && (
                <div>
                  <label className="text-zinc-400 text-sm font-bold mb-2 block">SELLING PRICE</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleInputChange}
                    placeholder="150"
                    step="0.01"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 outline-none transition-colors"
                    required
                  />
                </div>
              )}

              {calcType === 'sellingPrice' && (
                <div>
                  <label className="text-zinc-400 text-sm font-bold mb-2 block">DESIRED PROFIT</label>
                  <input
                    type="number"
                    name="desiredProfit"
                    value={formData.desiredProfit}
                    onChange={handleInputChange}
                    placeholder="50"
                    step="0.01"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 outline-none transition-colors"
                    required
                  />
                </div>
              )}

              {calcType === 'margin' && (
                <div>
                  <label className="text-zinc-400 text-sm font-bold mb-2 block">DESIRED MARGIN (%)</label>
                  <input
                    type="number"
                    name="profitMarginPercent"
                    value={formData.profitMarginPercent}
                    onChange={handleInputChange}
                    placeholder="30"
                    step="0.1"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 outline-none transition-colors"
                    required
                  />
                </div>
              )}

              {calcType === 'basic' && (
                <div>
                  <label className="text-zinc-400 text-sm font-bold mb-2 block">QUANTITY</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 outline-none transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="text-zinc-400 text-sm font-bold mb-2 block">TAX RATE (%)</label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-sm font-bold mb-2 block">INTEREST RATE (%)</label>
                <input
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:border-orange-500 outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> CALCULATING...
                </>
              ) : (
                <>
                  <Calculator className="w-4 h-4" /> CALCULATE
                </>
              )}
            </button>
          </form>

          <ResultCard />
        </motion.div>
      )}

      {/* Summary Section */}
      {activeSection === 'summary' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : summary ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400 text-sm mb-2">إجمالي الضرائب</p>
                <p className="text-white font-black text-2xl">{summary.total_taxes} DZD</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400 text-sm mb-2">إجمالي الفائدة</p>
                <p className="text-white font-black text-2xl">{summary.total_interests} DZD</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className="text-zinc-400 text-sm mb-2">إجمالي الرسوم</p>
                <p className="text-white font-black text-2xl">{summary.total_charges} DZD</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-2xl p-6">
                <p className="text-zinc-400 text-sm mb-2">إجمالي الأرباح</p>
                <p className="text-emerald-400 font-black text-2xl">{summary.total_profit} DZD</p>
              </div>
            </div>
          ) : null}
        </motion.div>
      )}

      {/* Report Section */}
      {activeSection === 'report' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : report && report.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left px-4 py-3 text-zinc-400 font-bold">المورد</th>
                      <th className="text-right px-4 py-3 text-zinc-400 font-bold">سعر الشراء</th>
                      <th className="text-right px-4 py-3 text-zinc-400 font-bold">الكمية</th>
                      <th className="text-right px-4 py-3 text-zinc-400 font-bold">الضريبة</th>
                      <th className="text-right px-4 py-3 text-zinc-400 font-bold">الفائدة</th>
                      <th className="text-right px-4 py-3 text-zinc-400 font-bold">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((item, i) => (
                      <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                        <td className="px-4 py-3 text-white">{item.supplier_name || 'N/A'}</td>
                        <td className="text-right px-4 py-3 text-white">{item.cost_price} DZD</td>
                        <td className="text-right px-4 py-3 text-white">{item.quantity}</td>
                        <td className="text-right px-4 py-3 text-red-400">{item.tax_amount} DZD</td>
                        <td className="text-right px-4 py-3 text-orange-400">{item.interest_amount} DZD</td>
                        <td className="text-right px-4 py-3 text-zinc-400">{new Date(item.created_at).toLocaleDateString('ar-SA')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-zinc-400">لا توجد تقارير حتى الآن</div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TaxManager;
