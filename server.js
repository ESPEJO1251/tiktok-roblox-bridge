const express = require('express');
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN || "cambia-esto-por-algo-secreto";
const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME || "";

let userQueue = [];

const ES_NOMBRE_ROBLOX_VALIDO = (texto) => /^[a-zA-Z0-9_]{3,20}$/.test(texto);

if (TIKTOK_USERNAME && TIKTOK_USERNAME.trim() !== "") {
    const tiktokConnection = new WebcastPushConnection(TIKTOK_USERNAME);

    tiktokConnection.connect().then(() => {
        console.log(`[TikTok Live] Conectado al Live de @${TIKTOK_USERNAME}`);
    }).catch(err => {
        console.error('[TikTok Live] Error al conectar:', err.message);
    });

    tiktokConnection.on('chat', data => {
        const posibleUsuario = data.comment.trim();

        if (ES_NOMBRE_ROBLOX_VALIDO(posibleUsuario)) {
            const existeEnCola = userQueue.some(
                item => item.username.toLowerCase() === posibleUsuario.toLowerCase()
            );

            if (!existeEnCola) {
                userQueue.push({ username: posibleUsuario });
                console.log(`[TikTok Chat] Agregado: ${posibleUsuario}`);
            }
        }
    });
}

app.post('/webhook/tikfinity', (req, res) => {
    const { token, username } = req.body;

    if (token !== BRIDGE_TOKEN) {
        return res.status(401).json({ error: "Token no autorizado" });
    }

    if (username) {
        const posibleUsuario = String(username).trim();

        if (ES_NOMBRE_ROBLOX_VALIDO(posibleUsuario)) {
            const existeEnCola = userQueue.some(
                item => item.username.toLowerCase() === posibleUsuario.toLowerCase()
            );

            if (!existeEnCola) {
                userQueue.push({ username: posibleUsuario });
                console.log(`[TikFinity] Agregado: ${posibleUsuario}`);
            }
        }
    }

    res.json({ status: "success" });
});

app.get('/queue', (req, res) => {
    const token = req.query.token;

    if (token !== BRIDGE_TOKEN) {
        return res.status(401).json({ error: "Token no autorizado" });
    }

    const usuariosPendientes = [...userQueue];
    userQueue = [];

    res.json(usuariosPendientes);
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
