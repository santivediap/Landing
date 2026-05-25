// src/pages/api/send-email.js

// Le decimos a Astro que ESTE archivo en concreto debe ejecutarse en el servidor
export const prerender = false;

export const POST = async ({ request }) => {
    try {
        // 1. Extraemos los datos que envió tu JS del Frontend
        const data = await request.json();
        const { subject, email, message } = data;

        // 2. Validación básica en el servidor (Nunca confíes solo en el frontend)
        if (!subject || !email || !message) {
            return new Response(
                JSON.stringify({ error: "Faltan campos obligatorios" }),
                { status: 400 }
            );
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Portfolio Contact <onboarding@resend.dev>',
                to: 'santivediap@gmail.com',
                subject: `${subject}`,
                html: `
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Mensaje:</strong><br/>${message}</p>
                `
            })
        });

        if (resendResponse.ok) {
            return new Response(
                JSON.stringify({ message: "Correo enviado con éxito" }),
                { status: 200 }
            );
        } else {
            const errorData = await resendResponse.json();
            throw new Error(errorData.message || "Error al comunicarse con Resend");
        }

    } catch (error) {
        // 5. Manejo de errores seguro (no exponemos detalles técnicos al usuario)
        console.error("Error en el Worker:", error);
        return new Response(
            JSON.stringify({ error: "Error interno del servidor" }),
            { status: 500 }
        );
    }
};