#!/usr/bin/env python3

import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "html"
HONEYPOT_PAGE = "honeypot.html"
ERROR_PAGE = "error.html"

class HoneypotHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=DIRECTORY, **kwargs):
        self.error_page_path = os.path.join(os.getcwd(), directory, ERROR_PAGE)
        super().__init__(*args, directory=directory, **kwargs)
    
    def translate_path(self, path):
        # Normalize the path to prevent directory traversal
        normalized_path = os.path.normpath(path)
        normalized_path = normalized_path.lstrip('/\\')

        # Construct the absolute path
        absolute_path = os.path.join(os.getcwd(), self.directory, normalized_path)
        absolute_path = os.path.abspath(absolute_path)

        # Get the real path of the base directory
        base_directory = os.path.abspath(os.path.join(os.getcwd(), self.directory))

        # Check if the requested path is within the base directory
        if not absolute_path.startswith(base_directory):
            # Honeypot triggered
            self.log_honeypot_attempt(path)
            return os.path.join(base_directory, HONEYPOT_PAGE)
        else:
            return absolute_path

    def log_honeypot_attempt(self, path):
        client_ip = self.client_address[0]
        log_message = f"HONEYPOT TRIGGERED: {client_ip} tried to access '{path}'"
        print(log_message)
        # Optionally, write to a log file
        with open("honeypot.log", "a") as log_file:
            log_file.write(log_message + "\n")

    def send_error(self, code, message=None, explain=None):
        """Serve a custom error page for all HTTP errors."""
        self.log_error("code %d, message %s", code, message)
        self.send_response(code)
        self.send_header("Content-Type", self.error_content_type)
        self.end_headers()

        # Prepare the error message
        error_message = message if message else self.responses.get(code, ('',))[0]

        # Read the error page template
        try:
            with open(self.error_page_path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Replace placeholders with actual values
            content = content.replace('{code}', str(code))
            content = content.replace('{message}', error_message)
            self.wfile.write(content.encode('utf-8'))
        except FileNotFoundError:
            # Fallback to a simple error message
            fallback_content = f"<h1>Error {code}</h1><p>{error_message}</p>"
            self.wfile.write(fallback_content.encode('utf-8'))

    def log_message(self, format, *args):
        pass

# Ensure the honeypot page exists
honeypot_page_path = os.path.join(DIRECTORY, HONEYPOT_PAGE)
if not os.path.exists(honeypot_page_path):
    with open(honeypot_page_path, "w", encoding='utf-8') as f:
        f.write("<h1>Access Denied</h1><p>Your access has been logged.</p>")

# Ensure the error page exists with placeholders
error_page_path = os.path.join(DIRECTORY, ERROR_PAGE)
if not os.path.exists(error_page_path):
    with open(error_page_path, "w", encoding='utf-8') as f:
        f.write("<h1>Error {code}</h1><p>{message}</p>")

Handler = HoneypotHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving '{DIRECTORY}/' directory at http://localhost:{PORT}")
    httpd.serve_forever()
