// frontend/components/TaxCalculator.jsx
import React, { useState } from 'react';
import axios from 'axios';

const TaxCalculator = () => {
  const [calculationType, setCalculationType] = useState('basic');
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const performCalculation = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '';
      let data = {};

      switch (calculationType) {
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
      }

      const response = await axios.post(endpoint, data);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>حاسبة الضرائب والفائدة</h2>

      <div style={styles.typeSelector}>
        <label>نوع الحساب:</label>
        <select
          value={calculationType}
          onChange={(e) => {
            setCalculationType(e.target.value);
            setResult(null);
            setError('');
          }}
          style={styles.select}
        >
          <option value="basic">حساب الضرائب والفائدة الأساسي</option>
          <option value="sellingPrice">حساب سعر البيع</option>
          <option value="margin">حساب بناءً على الهامش</option>
        </select>
      </div>

      <div style={styles.form}>
        {/* الحقول المشتركة */}
        <div style={styles.formGroup}>
          <label>سعر الشراء من المورد:</label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleInputChange}
            placeholder="مثال: 100"
            style={styles.input}
          />
        </div>

        {/* حقول الحساب الأساسي */}
        {calculationType === 'basic' && (
          <>
            <div style={styles.formGroup}>
              <label>سعر البيع للعميل:</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                placeholder="مثال: 150"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label>الكمية:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                style={styles.input}
              />
            </div>
          </>
        )}

        {/* حقول حساب سعر البيع */}
        {calculationType === 'sellingPrice' && (
          <div style={styles.formGroup}>
            <label>الربح المطلوب:</label>
            <input
              type="number"
              name="desiredProfit"
              value={formData.desiredProfit}
              onChange={handleInputChange}
              placeholder="مثال: 50"
              style={styles.input}
            />
          </div>
        )}

        {/* حقول حساب الهامش */}
        {calculationType === 'margin' && (
          <div style={styles.formGroup}>
            <label>نسبة الهامش المطلوبة (%):</label>
            <input
              type="number"
              name="profitMarginPercent"
              value={formData.profitMarginPercent}
              onChange={handleInputChange}
              placeholder="مثال: 30"
              style={styles.input}
            />
          </div>
        )}

        {/* الحقول المشتركة */}
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label>نسبة الضريبة (%):</label>
            <input
              type="number"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleInputChange}
              step="0.1"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>نسبة الفائدة (%):</label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              step="0.1"
              style={styles.input}
            />
          </div>
        </div>

        <button
          onClick={performCalculation}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'جاري الحساب...' : 'احسب'}
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {result && (
        <div style={styles.results}>
          <h3>نتائج الحساب</h3>
          <table style={styles.table}>
            <tbody>
              <tr>
                <td>سعر الشراء</td>
                <td>{result.costPrice?.toFixed(2)}</td>
              </tr>
              {result.sellingPrice && (
                <tr>
                  <td>سعر البيع</td>
                  <td>{result.sellingPrice?.toFixed(2)}</td>
                </tr>
              )}
              {result.quantity && (
                <tr>
                  <td>الكمية</td>
                  <td>{result.quantity}</td>
                </tr>
              )}
              {result.costTotal && (
                <tr>
                  <td>التكلفة الإجمالية</td>
                  <td>{result.costTotal?.toFixed(2)}</td>
                </tr>
              )}
              {result.sellingTotal && (
                <tr>
                  <td>الإيرادات الإجمالية</td>
                  <td>{result.sellingTotal?.toFixed(2)}</td>
                </tr>
              )}
              {result.profit !== undefined && (
                <tr>
                  <td>الربح الأساسي</td>
                  <td style={styles.positive}>{result.profit?.toFixed(2)}</td>
                </tr>
              )}
              {result.profitMargin !== undefined && (
                <tr>
                  <td>نسبة الهامش</td>
                  <td>{result.profitMargin?.toFixed(2)}%</td>
                </tr>
              )}
              <tr style={styles.separator}>
                <td>الضريبة ({result.taxRate}%)</td>
                <td style={styles.charge}>{result.taxAmount?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>الفائدة ({result.interestRate}%)</td>
                <td style={styles.charge}>{result.interestAmount?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>إجمالي الرسوم</td>
                <td style={styles.charge}>{result.totalCharges?.toFixed(2)}</td>
              </tr>
              <tr style={styles.highlight}>
                <td><strong>الربح الصافي</strong></td>
                <td style={styles.netPositive}>
                  <strong>{result.netProfit?.toFixed(2)}</strong>
                </td>
              </tr>
              {result.netProfitMargin !== undefined && (
                <tr style={styles.highlight}>
                  <td><strong>نسبة الربح الصافي</strong></td>
                  <td><strong>{result.netProfitMargin?.toFixed(2)}%</strong></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  },
  typeSelector: {
    marginBottom: '20px'
  },
  select: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: 'red',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#ffe6e6',
    borderRadius: '4px'
  },
  results: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  separator: {
    borderTop: '2px solid #ddd'
  },
  highlight: {
    backgroundColor: '#e8f5e9',
    fontWeight: 'bold'
  },
  positive: {
    color: 'green'
  },
  netPositive: {
    color: '#2e7d32',
    fontSize: '18px'
  },
  charge: {
    color: 'red'
  }
};

export default TaxCalculator;
