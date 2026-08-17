import requests
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Fallback database of coordinates, weather, and pollutants for Indian Cities and States
CITY_DATABASE = {
    "chennai": {
        "city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707, "population": 7090000,
        "pollutants": {"pm2_5": 38.5, "pm10": 72.4, "no2": 26.2, "so2": 11.5, "o3": 42.1, "co": 0.85, "nh3": 14.2, "pb": 0.35},
        "weather": {"temperature": 31.2, "humidity": 78, "wind_speed": 16.5, "wind_direction": 140, "pressure": 1009, "rainfall": 0.0, "cloud_cover": 40}
    },
    "delhi": {
        "city": "Delhi", "state": "Delhi", "lat": 28.6139, "lon": 77.2090, "population": 19000000,
        "pollutants": {"pm2_5": 142.0, "pm10": 235.0, "no2": 58.0, "so2": 18.5, "o3": 65.0, "co": 1.95, "nh3": 32.0, "pb": 0.85},
        "weather": {"temperature": 28.5, "humidity": 62, "wind_speed": 9.2, "wind_direction": 290, "pressure": 1012, "rainfall": 0.0, "cloud_cover": 20}
    },
    "mumbai": {
        "city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lon": 72.8777, "population": 12500000,
        "pollutants": {"pm2_5": 65.4, "pm10": 118.2, "no2": 38.4, "so2": 14.8, "o3": 38.0, "co": 1.15, "nh3": 18.5, "pb": 0.42},
        "weather": {"temperature": 29.8, "humidity": 82, "wind_speed": 18.2, "wind_direction": 240, "pressure": 1008, "rainfall": 0.0, "cloud_cover": 60}
    },
    "bengaluru": {
        "city": "Bengaluru", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946, "population": 8400000,
        "pollutants": {"pm2_5": 28.2, "pm10": 54.0, "no2": 21.0, "so2": 8.5, "o3": 32.0, "co": 0.65, "nh3": 11.0, "pb": 0.25},
        "weather": {"temperature": 25.4, "humidity": 68, "wind_speed": 14.0, "wind_direction": 90, "pressure": 1014, "rainfall": 0.0, "cloud_cover": 30}
    },
    "kolkata": {
        "city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lon": 88.3639, "population": 4500000,
        "pollutants": {"pm2_5": 88.5, "pm10": 154.0, "no2": 42.1, "so2": 16.0, "o3": 48.5, "co": 1.45, "nh3": 22.0, "pb": 0.55},
        "weather": {"temperature": 30.0, "humidity": 84, "wind_speed": 11.5, "wind_direction": 170, "pressure": 1007, "rainfall": 0.0, "cloud_cover": 50}
    },
    "hyderabad": {
        "city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lon": 78.4867, "population": 6800000,
        "pollutants": {"pm2_5": 44.0, "pm10": 82.5, "no2": 29.5, "so2": 10.2, "o3": 39.0, "co": 0.92, "nh3": 15.8, "pb": 0.38},
        "weather": {"temperature": 31.0, "humidity": 65, "wind_speed": 13.8, "wind_direction": 110, "pressure": 1011, "rainfall": 0.0, "cloud_cover": 25}
    },
    "ahmedabad": {
        "city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lon": 72.5714, "population": 5600000,
        "pollutants": {"pm2_5": 72.0, "pm10": 135.0, "no2": 35.0, "so2": 13.5, "o3": 44.0, "co": 1.20, "nh3": 20.0, "pb": 0.45},
        "weather": {"temperature": 33.5, "humidity": 55, "wind_speed": 12.0, "wind_direction": 260, "pressure": 1010, "rainfall": 0.0, "cloud_cover": 15}
    },
    "pune": {
        "city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lon": 73.8567, "population": 3124000,
        "pollutants": {"pm2_5": 42.0, "pm10": 78.0, "no2": 28.0, "so2": 9.8, "o3": 36.5, "co": 0.88, "nh3": 14.5, "pb": 0.30},
        "weather": {"temperature": 27.8, "humidity": 64, "wind_speed": 14.2, "wind_direction": 270, "pressure": 1012, "rainfall": 0.0, "cloud_cover": 30}
    },
    "jaipur": {
        "city": "Jaipur", "state": "Rajasthan", "lat": 26.9124, "lon": 75.7873, "population": 3046000,
        "pollutants": {"pm2_5": 82.5, "pm10": 168.0, "no2": 36.2, "so2": 12.0, "o3": 49.0, "co": 1.30, "nh3": 21.0, "pb": 0.50},
        "weather": {"temperature": 32.0, "humidity": 48, "wind_speed": 11.0, "wind_direction": 220, "pressure": 1011, "rainfall": 0.0, "cloud_cover": 10}
    },
    "lucknow": {
        "city": "Lucknow", "state": "Uttar Pradesh", "lat": 26.8467, "lon": 80.9462, "population": 2817000,
        "pollutants": {"pm2_5": 115.0, "pm10": 195.0, "no2": 46.0, "so2": 15.0, "o3": 54.0, "co": 1.65, "nh3": 27.0, "pb": 0.65},
        "weather": {"temperature": 29.5, "humidity": 70, "wind_speed": 8.5, "wind_direction": 120, "pressure": 1010, "rainfall": 0.0, "cloud_cover": 25}
    },
    "chandigarh": {
        "city": "Chandigarh", "state": "Punjab", "lat": 30.7333, "lon": 76.7794, "population": 1055000,
        "pollutants": {"pm2_5": 58.0, "pm10": 105.0, "no2": 27.5, "so2": 10.5, "o3": 41.0, "co": 0.95, "nh3": 17.0, "pb": 0.35},
        "weather": {"temperature": 27.0, "humidity": 65, "wind_speed": 10.5, "wind_direction": 310, "pressure": 1013, "rainfall": 0.0, "cloud_cover": 20}
    },
    "bhopal": {
        "city": "Bhopal", "state": "Madhya Pradesh", "lat": 23.2599, "lon": 77.4126, "population": 1798000,
        "pollutants": {"pm2_5": 52.0, "pm10": 98.0, "no2": 25.0, "so2": 9.5, "o3": 38.0, "co": 0.85, "nh3": 15.0, "pb": 0.32},
        "weather": {"temperature": 30.2, "humidity": 60, "wind_speed": 12.5, "wind_direction": 250, "pressure": 1011, "rainfall": 0.0, "cloud_cover": 20}
    },
    "patna": {
        "city": "Patna", "state": "Bihar", "lat": 25.5941, "lon": 85.1376, "population": 1684000,
        "pollutants": {"pm2_5": 128.0, "pm10": 210.0, "no2": 49.0, "so2": 16.5, "o3": 58.0, "co": 1.80, "nh3": 29.0, "pb": 0.72},
        "weather": {"temperature": 30.5, "humidity": 74, "wind_speed": 7.5, "wind_direction": 100, "pressure": 1009, "rainfall": 0.0, "cloud_cover": 30}
    },
    "kochi": {
        "city": "Kochi", "state": "Kerala", "lat": 9.9312, "lon": 76.2673, "population": 677000,
        "pollutants": {"pm2_5": 22.0, "pm10": 42.0, "no2": 16.5, "so2": 6.2, "o3": 28.0, "co": 0.55, "nh3": 9.0, "pb": 0.18},
        "weather": {"temperature": 29.0, "humidity": 86, "wind_speed": 15.0, "wind_direction": 230, "pressure": 1010, "rainfall": 1.2, "cloud_cover": 70}
    },
    "guwahati": {
        "city": "Guwahati", "state": "Assam", "lat": 26.1445, "lon": 91.7362, "population": 962000,
        "pollutants": {"pm2_5": 48.0, "pm10": 86.0, "no2": 24.0, "so2": 8.0, "o3": 35.0, "co": 0.80, "nh3": 13.5, "pb": 0.28},
        "weather": {"temperature": 28.0, "humidity": 80, "wind_speed": 9.0, "wind_direction": 80, "pressure": 1011, "rainfall": 0.5, "cloud_cover": 55}
    },
    "visakhapatnam": {
        "city": "Visakhapatnam", "state": "Andhra Pradesh", "lat": 17.6868, "lon": 83.2185, "population": 1728000,
        "pollutants": {"pm2_5": 36.0, "pm10": 68.0, "no2": 22.0, "so2": 11.0, "o3": 37.0, "co": 0.78, "nh3": 13.0, "pb": 0.30},
        "weather": {"temperature": 31.0, "humidity": 80, "wind_speed": 17.0, "wind_direction": 150, "pressure": 1009, "rainfall": 0.0, "cloud_cover": 45}
    }
}

