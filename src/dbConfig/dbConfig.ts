import mongoose from "mongoose";

export async function connect() {
    try {
        // Asegúrate de que la URI esté configurada
        if (!process.env.MONGO_URI) {
            throw new Error("MongoDB URI is not defined in the environment variables.");
        }

        await mongoose.connect(process.env.MONGO_URI);

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            // Aquí puedes agregar más lógica para reintentar la conexión, si es necesario
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error instanceof Error ? error.message : error);
        // Aquí podrías manejar el error de una forma más personalizada, dependiendo de tu aplicación
        process.exit(1); // Terminar el proceso con un código de error si la conexión falla
    }
}
