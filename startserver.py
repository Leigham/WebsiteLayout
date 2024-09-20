#!/usr/bin/env python3

import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "html"
HONEYPOT_PAGE = "honeypot.html"

class HoneypotHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=DIRECTORY, **kwargs):
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



# Ensure the honeypot page exists
honeypot_page_path = os.path.join(DIRECTORY, HONEYPOT_PAGE)
if not os.path.exists(honeypot_page_path):
    with open(honeypot_page_path, "w") as f:
        f.write("<h1>Access Denied</h1><p>Your access has been logged.</p>")

Handler = HoneypotHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving '{DIRECTORY}/' directory at http://localhost:{PORT}")
    httpd.serve_forever()
