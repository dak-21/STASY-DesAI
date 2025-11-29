"""
Backend service to handle emergency alerts and post to ServiceNow.
"""

import requests
import json
from datetime import datetime
from dotenv import load_dotenv
import os
import base64

load_dotenv()

# ServiceNow Configuration
SERVICENOW_URL = os.getenv("SERVICENOW_URL", "https://demoalectriallwf111717.service-now.com/api/now/table/u_stampede_data")
SERVICENOW_USER = os.getenv("SERVICENOW_USER", "stacy.user.integration")
SERVICENOW_PASSWORD = os.getenv("SERVICENOW_PASSWORD", "Aditya@516002")


def post_stampede_data(timeframe: str, status: str, location: str) -> dict:
    """
    Post stampede data to ServiceNow.
    
    Args:
        timeframe: How long the critical event lasted (e.g., "3 seconds", "15 seconds")
        status: Stampede status (e.g., "CRITICAL RISK", "HIGH DENSITY WARNING")
        location: Location coordinates or address (e.g., "40.7128,-74.0060")
    
    Returns:
        dict: Response with success status and data
    """
    try:
        # Create basic auth header
        credentials = f"{SERVICENOW_USER}:{SERVICENOW_PASSWORD}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Prepare payload
        payload = {
            "u_stampede_data": status,
            "u_timeframe": timeframe,
            "u_location": location
        }
        
        # POST to ServiceNow
        response = requests.post(
            SERVICENOW_URL,
            json=payload,
            headers=headers,
            timeout=10
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            return {
                "success": True,
                "message": "Data posted to ServiceNow successfully",
                "record_id": data.get("result", {}).get("sys_id", ""),
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "success": False,
                "message": f"ServiceNow error: {response.status_code}",
                "response": response.text
            }
    
    except Exception as e:
        print(f"Error posting to ServiceNow: {e}")
        return {
            "success": False,
            "message": str(e)
        }


def get_fallback_hospitals() -> list:
    """Return a list of fallback hospitals with coordinates."""
    return [
        {"name": "Emergency Medical Center", "email": "emergency@hospital.com", "coords": (40.7128, -74.0060)},
        {"name": "City General Hospital", "email": "general@hospital.com", "coords": (40.7580, -73.9855)},
    ]

