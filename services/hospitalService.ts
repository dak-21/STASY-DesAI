/**
 * Service to handle stampede alerts and ServiceNow integration
 */

export interface Hospital {
  name: string;
  lat: number;
  lon: number;
  distance_km?: number;
  email: string;
}

/**
 * Get user's geolocation
 */
export const getUserLocation = async (): Promise<{ lat: number; lon: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      () => resolve(null),
      { timeout: 5000 }
    );
  });
};

/**
 * Post stampede data to ServiceNow
 */
export const postStampedeAlert = async (
  timeframe: string,
  status: string,
  location: string
): Promise<boolean> => {
  try {
    const response = await fetch("/api/send-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timeframe,
        status,
        location
      })
    });
    
    if (!response.ok) throw new Error("ServiceNow POST failed");
    
    const data = await response.json();
    return data.success === true;
  } catch (e) {
    console.error("Failed to post to ServiceNow:", e);
    return false;
  }
};

/**
 * Format location string
 */
export const formatLocation = (lat: number, lon: number): string => {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
};

