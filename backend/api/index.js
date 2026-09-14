// Vercel serverless entry point.
// Any request under /api/* (or, per vercel.json rewrites, any path)
// gets routed here and handled by the Express app.
module.exports = require('../server');
