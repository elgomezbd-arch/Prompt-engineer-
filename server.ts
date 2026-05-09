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

  // Detect mode - primary indicator is existence of build artifacts
  const distPath = path.resolve(process.cwd(), "dist");
  const isProduction = fs.existsSync(distPath);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      mode: process.env.NODE_ENV,
      isProduction,
      cwd: process.cwd()
    });
  });

  if (isProduction) {
    const distPath = path.resolve(process.cwd(), "dist");
    console.log(`[PROD] Serving from: ${distPath}`);

    app.use(express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.js' || ext === '.mjs') {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (ext === '.css') {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
      }
    }));

    app.get("*", (req, res) => {
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).end('Asset not found');
      }
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Application not built. Run npm run build.");
      }
    });
  } else {
    // Development mode
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        root: process.cwd(),
        server: { 
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR !== "true",
          host: "0.0.0.0",
          port: 3000
        },
        appType: "spa",
      });

      app.use(vite.middlewares);

      app.get("*", async (req, res, next) => {
        // If it looks like a script/asset but reached here, Vite didn't handle it
        if (req.path.includes('.') && !req.path.endsWith('.html')) {
          console.warn(`[DEV-MISS] Asset request fell through Vite: ${req.url}`);
          return next();
        }
        
        try {
          const url = req.originalUrl;
          const indexFile = path.resolve(process.cwd(), "index.html");
          let template = fs.readFileSync(indexFile, "utf-8");
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
        }
      });
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
