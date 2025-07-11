const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 8080;

// --- MIDDLEWARE ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- DATABASE SETUP ---
const dbPath = './scripts.db';
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Tabla de scripts existente
        db.run(`CREATE TABLE IF NOT EXISTS scripts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Error al crear tabla scripts:', err.message);
        });

        // Tabla de uso de scripts existente
        db.run(`CREATE TABLE IF NOT EXISTS script_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            script_id INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (script_id) REFERENCES scripts (id) ON DELETE CASCADE
        )`, (err) => {
            if (err) console.error('Error al crear tabla script_usage:', err.message);
        });

        // ✅ NUEVA TABLA: Clientes potenciales
        db.run(`CREATE TABLE IF NOT EXISTS clientes_potenciales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            tipo TEXT NOT NULL,
            contacto TEXT,
            telefono TEXT,
            caracteristicas TEXT NOT NULL,
            necesidad TEXT NOT NULL,
            presupuesto TEXT,
            urgencia TEXT,
            proximos_pasos TEXT,
            vendedor TEXT,
            fecha_contacto DATE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) console.error('Error al crear tabla clientes_potenciales:', err.message);
            else console.log('✅ Tabla clientes_potenciales creada/verificada');
        });
        
        insertInitialScripts();
        insertInitialClientes();
    });
}

function insertInitialScripts() {
    const initialScripts = [
        { category: 'bienvenida', title: '🎬 Apertura DPI', text: '¡Hola! Soy [NOMBRE] de DPI Publicidad 🎯\n\nNos especializamos en:\n• Rótulos comerciales ✨\n• Material POP 📢\n• Stands para eventos 🏪\n• Banners publicitarios 🎪\n• Viniles decorativos 🎨\n\n¿En qué proyecto publicitario te podemos ayudar hoy?' },
        { category: 'calificacion', title: '💰 Presupuesto y Timeline', text: 'Perfecto, para darte la mejor propuesta necesito entender:\n\nPRESUPUESTO 💰:\n• ¿Tienes un rango de inversión definido?\n• ¿Es para este año o próximo?\n\nTIMELINE ⏰:\n• ¿Para cuándo necesitas tenerlo listo?\n• ¿Hay algún evento específico?\n\nDECISIÓN 🎯:\n• ¿Eres tú quien autoriza la inversión?\n• ¿Necesitas consultar con alguien más?\n\nCon eso te armo una propuesta que realmente te sirva 👌' },
        { category: 'objeciones', title: '💸 "Está muy caro"', text: 'Entiendo tu punto [NOMBRE] 💰\n\nLa inversión siempre es importante. Déjame mostrarte el valor:\n\n✅ MATERIALES PREMIUM - Durabilidad garantizada\n✅ DISEÑO INCLUIDO - Sin costos ocultos\n✅ INSTALACIÓN PROFESIONAL - Equipo especializado\n✅ GARANTÍA REAL - Respaldamos nuestro trabajo\n\n¿Qué tal si vemos opciones que se adapten mejor a tu presupuesto?' },
        { category: 'seguimiento', title: '📞 Seguimiento Cálido', text: '¡Hola [NOMBRE]! 👋\n\nEspero estés bien. Te escribo para darle seguimiento a tu proyecto de [PROYECTO].\n\n¿Ya tuviste chance de revisar la propuesta? 📋\n¿Tienes alguna duda específica? ❓\n\nRecuerda que la cotización es válida por 15 días.\n\n¿Te parece si conversamos 10 minutos hoy? 📞' },
        { category: 'cierre', title: '🎯 Cierre Directo', text: 'Perfecto [NOMBRE] 🎯\n\nBasado en todo lo que me comentaste, DPI es la opción ideal para tu [PROYECTO].\n\nRESUMEN:\n✅ Presupuesto: $[MONTO]\n✅ Entrega: [FECHA]\n✅ Incluye: Diseño + Material + Instalación\n\nPARA ARRANCAR HOY necesito:\n• 50% de anticipo: $[MONTO] 💰\n• Confirmación por WhatsApp ✅\n\n¿Arrancamos con tu proyecto ahora mismo? 🚀' }
    ];

    db.get("SELECT COUNT(*) as count FROM scripts", (err, row) => {
        if (err) return console.error('Error al verificar scripts:', err.message);
        if (row.count === 0) {
            console.log('🔄 Insertando scripts iniciales...');
            const stmt = db.prepare("INSERT INTO scripts (category, title, text) VALUES (?, ?, ?)");
            initialScripts.forEach(script => stmt.run(script.category, script.title, script.text));
            stmt.finalize(() => console.log('✅ Scripts iniciales insertados.'));
        }
    });
}

