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

  // Detect production mode by checking for dist folder
  const distPath = path.resolve(process.cwd(), "dist");
  const distExists = fs.existsSync(distPath);
  // We use production mode if the dist folder exists, unless we are explicitly told to be in development
  const isProduction = distExists && process.env.NODE_ENV !== "development";

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: process.env.NODE_ENV,
      distExists,
      isProduction,
      distPath,
      cwd: process.cwd(),
      env: Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('SECRET'))
    });
  });

  // Serve static files with proper MIME types
  const staticMimeTypes: Record<string, string> = {
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".ts": "application/javascript; charset=utf-8",
    ".tsx": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };

  const setCustomHeaders = (res: any, filePath: string) => {
    const ext = path.extname(filePath).toLowerCase();
    if (staticMimeTypes[ext]) {
      res.setHeader("Content-Type", staticMimeTypes[ext]);
    }
  };

  if (isProduction) {
    console.log(`[PROD] Serving from: ${distPath}`);
    
    app.use(express.static(distPath, {
      index: false,
      setHeaders: setCustomHeaders
    }));

    // SPA Fallback
    app.get("*", (req, res) => {
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).send('Asset not found');
      }
      
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application not built. Run npm run build.");
      }
    });
  } else {
    // Development mode with Vite
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
      
      // Explicitly serve src and root files if Vite falls through (though it shouldn't)
      app.use(express.static(process.cwd(), {
        index: false,
        setHeaders: setCustomHeaders
      }));
      
      app.get("*", async (req, res, next) => {
        if (req.path.includes('.') && !req.path.endsWith('.html')) {
          return next();
        }
        try {
          const url = req.originalUrl;
          const indexFile = path.resolve(process.cwd(), "index.html");
          if (!fs.existsSync(indexFile)) {
             return res.status(404).send("index.html not found");
          }
          let template = fs.readFileSync(indexFile, "utf-8");
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).send(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
      console.log("[DEV] Vite middleware and root static fallback active");
    } catch (err) {
      console.error("[DEV] Failed to start Vite:", err);
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
