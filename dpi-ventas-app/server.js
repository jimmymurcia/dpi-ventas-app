const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Crear directorio para la base de datos si no existe
const dbDir = path.dirname('./scripts.db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Configurar base de datos SQLite
const db = new sqlite3.Database('./scripts.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
    } else {
        console.log('✅ Conectado a la base de datos SQLite');
        initializeDatabase();
    }
});

// Inicializar base de datos
function initializeDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS scripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error al crear tabla:', err);
        } else {
            console.log('✅ Tabla de scripts inicializada');
            insertInitialScripts();
        }
    });
}

// Scripts iniciales
function insertInitialScripts() {
    const initialScripts = [
        // BIENVENIDA
        {
            category: 'bienvenida',
            title: '🎬 Apertura DPI',
            text: `¡Hola! Soy [NOMBRE] de DPI Publicidad 🎯

Nos especializamos en:
• Rótulos comerciales ✨
• Material POP 📢
• Stands para eventos 🏪
• Banners publicitarios 🎪
• Viniles decorativos 🎨

¿En qué proyecto publicitario te podemos ayudar hoy?`
        },
        {
            category: 'bienvenida',
            title: '🤝 Introducción Personalizada',
            text: `¡Perfecto [NOMBRE]! 👋

En DPI hemos trabajado con empresas como la tuya y entendemos que cada proyecto es único.

Cuéntame:
• ¿Qué tipo de empresa manejas?
• ¿Tienes algún evento o apertura próxima?
• ¿Ya has trabajado publicidad exterior antes?

Con esa info te puedo orientar mucho mejor 🎯`
        },

        // CALIFICACIÓN
        {
            category: 'calificacion',
            title: '💰 Presupuesto y Timeline',
            text: `Perfecto, para darte la mejor propuesta necesito entender:

PRESUPUESTO 💰:
• ¿Tienes un rango de inversión definido?
• ¿Es para este año o próximo?

TIMELINE ⏰:
• ¿Para cuándo necesitas tenerlo listo?
• ¿Hay algún evento específico?

DECISIÓN 🎯:
• ¿Eres tú quien autoriza la inversión?
• ¿Necesitas consultar con alguien más?

Con eso te armo una propuesta que realmente te sirva 👌`
        },
        {
            category: 'calificacion',
            title: '🎯 Calificación de Urgencia',
            text: `Entiendo tu proyecto [NOMBRE] 📋

Ayúdame a priorizarte correctamente:

¿CUÁL DE ESTAS TE DESCRIBE MEJOR?

🟢 "LO NECESITO YA" - Tengo fecha definida y presupuesto aprobado

🟡 "ESTOY COTIZANDO" - Comparando opciones y precios

🔴 "SOLO PREGUNTO" - Apenas estoy viendo ideas

Según tu respuesta te doy el seguimiento que necesitas 🚀`
        },

        // OBJECIONES
        {
            category: 'objeciones',
            title: '💸 "Está muy caro"',
            text: `Entiendo tu punto [NOMBRE] 💰

La inversión siempre es importante. Déjame mostrarte el valor:

✅ MATERIALES PREMIUM - Durabilidad garantizada
✅ DISEÑO INCLUIDO - Sin costos ocultos  
✅ INSTALACIÓN PROFESIONAL - Equipo especializado
✅ GARANTÍA REAL - Respaldamos nuestro trabajo

¿Qué tal si vemos opciones que se adapten mejor a tu presupuesto?

También podemos hacer un plan de pagos 📅

¿En qué rango te sentirías más cómodo?`
        },
        {
            category: 'objeciones',
            title: '⏰ "Necesito pensarlo"',
            text: `¡Por supuesto [NOMBRE]! 🤔

Es una decisión importante. Ayúdame a entender:

¿QUÉ ESPECÍFICAMENTE NECESITAS EVALUAR?

• ¿El presupuesto? 💰
• ¿Los diseños? 🎨  
• ¿Los tiempos de entrega? ⏰
• ¿Consultar con tu socio/jefe? 👥

Según lo que necesites puedo:
✅ Ajustar la propuesta
✅ Mostrarte más opciones
✅ Darte referencias de clientes
✅ Programar una segunda reunión

¿Qué te ayudaría más a decidir? 🎯`
        },

        // SEGUIMIENTO
        {
            category: 'seguimiento',
            title: '📞 Seguimiento Cálido',
            text: `¡Hola [NOMBRE]! 👋

Espero estés bien. Te escribo para darle seguimiento a tu proyecto de [PROYECTO].

Han pasado [X DÍAS] desde nuestra última conversación y quería saber:

• ¿Ya tuviste chance de revisar la propuesta? 📋
• ¿Tienes alguna duda específica? ❓
• ¿Necesitas que ajustemos algo? ⚙️

Recuerda que la cotización es válida por 15 días y tenemos disponibilidad inmediata.

¿Te parece si conversamos 10 minutos hoy? 📞`
        },
        {
            category: 'seguimiento',
            title: '⚡ Seguimiento de Urgencia',
            text: `[NOMBRE], ¡importante! ⚠️

Tu proyecto [PROYECTO] está en mi agenda pendiente.

RECORDATORIO:
• Cotización vence: [FECHA] 📅
• Tiempo de producción: [X DÍAS] ⏰
• Tu evento/apertura: [FECHA EVENTO] 🎯

Si necesitas avanzar, confirma HOY para:
✅ Asegurar tu lugar en producción
✅ Mantener los precios cotizados
✅ Cumplir con tu timeline

¿Podemos definir en los próximos 30 minutos? 🚀`
        },

        // CIERRE
        {
            category: 'cierre',
            title: '🎯 Cierre Directo',
            text: `Perfecto [NOMBRE] 🎯

Basado en todo lo que me comentaste, DPI es la opción ideal para tu [PROYECTO].

RESUMEN:
✅ Presupuesto: $[MONTO] (se adapta a tu rango)
✅ Entrega: [FECHA] (cumple tu timeline)  
✅ Incluye: Diseño + Material + Instalación
✅ Garantía: [X TIEMPO]

PARA ARRANCAR HOY necesito:
• 50% de anticipo: $[MONTO] 💰
• Confirmación por WhatsApp ✅

¿Arrancamos con tu proyecto ahora mismo? 🚀`
        },
        {
            category: 'cierre',
            title: '💳 Opciones de Pago',
            text: `¡Excelente decisión [NOMBRE]! 🎉

FORMAS DE PAGO DISPONIBLES:

💳 TARJETA - Mastercard/Visa (hasta 12 cuotas)
🏧 TRANSFERENCIA - Descuento 5% por pago contado
💵 EFECTIVO - En oficina o contra entrega
📱 SINPE MÓVIL - Inmediato y seguro

ESQUEMA RECOMENDADO:
• 50% para iniciar producción 🚀
• 50% contra entrega ✅

¿Con cuál te sientes más cómodo?

Una vez confirmado iniciamos diseño en las próximas 24 horas 🎨`
        }
    ];

    // Verificar si ya existen scripts
    db.get("SELECT COUNT(*) as count FROM scripts", (err, row) => {
        if (err) {
            console.error('Error al verificar scripts:', err);
            return;
        }

        if (row.count === 0) {
            console.log('🔄 Insertando scripts iniciales...');
            
            const stmt = db.prepare("INSERT INTO scripts (category, title, text) VALUES (?, ?, ?)");
            
            initialScripts.forEach(script => {
                stmt.run([script.category, script.title, script.text], (err) => {
                    if (err) {
                        console.error('Error al insertar script:', err);
                    }
                });
            });
            
            stmt.finalize(() => {
                console.log('✅ Scripts iniciales insertados correctamente');
            });
        } else {
            console.log('✅ Scripts ya existen en la base de datos');
        }
    });
}

