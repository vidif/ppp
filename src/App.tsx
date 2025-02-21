import React, { useState } from 'react';
import { products } from './data/products';
import type { Product } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'main' | 'mixed' | 'fries' | 'drinks'>('main');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'home'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState<string>('');

  const generateOrderNumber = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-last-order-number');
      const { lastNumber } = await response.json();
      const currentNumber = (lastNumber ? parseInt(lastNumber.split('-')[1]) : 0) + 1;
      const paddedNumber = currentNumber.toString().padStart(3, '0');
      const date = new Date();
      return `CP${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${paddedNumber}`;
    } catch (error) {
      // Fallback to random number if function fails
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const date = new Date();
      return `CP${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${random}`;
    }
  };

  const hasProducts = () => {
    return Object.values(quantities).some(quantity => quantity > 0);
  };

  const changeQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
    setError('');
  };

  const calculateTotal = () => {
    let total = Object.entries(quantities).reduce((sum, [productId, quantity]) => {
      const product = Object.values(products).flat().find(p => p.id === productId);
      return sum + (product?.price || 0) * quantity;
    }, 0);
    
    if (deliveryType === 'home') {
      total += 35;
    }
    
    return total;
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Por favor ingrese su nombre');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Por favor ingrese su teléfono');
      return false;
    }
    if (deliveryType === 'home' && !formData.address.trim()) {
      setError('Por favor ingrese la dirección de entrega');
      return false;
    }
    if (!hasProducts()) {
      setError('Por favor seleccione al menos un producto');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const orderNumber = await generateOrderNumber();
    const orderItems = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, qty]) => {
        const product = Object.values(products).flat().find(p => p.id === productId);
        return `${qty}x ${product?.name}`;
      })
      .join(', ');

    const orderDate = new Date().toLocaleString('es-MX', {
      timeZone: 'America/Mexico_City'
    });

    const formDataToSend = {
      'form-name': 'orders',
      orderNumber,
      customerName: formData.name,
      customerPhone: formData.phone,
      deliveryType,
      deliveryAddress: formData.address,
      paymentMethod,
      items: orderItems,
      total: calculateTotal().toString(),
      orderDate
    };

    try {
      // Enviar a Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSend).toString()
      });

      if (!response.ok) {
        throw new Error('Error al enviar el pedido');
      }

      // Preparar mensaje de WhatsApp
      const message = `
🍗 *NUEVO PEDIDO* 🍗
📋 *Número de Pedido*: ${orderNumber}

👤 *Datos del Cliente*:
• Nombre: ${formData.name}
• Teléfono: ${formData.phone}

🛵 *Detalles de Entrega*:
• Tipo: ${deliveryType === 'home' ? 'Domicilio (+$35)' : 'Mostrador'}
${deliveryType === 'home' ? `• Dirección: ${formData.address}` : ''}
• Método de Pago: ${paymentMethod.toUpperCase()}

📋 *Detalle del Pedido*:
${Object.entries(quantities)
  .filter(([_, qty]) => qty > 0)
  .map(([productId, qty]) => {
    const product = Object.values(products).flat().find(p => p.id === productId);
    return `• ${qty}x ${product?.name}`;
  })
  .join('\n')}

💵 *Total a Pagar*: $${calculateTotal()}
      `;

      window.open(`https://wa.me/+526674033400?text=${encodeURIComponent(message)}`, '_blank');

      // Resetear formulario
      setQuantities({});
      setFormData({ name: '', phone: '', address: '' });
      setDeliveryType('pickup');
      setPaymentMethod('cash');
      setError('');
    } catch (error) {
      setError('Error al enviar el pedido. Por favor intente nuevamente.');
    }
  };

  const renderProduct = (product: Product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md p-4 flex flex-wrap items-center gap-4">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-lg font-bold text-red-600">${product.price}</p>
        {product.description && (
          <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => changeQuantity(product.id, -1)}
          className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          -
        </button>
        <span className="text-lg font-semibold min-w-[20px] text-center">
          {quantities[product.id] || 0}
        </span>
        <button 
          onClick={() => changeQuantity(product.id, 1)}
          className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto p-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">CostyPollos</h1>
          <p className="text-gray-600">Los mejores pollos y costillas asadas de la ciudad</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-2 mb-6 flex overflow-x-auto">
          {(['main', 'mixed', 'fries', 'drinks'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-3 text-center rounded-lg transition-colors ${
                activeTab === tab ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab === 'main' && '🍗 Pollos y Costillas'}
              {tab === 'mixed' && '🥘 Paquetes Mixtos'}
              {tab === 'fries' && '🍟 Papas Fritas'}
              {tab === 'drinks' && '🥤 Bebidas'}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          {products[activeTab].map(renderProduct)}
        </div>

        <form 
          onSubmit={handleSubmit}
          className="space-y-4 bg-white rounded-lg shadow-md p-6"
          method="POST"
          data-netlify="true"
          name="orders"
        >
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <input type="hidden" name="form-name" value="orders" />
          
          <input
            type="text"
            name="customerName"
            placeholder="Nombre completo"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="tel"
            name="customerPhone"
            placeholder="Teléfono de contacto"
            value={formData.phone}
            onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border rounded-lg"
            required
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDeliveryType('pickup');
                setFormData(prev => ({ ...prev, address: '' }));
              }}
              className={`flex-1 p-3 rounded-lg ${
                deliveryType === 'pickup' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              🏬 Recoger en Mostrador
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType('home')}
              className={`flex-1 p-3 rounded-lg ${
                deliveryType === 'home' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              🏠 A Domicilio (+$35)
            </button>
          </div>

          {deliveryType === 'home' && (
            <input
              type="text"
              name="deliveryAddress"
              placeholder="Dirección de entrega"
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-3 border rounded-lg"
              required
            />
          )}

          <div className="flex gap-2">
            {(['cash', 'card', 'transfer'] as const).map(method => (
              <button
                type="button"
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 p-3 rounded-lg ${
                  paymentMethod === method 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {method === 'cash' && '💵 Efectivo'}
                {method === 'card' && '💳 Tarjeta'}
                {method === 'transfer' && '🏦 Transferencia'}
              </button>
            ))}
          </div>

          <div className="text-2xl font-bold text-center py-4">
            Total: ${calculateTotal()}
          </div>

          <button
            type="submit"
            className={`w-full p-4 rounded-lg font-bold transition-colors ${
              hasProducts() 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!hasProducts()}
          >
            {hasProducts() ? 'Enviar Pedido por WhatsApp' : 'Seleccione al menos un producto'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;