// ✅ NUEVA FUNCIÓN: Insertar clientes potenciales de ejemplo
function insertInitialClientes() {
    const initialClientes = [
        {
            nombre: "Restaurante El Buen Sabor",
            tipo: "restaurante",
            contacto: "María González",
            telefono: "+504 9876-5432",
            caracteristicas: "Negocio nuevo con 3 meses de operación, tiene presupuesto pero limitado, está comparando varias opciones",
            necesidad: "Necesita rótulo para fachada, mencionó que quiere algo 'no muy caro pero que se vea bien'",
            presupuesto: "medio",
            urgencia: "media",
            proximos_pasos: "Llamar en 2 semanas, enviar portfolio de trabajos similares",
            vendedor: "Carlos Mendoza",
            fecha_contacto: "2024-07-01"
        },
        {
            nombre: "Clínica Dental Sonrisas",
            tipo: "clinica",
            contacto: "Dr. Roberto Silva",
            telefono: "+504 2222-3333",
            caracteristicas: "Clínica establecida pero primera vez invirtiendo en publicidad exterior",
            necesidad: "Banner para promoción de servicios, material POP para interior",
            presupuesto: "alto",
            urgencia: "baja",
            proximos_pasos: "Reunión programada para mostrar propuesta completa",
            vendedor: "Ana López",
            fecha_contacto: "2024-07-05"
        }
    ];

    db.get("SELECT COUNT(*) as count FROM clientes_potenciales", (err, row) => {
        if (err) return console.error('Error al verificar clientes potenciales:', err.message);
        if (row.count === 0) {
            console.log('🔄 Insertando clientes potenciales de ejemplo...');
            const stmt = db.prepare(`INSERT INTO clientes_potenciales 
                (nombre, tipo, contacto, telefono, caracteristicas, necesidad, presupuesto, urgencia, proximos_pasos, vendedor, fecha_contacto) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            
            initialClientes.forEach(cliente => {
                stmt.run(
                    cliente.nombre, cliente.tipo, cliente.contacto, cliente.telefono,
                    cliente.caracteristicas, cliente.necesidad, cliente.presupuesto,
                    cliente.urgencia, cliente.proximos_pasos, cliente.vendedor, cliente.fecha_contacto
                );
            });
            stmt.finalize(() => console.log('✅ Clientes potenciales de ejemplo insertados.'));
        }
    });
}

// --- AUTH MIDDLEWARE ---
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer DPI2025Admin') {
        next();
    } else {
        res.status(401).json({ error: '🔒 Acceso denegado.' });
    }
}

// --- API ENDPOINTS SCRIPTS (EXISTENTES) ---
app.get('/api/scripts', (req, res) => {
    const query = `
        SELECT s.*,
               COUNT(u.id) as total_uses,
               SUM(CASE WHEN u.timestamp >= date('now', '-30 days') THEN 1 ELSE 0 END) as usage_30_days,
               SUM(CASE WHEN u.timestamp >= date('now', '-7 days') THEN 1 ELSE 0 END) as usage_7_days
        FROM scripts s
        LEFT JOIN script_usage u ON s.id = u.script_id
        GROUP BY s.id
        ORDER BY s.category, usage_30_days DESC`;
    
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const getBadge = (script) => {
            const isNew = (Date.now() - new Date(script.created_at).getTime()) < (7 * 24 * 60 * 60 * 1000);
            if (isNew) return { icon: '🆕', text: 'Nuevo', color: '#28a745' };
            if (script.usage_30_days >= 20) return { icon: '🔥', text: 'Trending', color: '#dc3545' };
            if (script.usage_30_days >= 10) return { icon: '⚡', text: 'Popular', color: '#ffc107' };
            return null;
        };
        const scriptsByCategory = { bienvenida: [], calificacion: [], objeciones: [], seguimiento: [], cierre: [] };
        rows.forEach(row => {
            if (scriptsByCategory[row.category]) {
                row.badge = getBadge(row);
                scriptsByCategory[row.category].push(row);
            }
        });
        res.json(scriptsByCategory);
    });
});

app.post('/api/scripts/:id/track', (req, res) => {
    db.run('INSERT INTO script_usage (script_id) VALUES (?)', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ success: true });
    });
});

app.get('/api/scripts/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query de búsqueda es requerida' });
    const searchQuery = `%${q}%`;
    const query = `SELECT id, category, title, text FROM scripts WHERE title LIKE ? OR text LIKE ? LIMIT 15`;
    db.all(query, [searchQuery, searchQuery], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const regex = new RegExp(`(${q})`, 'gi');
        rows.forEach(row => {
            row.highlightedTitle = row.title.replace(regex, '<mark>$1</mark>');
            row.highlightedText = (row.text.substring(0, 120) + '...').replace(regex, '<mark>$1</mark>');
        });
        res.json(rows);
    });
});

app.get('/api/analytics', requireAuth, (req, res) => {
    const queries = {
        topScripts: `SELECT s.title, COUNT(u.id) as uses_30_days FROM script_usage u JOIN scripts s ON s.id = u.script_id WHERE u.timestamp >= date('now', '-30 days') GROUP BY s.id ORDER BY uses_30_days DESC LIMIT 5`,
        categoryStats: `SELECT s.category, COUNT(u.id) as usage_count FROM script_usage u JOIN scripts s ON s.id = u.script_id WHERE u.timestamp >= date('now', '-30 days') GROUP BY s.category ORDER BY usage_count DESC`
    };
    const results = {};
    let completed = 0;
    Object.keys(queries).forEach(key => {
        db.all(queries[key], (err, rows) => {
            results[key] = rows || [];
            if (++completed === Object.keys(queries).length) res.json(results);
        });
    });
});

app.post('/api/scripts', requireAuth, (req, res) => {
    const { category, title, text } = req.body;
    db.run('INSERT INTO scripts (category, title, text) VALUES (?, ?, ?)', [category, title, text], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
    });
});

app.put('/api/scripts/:id', requireAuth, (req, res) => {
    const { category, title, text } = req.body;
    db.run('UPDATE scripts SET category=?, title=?, text=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [category, title, text, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});

app.delete('/api/scripts/:id', requireAuth, (req, res) => {
    db.run('DELETE FROM scripts WHERE id=?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes });
    });
});

// ✅ NUEVOS ENDPOINTS: Clientes Potenciales
app.get('/api/clientes-potenciales', (req, res) => {
    const query = `SELECT * FROM clientes_potenciales ORDER BY created_at DESC`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener clientes potenciales:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/clientes-potenciales', requireAuth, (req, res) => {
    const { 
        nombre, tipo, contacto, telefono, caracteristicas, 
        necesidad, presupuesto, urgencia, proximosPasos, vendedor, fecha 
    } = req.body;

    // Validaciones básicas
    if (!nombre || !tipo || !caracteristicas || !necesidad) {
        return res.status(400).json({ 
            error: 'Los campos nombre, tipo, caracteristicas y necesidad son obligatorios' 
        });
    }

    const query = `INSERT INTO clientes_potenciales 
        (nombre, tipo, contacto, telefono, caracteristicas, necesidad, presupuesto, urgencia, proximos_pasos, vendedor, fecha_contacto) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [
        nombre, tipo, contacto || null, telefono || null, caracteristicas,
        necesidad, presupuesto || null, urgencia || null, proximosPasos || null, 
        vendedor || null, fecha || null
    ], function(err) {
        if (err) {
            console.error('Error al crear cliente potencial:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            id: this.lastID,
            message: 'Cliente potencial creado exitosamente' 
        });
    });
});

app.put('/api/clientes-potenciales/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { 
        nombre, tipo, contacto, telefono, caracteristicas, 
        necesidad, presupuesto, urgencia, proximosPasos, vendedor, fecha 
    } = req.body;

    // Validaciones básicas
    if (!nombre || !tipo || !caracteristicas || !necesidad) {
        return res.status(400).json({ 
            error: 'Los campos nombre, tipo, caracteristicas y necesidad son obligatorios' 
        });
    }

    const query = `UPDATE clientes_potenciales SET 
        nombre=?, tipo=?, contacto=?, telefono=?, caracteristicas=?, necesidad=?, 
        presupuesto=?, urgencia=?, proximos_pasos=?, vendedor=?, fecha_contacto=?, 
        updated_at=CURRENT_TIMESTAMP 
        WHERE id=?`;

    db.run(query, [
        nombre, tipo, contacto || null, telefono || null, caracteristicas,
        necesidad, presupuesto || null, urgencia || null, proximosPasos || null, 
        vendedor || null, fecha || null, id
    ], function(err) {
        if (err) {
            console.error('Error al actualizar cliente potencial:', err.message);
            return res.status(500).json({ error: err.message });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Cliente potencial no encontrado' });
        }
        
        res.json({ 
            changes: this.changes,
            message: 'Cliente potencial actualizado exitosamente' 
        });
    });
});

