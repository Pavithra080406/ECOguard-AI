import math
from datetime import datetime
import numpy as np

def calculate_dew_point(temp_c: float, humidity_percent: float) -> float:
    # Magnus formula approximation
    a = 17.27
    b = 237.7
    alpha = ((a * temp_c) / (b + temp_c)) + math.log(max(humidity_percent, 1.0) / 100.0)
    return float((b * alpha) / (a - alpha))

def get_season(month: int) -> str:
    if month in [12, 1, 2]:
        return "Winter"
    elif month in [3, 4, 5]:
        return "Summer"
    elif month in [6, 7, 8, 9]:
        return "Monsoon"
    else:
        return "Post-Monsoon"

def generate_time_features(dt: datetime = None):
    if dt is None:
        dt = datetime.now()
    
    month = dt.month
    day_of_week = dt.weekday() # 0 = Monday, 6 = Sunday
    day_of_year = dt.timetuple().tm_yday
    hour = dt.hour
    is_weekend = 1 if day_of_week >= 5 else 0
    season = get_season(month)

    # Cyclical sin/cos encodings
    month_sin = math.sin(2 * math.pi * month / 12.0)
    month_cos = math.cos(2 * math.pi * month / 12.0)
    day_sin = math.sin(2 * math.pi * day_of_year / 365.25)
    day_cos = math.cos(2 * math.pi * day_of_year / 365.25)

    return {
        "Month": month,
        "DayOfWeek": day_of_week,
        "Day_of_Week": day_of_week,
        "DayOfYear": day_of_year,
        "Hour": hour,
        "Is_Weekend": is_weekend,
        "Season": season,
        "Month_Sin": month_sin,
        "Month_Cos": month_cos,
        "DayOfYear_Sin": day_sin,
        "DayOfYear_Cos": day_cos
    }
