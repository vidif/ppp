import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Verificar autenticación (deberías implementar esto)
  
  try {
    // Obtener el token de acceso de Netlify (necesitarás configurar esto en las variables de entorno)
    const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
    const SITE_ID = process.env.SITE_ID; // El ID de tu sitio en Netlify

    if (!NETLIFY_ACCESS_TOKEN || !SITE_ID) {
      throw new Error('Faltan credenciales de Netlify');
    }

    // Obtener las submissions del formulario desde la API de Netlify
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/forms/${process.env.FORM_ID}/submissions`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener los pedidos de Netlify');
    }

    const submissions = await response.json();

    // Transformar las submissions al formato que necesitamos
    const orders = submissions.map((submission: any) => ({
      orderNumber: submission.data.orderNumber,
      customerName: submission.data.customerName,
      customerPhone: submission.data.customerPhone,
      deliveryType: submission.data.deliveryType,
      deliveryAddress: submission.data.deliveryAddress,
      paymentMethod: submission.data.paymentMethod,
      items: submission.data.items,
      total: submission.data.total,
      orderDate: submission.data.orderDate
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(orders)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener los pedidos' })
    };
  }
};