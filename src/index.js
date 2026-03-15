require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(cors());

const DB_FILE = path.join(__dirname, 'db.json');
const ALGORITHM = 'aes-256-gcm';

if (!process.env.SECR3T_KEY) {
    console.error("error: Var SECR3T_KEY not found in .env");
    process.exit(1);
}

const SECR3T_KEY = crypto.scryptSync(process.env.SECR3T_KEY, 'salt', 32);

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE));
};

const saveDB = (dados) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
};

function middleware(req, res, next) {
    const userId = req.headers['user-id']; 

    if (userId) {
        
        next(); 
    } else {
        
        res.status(401).json({ erro: "Acesso negado! Faça login primeiro." });
    }
}

function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, SECR3T_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(hash) {
    const [ivHex, authTagHex, encryptedText] = hash.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECR3T_KEY, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

app.post('/cadastro', (req, res) => {
    console.log("Corpo recebido:", req.body);
    const { email, passwordc } = req.body;
    const db = readDB();

    if (!email || !passwordc) {
        return res.status(400).json({ erro: "Campos faltando!" });
    }

    const newUser = {
        id: "USER-" + Date.now(),
        email,
        masterHash: encrypt(passwordc)
    };

    db.push(newUser);
    saveDB(db);
    res.status(201).json({ mensagem: "Usuário criado!" });
});

app.get('/passwords/:userId', middleware, (req, res) => {
    const { userId } = req.params;
    const db = readDB();

    const userPasswords = db.filter(item => item.userId === userId);

    const publicList = userPasswords.map(item => ({
        id: item.id,
        servico: item.servico,
        encryptedHash: item.hash
    }));
    res.json(publicList);
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    let db = readDB();

    const itemVerify = db.find(item => item.id === id);

    if (!itemVerify) {
        return res.status(404).json({ erro: "Password not found " });
    }

    db = db.filter(item => item.id !== id);

    saveDB(db);

    res.json({ mensagem: "Password Deleted with success!" });
});

app.post('/save', (req, res) => {
    const { servico, pass, userId } = req.body;
    const db = readDB();

    if (!servico || !pass || !userId) {
        return res.status(400).json({ erro: "error" });
    }

    const newItem = {
        id: Date.now().toString(),
        userId,
        servico,
        hash: encrypt(pass)
    };

    db.push(newItem);
    saveDB(db);
    res.status(201).json({ mensagem: "Saved! " });
});


app.post('/decrypt', (req, res) => {
    const { hash } = req.body;
    try {
        const realPass = decrypt(hash);
        res.json({ realPass });
    } catch (e) {
        res.status(400).json({ erro: "Invalid Key!" });
    }
});

app.post('/login', (req, res) => {
    const { email, passwordc } = req.body;
    const db = readDB();

    const user = db.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({ erro: "Usuário ou senha inválidos" });
    }

    try {
        const savedPassword = decrypt(user.masterHash);

        if (passwordc === savedPassword) {

            res.json({ 
                mensagem: "Login realizado!", 
                userId: user.id 
            });
        } else {
            res.status(401).json({ erro: "Usuário ou senha inválidos" });
        }
    } catch (err) {
        res.status(500).json({ erro: "Erro ao processar login" });
    }
});

app.get('/login', (req, res) => {
    
    res.sendFile(path.join(__dirname, '..', 'public', '/login.html'));
    
})

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', '/registro.html'))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', '/index.html'));
})


const PORT = 3000;

app.listen(PORT, () => console.log('Service working in http://localhost:3000'));