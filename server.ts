import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // Use a more robust check for production
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

  if (isProduction) {
    const distPath = path.resolve(__dirname, "dist");
    
    // Serve static files from the dist directory
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: true
    }));

    // SPA Fallback: Send index.html for all other routes
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      res.sendFile(indexPath);
    });
    
    console.log(`[PROD] Serving static files from: ${distPath}`);
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
