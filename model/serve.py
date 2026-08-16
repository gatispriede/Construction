"""Static server for the model, with caching disabled.

python -m http.server sends Last-Modified, and browsers hold ES modules in an
in-memory cache that a normal reload does not clear. Editing frame.js and
reloading would silently keep running the old module. This sends no-store so
every reload picks up the current files.
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        # SimpleHTTPRequestHandler answers If-Modified-Since with a 304, and a
        # 304 tells the browser to keep its cached module. Drop the conditional
        # headers so every request gets a fresh 200.
        for h in ("If-Modified-Since", "If-None-Match"):
            if h in self.headers:
                del self.headers[h]
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8099
    root = Path(__file__).parent
    handler = partial(NoCacheHandler, directory=str(root))
    print(f"model on http://localhost:{port}  (no-cache)")
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
