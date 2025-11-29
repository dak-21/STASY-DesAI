"""
Flask app to handle stampede alerts and post to ServiceNow.
"""

from flask import Flask, request, jsonify
from alert_handler import post_stampede_data
from datetime import datetime

app = Flask(__name__)


@app.route("/api/send-alert", methods=["POST"])
def send_alert():
    """
    Endpoint to post stampede data to ServiceNow.
    
    Expected JSON:
    {
        "timeframe": "3 seconds",
        "status": "CRITICAL RISK",
        "location": "40.7128,-74.0060"
    }
    """
    try:
        data = request.json
        timeframe = data.get("timeframe", "Unknown")
        status = data.get("status", "CRITICAL RISK")
        location = data.get("location", "Unknown")
        
        # Post to ServiceNow
        result = post_stampede_data(timeframe, status, location)
        
        if result["success"]:
            return jsonify({
                "success": True,
                "message": "Alert posted to ServiceNow",
                "record_id": result.get("record_id"),
                "timestamp": datetime.now().isoformat()
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": result.get("message")
            }), 500
    
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "service": "STASY Alert Handler"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)
