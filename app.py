import os
from flask import Flask, jsonify
from config import config

app = Flask(__name__)

# Load configuration
env = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config.get(env, config['default']))

@app.route('/v1/helloworld', methods=['GET'])
def hello_world():
    """
    Returns a simple "Hello, world." message
    """
    return jsonify({"message": "Hello, world."})

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    config_obj = config.get(env, config['default'])
    app.run(
        debug=config_obj.DEBUG,
        host=config_obj.HOST,
        port=config_obj.PORT
    )
