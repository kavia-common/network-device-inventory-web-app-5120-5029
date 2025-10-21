import os
from flask import Flask, jsonify, request
from flask_cors import CORS

# PUBLIC_INTERFACE
def create_app():
    """
    Create and configure the Flask application.

    CORS:
        Allows cross-origin requests from the React frontend (default http://localhost:3000).
        - Supports credentials.
        - Handles preflight OPTIONS for all routes.
        - Exposes standard headers.

    Environment:
        PORT: server port (default 3001)
        CORS_ALLOW_ORIGINS: comma-separated origins; defaults to http://localhost:3000
        APP_VERSION: optional app version string to include in /health
    """
    app = Flask(__name__)

    origins_env = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:3000")
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]

    CORS(
        app,
        resources={r"/*": {"origins": origins}},
        supports_credentials=True,
        expose_headers=["Content-Type", "Authorization"],
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    @app.get("/health")
    def health():
        """
        PUBLIC_INTERFACE
        Health check endpoint.

        Returns:
            200 OK JSON including application status and version.
        CORS:
            This route inherits global CORS settings, allowing cross-origin
            requests from the configured frontend.
        """
        return jsonify(
            {
                "status": "ok",
                "service": "FlaskBackendAPI",
                "version": os.getenv("APP_VERSION", "dev"),
                "method": request.method,
            }
        ), 200

    # Example placeholder for future routes:
    # @app.route('/devices', methods=['GET', 'POST', 'OPTIONS'])
    # def devices():
    #     if request.method == 'OPTIONS':
    #         return ('', 204)
    #     ...

    return app


if __name__ == "__main__":
    app = create_app()
    port = int(os.getenv("PORT", "3001"))
    app.run(host="0.0.0.0", port=port)
