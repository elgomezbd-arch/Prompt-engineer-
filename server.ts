import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: process.env.NODE_ENV,
      render: process.env.RENDER === "true"
    });
  });

  // Use a more robust check for production
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

  if (isProduction) {
    const distPath = path.join(process.cwd(), "dist");
    
    if (!fs.existsSync(distPath)) {
      console.error(`[ERROR] Dist directory NOT found at: ${distPath}`);
      // Fallback to checking sibling dist
      const altDist = path.resolve(__dirname, "dist");
      console.log(`[INFO] Checking alternative dist at: ${altDist}`);
      if (fs.existsSync(altDist)) {
        console.log(`[INFO] Found dist at alternative path.`);
      }
    }

    // Serve static files
    app.use(express.static(distPath));

    // SPA Fallback
    app.get("*", (req, res) => {
      // If it looks like a file (has an extension) but wasn't caught by express.static, 404 it
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        console.log(`[404] Asset not found: ${req.url}`);
        return res.status(404).send('Asset not found');
      }
      
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`[ERROR] index.html not found at: ${indexPath}`);
        res.status(404).send("Application shell not found");
      }
    });
    
    console.log(`[PROD] Server configured to serve from: ${distPath}`);
  } else {
    // Dynamic import for Vite to avoid overhead in production
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { 
          middlewareMode: true, 
          hmr: process.env.DISABLE_HMR !== "true",
          host: "0.0.0.0",
          port: 3000
        },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("[DEV] Vite middleware active");
    } catch (err) {
      console.error("[DEV] Failed to start Vite server:", err);
      process.exit(1);
    }
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`[SERVER] Running at http://0.0.0.0:${PORT} (Mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error("[FATAL] Server startup error:", err);
  process.exit(1);
});
