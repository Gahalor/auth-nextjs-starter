import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function GET(request:NextRequest){

    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error:", error.message); // Asegúrate de registrar el error para debugging
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error("Error: Unknown error");
            return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
        }
    }

}