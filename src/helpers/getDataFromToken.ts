import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define una interfaz para los datos que esperamos obtener del token
interface DecodedToken extends JwtPayload {
    id: string;
}

export const getDataFromToken = (request: NextRequest): string | null => {
    try {
        // Obtener el token de las cookies
        const token = request.cookies.get("token")?.value || '';
        
        // Si el token está vacío, lanzamos un error
        if (!token) {
            throw new Error("Token not found");
        }

        // Verificamos y decodificamos el token
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as DecodedToken;

        // Devolvemos el ID del usuario del token decodificado
        return decodedToken.id;
    } catch (error) {
        // Manejo de errores más específico
        console.error("Error decoding token:", error);
        return null;  // O puedes lanzar un error si prefieres que falle la ejecución
    }
}
