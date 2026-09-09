// Asegúrate de tener esto configurado al inicio de tu app de Express:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modifica o reemplaza tu ruta /webhook por esta:
app.all('/webhook', (req, res) => {
    // Captura el usuario ya sea por la URL (query) o por el cuerpo JSON que envía TikFinity (body)
    const username = req.query.username || req.body.uniqueId || req.body.username || req.body.user;
    
    if (username) {
        // Limpiar la arroba por si viene incluida
        const cleanName = username.replace(/^@/, '');
        
        // Agregar a la cola de Render
        queue.push({ username: cleanName });
        console.log("Usuario recibido y añadido a la cola:", cleanName);
        
        res.status(200).send("OK");
    } else {
        console.log("Webhook recibido pero sin usuario. Body:", req.body, "Query:", req.query);
        res.status(400).send("Falta el usuario");
    }
});
