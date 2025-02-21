import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  try {
    // Obtener el token de acceso de Netlify
    const NETLIFY_ACCESS_TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
    const SITE_ID = process.env.SITE_ID;

    if (!NETLIFY_ACCESS_TOKEN || !SITE_ID) {
      throw new Error('Faltan credenciales de Netlify');
    }

    // Obtener la última submission del formulario
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${SITE_ID}/forms/${process.env.FORM_ID}/submissions?per_page=1`,
      {
        headers: {
          Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener el último número de pedido');
    }

    const submissions = await response.json();
    const lastNumber = submissions[0]?.data.orderNumber || 'CP20250215-000';

    return {
      statusCode: 200,
      body: JSON.stringify({ lastNumber })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al obtener el último número de pedido' })
    };
  }
};