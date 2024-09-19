#!/usr/bin/env python3

import http.server
import socketserver

PORT = 8000
DIRECTORY = "html"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving '{DIRECTORY}/' directory at http://localhost:{PORT}")
    httpd.serve_forever()
