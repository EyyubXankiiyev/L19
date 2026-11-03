"""Local content API and built frontend server; Python 3.10+, no dependencies."""
import argparse
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent.parent


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / "dist"), **kwargs)

    def do_GET(self):
        route = urlsplit(self.path).path
        if route == "/api/health":
            return self.send_json({"status": "ok"})
        if route == "/api/content":
            try:
                data = json.loads((ROOT / "backend/content.json").read_text(encoding="utf-8"))
            except (OSError, ValueError):
                return self.send_json({"error": "Content unavailable"}, 500)
            return self.send_json(data)
        if route.startswith("/api/"):
            return self.send_json({"error": "Not found"}, 404)
        return super().do_GET()

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8001)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Python server: http://127.0.0.1:{args.port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
