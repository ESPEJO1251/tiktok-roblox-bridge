const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const TOKEN = '21191517';

let queue = [];

app.use(express.json());

// Recibe los datos enviados por TikFinity
app.get('/webhook', (req, res) => {
    if (req.query.token !== TOKEN) {
        return res.status(403).send('Token inválido');
    }

    const username = req.query.username;
    if (username) {
        queue.push(username);
        console.log(`Usuario agregado a la cola: ${username}`);
        res.status(200).send('Guardado');
    } else {
        res.status(400).send('Falta el usuario');
    }
});

// Entrega la cola a Roblox Studio
app.get('/queue', (req, res) => {
    if (req.query.token !== TOKEN) {
        return res.status(403).send('Token inválido');
    }

    res.json(queue);
    queue = []; // Limpia la cola después de entregarla para que no se repitan
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
