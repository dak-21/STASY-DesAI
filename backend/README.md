# STASY Backend Server

This folder contains the Python/Flask server that powers the real-time computer vision analysis for STASY.

## Prerequisites
1. Python 3.9+
2. Kafka (Optional, for event streaming)
3. Webcam or Video File

## Installation

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Download YOLOv11 Model:
   The server expects `yolo11n.pt` in this directory. It will download automatically on first run via Ultralytics, or you can place it manually.

3. Environment Variables:
   Create a `.env` file with your ServiceNow credentials (see `.env.example`):
   ```
   SERVICENOW_URL=https://demoalectriallwf111717.service-now.com/api/now/table/u_stampede_data
   SERVICENOW_USER=stacy.user.integration
   SERVICENOW_PASSWORD=Aditya@516002
   API_KEY=your_google_api_key_here
   ```

## Running the Server

**Main Vision Server** (port 5000):
```bash
python main.py
```

**Alert Handler Server** (port 5001):
```bash
python alert_server.py
```

Both servers should run simultaneously. The main server handles video feeds; the alert server handles emergency notifications.

## API Endpoints

### Vision Server (port 5000)
- `GET /video_feed`: Stream processed video (MJPEG).
- `GET /api/status`: JSON data for the dashboard (Person count, Risk level, Logs).
- `POST /api/upload`: Upload video files for analysis.

### Alert Server (port 5001)
- `POST /api/send-alert`: Post stampede data to ServiceNow.
  ```json
  {
    "timeframe": "3 seconds",
    "status": "CRITICAL RISK",
    "location": "40.7128,-74.0060"
  }
  ```
- `GET /api/health`: Health check.

## ServiceNow Integration

The system posts stampede data to ServiceNow with the following fields:
- `u_stampede_data`: Stampede status (e.g., "CRITICAL RISK")
- `u_timeframe`: How long the critical event lasted
- `u_location`: GPS coordinates or address

Credentials configured in `.env` via BasicAuth.
