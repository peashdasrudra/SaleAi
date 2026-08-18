const fs = require('fs');
let content = fs.readFileSync('prisma/seed.ts', 'utf8');
content = content.replace(/estatus: 'VALID'/g, "estatus: 'VALIDATED'");
content = content.replace(/estatus: 'INVALID'/g, "estatus: 'INVALID'");
fs.writeFileSync('prisma/seed.ts', content);
