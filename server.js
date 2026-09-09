const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let queue = [];

// Ruta para que Roblox lea la cola
app.get('/queue', (req, res) => {
    const token = req.query.token || req.headers['authorization'];
    if (token === "21191517") {
        res.json(queue);
        queue = []; // Vaciar la cola una vez que Roblox la descarga
    } else {
        res.status(403).send("Unauthorized");
    }
});

// Ruta para recibir los webhooks de TikFinity
app.all('/webhook', (req, res) => {
    const username = req.query.username || req.body.uniqueId || req.body.username || req.body.user;

    if (username) {
        const cleanName = username.replace(/^@/, '');
        queue.push({ username: cleanName });
        console.log("Usuario recibido y añadido a la cola:", cleanName);
        res.status(200).send("OK");
    } else {
        console.log("Webhook recibido pero sin usuario. Body:", req.body, "Query:", req.query);
        res.status(400).send("Falta el usuario");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