// Middleware de autenticación para rutas administrativas
function requireAuth(req, res, next) {
    if (req.method === 'GET') {
        // Las consultas GET (leer scripts) están permitidas para todos
        return next();
    }
    
    // Para POST, PUT, DELETE requiere autenticación
    const authHeader = req.headers.authorization;
    const validPassword = 'DPI2025Admin'; // Cambia esta contraseña
    
    if (!authHeader || authHeader !== `Bearer ${validPassword}`) {
        return res.status(401).json({ 
            error: '🔒 Acceso denegado. Se requiere autenticación de administrador.' 
        });
    }
    
    next();
}

// Aplicar middleware a rutas de modificación
app.use('/api/scripts/:id', requireAuth);
app.use('/api/scripts', (req, res, next) => {
    if (req.method !== 'GET') {
        return requireAuth(req, res, next);
    }
    next();
});

// Obtener todos los scripts organizados por categoría
app.get('/api/scripts', (req, res) => {
    const query = `
        SELECT id, category, title, text, created_at, updated_at 
        FROM scripts 
        ORDER BY category, created_at DESC
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error al obtener scripts:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        
        // Organizar por categorías
        const scriptsByCategory = {
            bienvenida: [],
            calificacion: [],
            objeciones: [],
            seguimiento: [],
            cierre: []
        };
        
        rows.forEach(row => {
            if (scriptsByCategory[row.category]) {
                scriptsByCategory[row.category].push(row);
            }
        });
        
        res.json(scriptsByCategory);
    });
});

// Crear nuevo script
app.post('/api/scripts', requireAuth, (req, res) => {
    const { category, title, text } = req.body;
    
    if (!category || !title || !text) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const query = `
        INSERT INTO scripts (category, title, text) 
        VALUES (?, ?, ?)
    `;
    
    db.run(query, [category, title, text], function(err) {
        if (err) {
            console.error('Error al crear script:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        
        res.status(201).json({ 
            id: this.lastID, 
            message: 'Script creado correctamente' 
        });
    });
});

// Actualizar script
app.put('/api/scripts/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    const { category, title, text } = req.body;
    
    if (!category || !title || !text) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    const query = `
        UPDATE scripts 
        SET category = ?, title = ?, text = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `;
    
    db.run(query, [category, title, text, id], function(err) {
        if (err) {
            console.error('Error al actualizar script:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Script no encontrado' });
        }
        
        res.json({ message: 'Script actualizado correctamente' });
    });
});

// Eliminar script
app.delete('/api/scripts/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    
    const query = 'DELETE FROM scripts WHERE id = ?';
    
    db.run(query, [id], function(err) {
        if (err) {
            console.error('Error al eliminar script:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Script no encontrado' });
        }
        
        res.json({ message: 'Script eliminado correctamente' });
    });
});

// Obtener estadísticas
app.get('/api/stats', (req, res) => {
    const query = `
        SELECT category, COUNT(*) as count 
        FROM scripts 
        GROUP BY category
    `;
    
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        
        res.json(rows);
    });
});

// Endpoint para backup manual (protegido)
app.get('/api/backup', requireAuth, (req, res) => {
    try {
        if (!fs.existsSync('./scripts.db')) {
            return res.status(404).json({ error: 'Base de datos no encontrada' });
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `dpi-scripts-backup-${timestamp}.db`;
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        const fileStream = fs.createReadStream('./scripts.db');
        fileStream.pipe(res);
        
        console.log(`📥 Backup descargado: ${filename}`);
    } catch (error) {
        console.error('Error al crear backup:', error);
        res.status(500).json({ error: 'Error al crear backup' });
    }
});

// Endpoint para listar backups disponibles
app.get('/api/backups', requireAuth, (req, res) => {
    try {
        const backupFiles = fs.readdirSync('./')
            .filter(file => file.startsWith('backup_') && file.endsWith('.db'))
            .map(file => {
                const stats = fs.statSync(file);
                return {
                    filename: file,
                    size: Math.round(stats.size / 1024), // KB
                    created: stats.mtime.toISOString(),
                    age: Math.round((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60)) // horas
                };
            })
            .sort((a, b) => new Date(b.created) - new Date(a.created));

        res.json({
            backups: backupFiles,
            total: backupFiles.length,
            lastBackup: backupFiles[0]?.created || null
        });
        
    } catch (error) {
        console.error('Error al listar backups:', error);
        res.status(500).json({ error: 'Error al obtener lista de backups' });
    }
});

// Endpoint para descargar backup específico
app.get('/api/backup/:filename', requireAuth, (req, res) => {
    try {
        const filename = req.params.filename;
        
        // Validar que es un archivo de backup válido
        if (!filename.startsWith('backup_') || !filename.endsWith('.db')) {
            return res.status(400).json({ error: 'Nombre de archivo inválido' });
        }
        
        if (!fs.existsSync(filename)) {
            return res.status(404).json({ error: 'Backup no encontrado' });
        }
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        const fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);
        
        console.log(`📥 Backup específico descargado: ${filename}`);
    } catch (error) {
        console.error('Error al descargar backup específico:', error);
        res.status(500).json({ error: 'Error al descargar backup' });
    }
});

// Middleware para manejar archivos subidos
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Endpoint para restaurar backup (protegido)
app.post('/api/restore', requireAuth, upload.single('backup'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó archivo de backup' });
        }

        const backupPath = req.file.path;
        const currentDbPath = './scripts.db';
        
        // Crear backup de seguridad de la BD actual (si existe)
        if (fs.existsSync(currentDbPath)) {
            const emergencyBackup = `./emergency_backup_${Date.now()}.db`;
            fs.copyFileSync(currentDbPath, emergencyBackup);
            console.log(`🚨 Backup de emergencia creado: ${emergencyBackup}`);
        }
        
        // Restaurar desde el backup subido
        fs.copyFileSync(backupPath, currentDbPath);
        
        // Limpiar archivo temporal
        fs.unlinkSync(backupPath);
        
        console.log('✅ Base de datos restaurada exitosamente');
        
        // Verificar integridad de la BD restaurada
        const testDb = new sqlite3.Database(currentDbPath, (err) => {
            if (err) {
                console.error('❌ Error en BD restaurada:', err);
                return res.status(500).json({ error: 'Backup corrupto o inválido' });
            }
            
            testDb.get("SELECT COUNT(*) as count FROM scripts", (err, row) => {
                if (err) {
                    console.error('❌ Error al verificar scripts:', err);
                    return res.status(500).json({ error: 'Error al verificar BD restaurada' });
                }
                
                testDb.close();
                res.json({ 
                    message: '✅ Base de datos restaurada correctamente',
                    scriptsCount: row.count,
                    timestamp: new Date().toISOString()
                });
            });
        });
        
    } catch (error) {
        console.error('Error en restauración:', error);
        res.status(500).json({ error: 'Error durante la restauración' });
    }
});

// Endpoint para restaurar desde backup del servidor
app.post('/api/restore-server-backup', requireAuth, (req, res) => {
    try {
        const { filename } = req.body;
        
        if (!filename || !filename.startsWith('backup_') || !filename.endsWith('.db')) {
            return res.status(400).json({ error: 'Nombre de backup inválido' });
        }
        
        if (!fs.existsSync(filename)) {
            return res.status(404).json({ error: 'Backup no encontrado en servidor' });
        }
        
        const currentDbPath = './scripts.db';
        
        // Backup de emergencia
        if (fs.existsSync(currentDbPath)) {
            const emergencyBackup = `./emergency_backup_${Date.now()}.db`;
            fs.copyFileSync(currentDbPath, emergencyBackup);
            console.log(`🚨 Backup de emergencia creado: ${emergencyBackup}`);
        }
        
        // Restaurar
        fs.copyFileSync(filename, currentDbPath);
        
        console.log(`✅ Restaurado desde: ${filename}`);
        
        res.json({ 
            message: `✅ Base de datos restaurada desde ${filename}`,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error en restauración:', error);
        res.status(500).json({ error: 'Error durante la restauración' });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor DPI ejecutándose en puerto ${PORT}`);
    console.log(`📱 App disponible en: http://localhost:${PORT}`);
    console.log(`🔗 API disponible en: http://localhost:${PORT}/api/scripts`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n🔄 Cerrando servidor...');
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar base de datos:', err);
        } else {
            console.log('✅ Base de datos cerrada correctamente');
        }
        process.exit(0);
    });
});
