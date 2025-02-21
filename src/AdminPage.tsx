import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Order {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: string;
  total: string;
  orderDate: string;
}

function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-orders');
        if (!response.ok) {
          throw new Error('Error al cargar los pedidos');
        }
        const data = await response.json();
        setOrders(data.sort((a: Order, b: Order) => 
          b.orderNumber.localeCompare(a.orderNumber)
        ));
      } catch (err) {
        setError('Error al cargar los pedidos. Por favor intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/" 
            className="flex items-center text-red-600 hover:text-red-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Volver al menú</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Pedidos Recibidos</h1>
        </div>

        <div className="grid gap-4">
          {orders.map((order) => (
            <div 
              key={order.orderNumber} 
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-red-600">
                    Pedido #{order.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-500">{order.orderDate}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {order.paymentMethod.toUpperCase()}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Datos del Cliente</h3>
                  <p><span className="font-medium">Nombre:</span> {order.customerName}</p>
                  <p><span className="font-medium">Teléfono:</span> {order.customerPhone}</p>
                  <p>
                    <span className="font-medium">Tipo de Entrega:</span> 
                    {order.deliveryType === 'home' ? ' A Domicilio' : ' Recoger en Mostrador'}
                  </p>
                  {order.deliveryType === 'home' && (
                    <p><span className="font-medium">Dirección:</span> {order.deliveryAddress}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Detalles del Pedido</h3>
                  <div className="space-y-1">
                    {order.items.split(', ').map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                  <p className="mt-4 text-lg font-bold text-red-600">
                    Total: ${order.total}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPage