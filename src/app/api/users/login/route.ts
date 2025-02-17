import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        // Validación de los campos en el cuerpo de la solicitud
        const reqBody = await request.json();
        const { email, password } = reqBody;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        console.log(reqBody);

        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });
        }
        console.log("User exists");

        // Verificar la validez de la contraseña
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }
        console.log(user);

        // Crear los datos del token
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        // Crear el token JWT
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        // Respuesta con el mensaje de éxito y el token
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        // Configuración de la cookie con httpOnly
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Asegúrate de que en producción se use HTTPS
            sameSite: "strict", // Mejora la seguridad
        });

        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Login error:", error.message); // Asegúrate de registrar el error para debugging
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Login error: Unknown error");
            return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
        }
    }
}