app.delete('/api/clientes-potenciales/:id', requireAuth, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM clientes_potenciales WHERE id=?', [id], function(err) {
        if (err) {
            console.error('Error al eliminar cliente potencial:', err.message);
            return res.status(500).json({ error: err.message });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Cliente potencial no encontrado' });
        }
        
        res.json({ 
            changes: this.changes,
            message: 'Cliente potencial eliminado exitosamente' 
        });
    });
});

// --- BACKUP Y RESTORE (EXISTENTES) ---
const upload = multer({ dest: 'uploads/' });

app.get('/api/backup', requireAuth, (req, res) => {
    res.download(dbPath, `backup-${Date.now()}.db`);
});

app.post('/api/restore', requireAuth, upload.single('backup'), (req, res) => {
    if (!req.file) return res.status(400).json({error: "No file uploaded."});
    db.close(err => {
        if(err) return res.status(500).json({error: "No se pudo cerrar la DB actual"});
        fs.copyFile(req.file.path, dbPath, (err) => {
            fs.unlinkSync(req.file.path);
            if (err) return res.status(500).json({error: "Error al restaurar"});
            res.json({ message: 'Restauración exitosa. El servidor debe reiniciarse.' });
            console.log('✅ Base de datos restaurada. Por favor, reinicia el servidor.');
            process.exit(0);
        });
    });
});

// --- RUTA CATCH-ALL PARA SPA ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor DPI ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 API Scripts: http://localhost:${PORT}/api/scripts`);
    console.log(`👥 API Clientes: http://localhost:${PORT}/api/clientes-potenciales`);
});

// --- GRACEFUL SHUTDOWN ---
process.on('SIGINT', () => {
    console.log('\n🔄 Cerrando servidor...');
    db.close((err) => {
        if (err) console.error('Error al cerrar base de datos:', err.message);
        else console.log('✅ Base de datos cerrada correctamente');
        process.exit(0);
    });
});