def get_coordinates(city_name: str):
    city_clean = city_name.strip().lower()
    api_key = settings.OPENWEATHER_API_KEY

    if api_key:
        try:
            url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name},IN&limit=1&appid={api_key}"
            res = requests.get(url, timeout=5)
            if res.status_code == 200 and len(res.json()) > 0:
                data = res.json()[0]
                return {
                    "city": data.get("name", city_name.title()),
                    "state": data.get("state", "India"),
                    "lat": float(data["lat"]),
                    "lon": float(data["lon"])
                }
        except Exception as e:
            logger.warning(f"Geocoding API error for {city_name}: {e}")

    # Fallback to internal India database
    if city_clean in CITY_DATABASE:
        item = CITY_DATABASE[city_clean]
        return {
            "city": item["city"],
            "state": item["state"],
            "lat": item["lat"],
            "lon": item["lon"]
        }
    
    # Generic fallback for unlisted Indian location
    return {
        "city": city_name.title(),
        "state": "Tamil Nadu",
        "lat": 13.0827,
        "lon": 80.2707
    }

def get_live_environmental_data(city_name: str):
    coord = get_coordinates(city_name)
    city_clean = city_name.strip().lower()
    api_key = settings.OPENWEATHER_API_KEY

    pollutants = None
    weather = None

    if api_key:
        try:
            # Weather API
            w_url = f"https://api.openweathermap.org/data/2.5/weather?lat={coord['lat']}&lon={coord['lon']}&units=metric&appid={api_key}"
            w_res = requests.get(w_url, timeout=5)
            if w_res.status_code == 200:
                w_data = w_res.json()
                weather = {
                    "temperature": float(w_data["main"]["temp"]),
                    "humidity": float(w_data["main"]["humidity"]),
                    "wind_speed": float(w_data["wind"]["speed"]) * 3.6, # m/s to km/h
                    "wind_direction": float(w_data["wind"].get("deg", 180)),
                    "pressure": float(w_data["main"]["pressure"]),
                    "cloud_cover": float(w_data["clouds"]["all"]),
                    "rainfall": float(w_data.get("rain", {}).get("1h", 0.0))
                }

            # Air pollution API
            p_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={coord['lat']}&lon={coord['lon']}&appid={api_key}"
            p_res = requests.get(p_url, timeout=5)
            if p_res.status_code == 200:
                p_data = p_res.json()["list"][0]["components"]
                pollutants = {
                    "pm2_5": float(p_data.get("pm2_5", 35.0)),
                    "pm10": float(p_data.get("pm10", 65.0)),
                    "no2": float(p_data.get("no2", 25.0)),
                    "so2": float(p_data.get("so2", 10.0)),
                    "o3": float(p_data.get("o3", 40.0)),
                    "co": float(p_data.get("co", 400.0)) / 1000.0,
                    "nh3": float(p_data.get("nh3", 15.0)),
                    "pb": 0.35
                }
        except Exception as e:
            logger.warning(f"Live API error: {e}")

    # Fallback to local DB if API unavailable or missing
    if not pollutants or not weather:
        if city_clean in CITY_DATABASE:
            fb = CITY_DATABASE[city_clean]
            pollutants = pollutants or fb["pollutants"]
            weather = weather or fb["weather"]
            coord["state"] = fb["state"]
            population = fb["population"]
        else:
            fb = CITY_DATABASE["chennai"]
            pollutants = pollutants or fb["pollutants"]
            weather = weather or fb["weather"]
            population = 5000000
    else:
        population = CITY_DATABASE.get(city_clean, {}).get("population", 5000000)

    return {
        "city": coord["city"],
        "state": coord["state"],
        "lat": coord["lat"],
        "lon": coord["lon"],
        "population": float(population),
        "pollutants": pollutants,
        "weather": weather
    }
