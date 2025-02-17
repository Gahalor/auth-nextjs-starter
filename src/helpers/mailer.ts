import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

// Definimos una interfaz para los parámetros
interface SendEmailParams {
    email: string;
    emailType: "VERIFY" | "RESET"; // Solo dos tipos posibles
    userId: string; // El ID debe ser un string
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailParams) => {
    try {
        // Crear un token hashed para el usuario
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        // Verificar el tipo de correo y actualizar el usuario en la base de datos
        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // 1 hora de expiración
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hora de expiración
            });
        }

        // Crear el transportador de nodemailer
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAIL_USER || "", // Utiliza una variable de entorno
                pass: process.env.MAIL_PASS || "", // Utiliza una variable de entorno
            },
        });

        // Verificación de variables de entorno
        if (!process.env.DOMAIN) {
            throw new Error("DOMAIN environment variable is not defined.");
        }

        const mailOptions = {
            from: 'tester@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
        };

        // Enviar el correo
        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;
        
    } catch (error: unknown) {
        // Verificamos si el error es una instancia de Error
        if (error instanceof Error) {
            console.error("Error in sendEmail function:", error.message);
            throw new Error(error.message);
        } else {
            // En caso de que el error no sea una instancia de Error, lanzar un mensaje genérico
            console.error("Unknown error:", error);
            throw new Error("An unknown error occurred.");
        }
    }
};
