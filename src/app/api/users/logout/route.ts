import { NextResponse } from "next/server";


export async function GET() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout successful",
                success: true,
            }
        )
        response.cookies.set("token", "", 
        { httpOnly: true, expires: new Date(0) 
        });
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Logout error:", error.message); // Asegúrate de registrar el error para debugging
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Logout error: Unknown error");
            return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
        }
    }
        
    }
