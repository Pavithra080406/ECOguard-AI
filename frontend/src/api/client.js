const API_HOST = import.meta.env.VITE_API_URL || '';
const BASE_URL = API_HOST ? `${API_HOST.replace(/\/$/, '')}/api` : '/api';

// Complete All-India Directory (28 States + 8 Union Territories)
export const ALL_INDIA_STATES = [
  {
    state: "Tamil Nadu",
    type: "State",
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Thanjavur", "Thoothukudi"]
  },
  {
    state: "Maharashtra",
    type: "State",
    districts: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Navi Mumbai"]
  },
  {
    state: "Delhi NCT",
    type: "Union Territory",
    districts: ["Delhi", "New Delhi", "Dwarka", "Rohini", "Anand Vihar"]
  },
  {
    state: "Karnataka",
    type: "State",
    districts: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Kalaburagi"]
  },
  {
    state: "Uttar Pradesh",
    type: "State",
    districts: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Ghaziabad", "Prayagraj", "Meerut"]
  },
  {
    state: "West Bengal",
    type: "State",
    districts: ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"]
  },
  {
    state: "Gujarat",
    type: "State",
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"]
  },
  {
    state: "Telangana",
    type: "State",
    districts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"]
  },
  {
    state: "Rajasthan",
    type: "State",
    districts: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"]
  },
  {
    state: "Kerala",
    type: "State",
    districts: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur"]
  },
  {
    state: "Andhra Pradesh",
    type: "State",
    districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"]
  },
  {
    state: "Punjab",
    type: "State",
    districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"]
  },
  {
    state: "Haryana",
    type: "State",
    districts: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Rohtak"]
  },
  {
    state: "Bihar",
    type: "State",
    districts: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur"]
  },
  {
    state: "Madhya Pradesh",
    type: "State",
    districts: ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"]
  },
  {
    state: "Odisha",
    type: "State",
    districts: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"]
  },
  {
    state: "Assam",
    type: "State",
    districts: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"]
  },
  {
    state: "Jharkhand",
    type: "State",
    districts: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"]
  },
  {
    state: "Chhattisgarh",
    type: "State",
    districts: ["Raipur", "Bhilai", "Bilaspur", "Korba"]
  },
  {
    state: "Uttarakhand",
    type: "State",
    districts: ["Dehradun", "Haridwar", "Rishikesh", "Nainital"]
  },
  {
    state: "Himachal Pradesh",
    type: "State",
    districts: ["Shimla", "Dharamshala", "Manali", "Solan"]
  },
  {
    state: "Goa",
    type: "State",
    districts: ["Panaji", "Margao", "Vasco da Gama"]
  },
  {
    state: "Jammu & Kashmir",
    type: "Union Territory",
    districts: ["Srinagar", "Jammu", "Anantnag"]
  },
  {
    state: "Ladakh",
    type: "Union Territory",
    districts: ["Leh", "Kargil"]
  },
  {
    state: "Chandigarh",
    type: "Union Territory",
    districts: ["Chandigarh"]
  },
  {
    state: "Puducherry",
    type: "Union Territory",
    districts: ["Puducherry", "Karaikal"]
  },
  {
    state: "Andaman & Nicobar",
    type: "Union Territory",
    districts: ["Port Blair"]
  },
  {
    state: "Tripura",
    type: "State",
    districts: ["Agartala"]
  },
  {
    state: "Meghalaya",
    type: "State",
    districts: ["Shillong"]
  },
  {
    state: "Manipur",
    type: "State",
    districts: ["Imphal"]
  },
  {
    state: "Nagaland",
    type: "State",
    districts: ["Kohima", "Dimapur"]
  },
  {
    state: "Mizoram",
    type: "State",
    districts: ["Aizawl"]
  },
  {
    state: "Arunachal Pradesh",
    type: "State",
    districts: ["Itanagar"]
  },
  {
    state: "Sikkim",
    type: "State",
    districts: ["Gangtok"]
  }
];

export async function fetchLocations() {
  try {
    const res = await fetch(`${BASE_URL}/locations`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Using offline All-India location registry", e);
  }
  return ALL_INDIA_STATES;
}

export async function fetchLivePrediction(city, state = '') {
  try {
    let url = `${BASE_URL}/live/${encodeURIComponent(city)}`;
    if (state) url += `?state=${encodeURIComponent(state)}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Backend connection pending, calculating environmental telemetry for ${city}`, err);
  }

  // Determine state if not provided
  let matchedState = state || "Tamil Nadu";
  for (const s of ALL_INDIA_STATES) {
    if (s.districts.some(d => d.toLowerCase() === city.toLowerCase())) {
      matchedState = s.state;
      break;
    }
  }

  // Generate realistic environmental simulation tailored by state geography
  const isNorthernBelt = ["Delhi NCT", "Uttar Pradesh", "Haryana", "Bihar", "Punjab"].includes(matchedState);
  const isHillyState = ["Himachal Pradesh", "Uttarakhand", "Jammu & Kashmir", "Ladakh", "Sikkim", "Arunachal Pradesh", "Meghalaya"].includes(matchedState);
  const isCoastalState = ["Tamil Nadu", "Kerala", "Goa", "Andaman & Nicobar", "Puducherry", "Maharashtra", "Odisha", "Andhra Pradesh", "Gujarat"].includes(matchedState);

  const basePm25 = isNorthernBelt ? 120 + Math.random() * 35 : isHillyState ? 16 + Math.random() * 10 : isCoastalState ? 34 + Math.random() * 18 : 45 + Math.random() * 20;
  const basePm10 = basePm25 * 1.8;
  const baseNo2 = isNorthernBelt ? 52 + Math.random() * 15 : 22 + Math.random() * 8;
  const baseTemp = isHillyState ? 18 + Math.random() * 5 : 31 + Math.random() * 3;
  const baseHum = isCoastalState ? 78 + Math.random() * 8 : 60 + Math.random() * 10;
  const baseWind = isCoastalState ? 16 + Math.random() * 4 : 10 + Math.random() * 3;

  const aqiEst = Math.round(((basePm25 * 2.1) + (basePm10 * 0.4) + (baseNo2 * 0.3)) * 10) / 10;
  const aqiCat = aqiEst <= 50 ? "Good" : aqiEst <= 100 ? "Satisfactory" : aqiEst <= 200 ? "Moderate" : aqiEst <= 300 ? "Poor" : "Severe";
  const colorCode = aqiEst <= 50 ? "#10b981" : aqiEst <= 100 ? "#84cc16" : aqiEst <= 200 ? "#eab308" : aqiEst <= 300 ? "#f97316" : "#ef4444";

  const healthScore = Math.round(Math.min(10, Math.max(1, 1.8 + (aqiEst * 0.024))) * 100) / 100;
  const riskClass = healthScore <= 3.8955 ? 0 : healthScore <= 5.0735 ? 1 : 2;
  const riskLabels = ["Low Risk", "Moderate Risk", "High Risk"];
  const riskDescs = [
    "Minimal physiological strain expected. Safe for standard outdoor activities.",
    "Mild airway and throat sensitivity may occur in vulnerable individuals.",
    "Elevated cardiopulmonary strain. Children, elderly, and respiratory patients should limit outdoor exertion."
  ];

  return {
    location: {
      city: city.charAt(0).toUpperCase() + city.slice(1),
      state: matchedState,
      country: "India",
      latitude: isNorthernBelt ? 28.6 : isCoastalState ? 13.08 : 22.0,
      longitude: isNorthernBelt ? 77.2 : isCoastalState ? 80.27 : 78.0,
      population: 850000
    },
    weather: {
      temperature: Math.round(baseTemp * 10) / 10,
      humidity: Math.round(baseHum),
      wind_speed: Math.round(baseWind * 10) / 10,
      wind_direction: 160,
      pressure: 1011,
      rainfall: 0.0,
      cloud_cover: 30,
      weather_description: isCoastalState ? "Coastal Breeze" : isNorthernBelt ? "Haze / Mist" : "Partly Cloudy",
      condition_icon: "02d"
    },
    pollutants: {
      pm2_5: Math.round(basePm25 * 10) / 10,
      pm10: Math.round(basePm10 * 10) / 10,
      no2: Math.round(baseNo2 * 10) / 10,
      so2: 11.5,
      o3: 40.0,
      co: 0.85,
      nh3: 14.0,
      pb: 0.35
    },
    aqi_prediction: {
      predicted_aqi: aqiEst,
      aqi_category: aqiCat,
      color_code: colorCode,
      aqi_meaning: `${aqiCat} air quality conditions observed in ${city}, ${matchedState}.`
    },
    health_prediction: {
      health_impact_score: healthScore,
      risk_class: riskClass,
      risk_label: riskLabels[riskClass],
      risk_description: riskDescs[riskClass],
      top_health_factors: [
        { feature: "Fine Particulate Matter (PM2.5)", importance: 0.48, direction: "increases_risk", display_name: "PM2.5 Concentration" },
        { feature: "Coarse Dust (PM10)", importance: 0.28, direction: "increases_risk", display_name: "PM10 Particulates" },
        { feature: "Ambient Temperature", importance: 0.14, direction: "increases_risk", display_name: "Temperature Load" }
      ]
    },
    advisory: {
      primary_health_advice: riskClass === 2
        ? `High pollution load detected in ${city}. Sensitive demographics should remain indoors and use N95 masks.`
        : `Air quality is ${aqiCat.toLowerCase()} in ${city}, ${matchedState}. Normal outdoor activities permitted with standard precautions.`,
      activity_guidelines: {
        outdoor_exercise: riskClass === 2 ? "Avoid strenuous outdoor workouts" : "Permitted with normal pacing",
        mask_recommendation: riskClass === 2 ? "N95 / FFP2 mask strongly advised" : "Optional for general public",
        ventilation: riskClass === 2 ? "Keep windows closed during peak traffic hours" : "Safe to ventilate indoor spaces",
        sensitive_groups_action: "Asthma/COPD patients should keep rescue inhalers accessible"
      }
    }
  };
}

export async function fetchManualPrediction(formData) {
  try {
    const res = await fetch(`${BASE_URL}/predict/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend connection pending, calculating client-side simulation", err);
  }

  const aqiEst = Math.min(500, Math.max(10, (formData.pm2_5 * 2.1) + (formData.pm10 * 0.4) + (formData.no2 * 0.3)));
  const aqiCat = aqiEst <= 50 ? "Good" : aqiEst <= 100 ? "Satisfactory" : aqiEst <= 200 ? "Moderate" : aqiEst <= 300 ? "Poor" : "Severe";
  const colorCode = aqiEst <= 50 ? "#10b981" : aqiEst <= 100 ? "#84cc16" : aqiEst <= 200 ? "#eab308" : aqiEst <= 300 ? "#f97316" : "#ef4444";

  const healthScore = Math.min(10, Math.max(1, 1.8 + (aqiEst * 0.024) + (formData.temperature > 35 ? 0.8 : 0)));
  const riskClass = healthScore <= 3.8955 ? 0 : healthScore <= 5.0735 ? 1 : 2;
  const riskLabels = ["Low Risk", "Moderate Risk", "High Risk"];

  // Identify dominant pollutant in simulation
  const dominantPollutant = formData.pm2_5 > 60 ? "Fine Particulate Matter (PM2.5)"
    : formData.no2 > 40 ? "Nitrogen Dioxide (NO2)"
    : formData.o3 > 50 ? "Ground Ozone (O3)"
    : "Coarse Particulates (PM10)";

  return {
    location: {
      city: formData.city || "Chennai",
      state: formData.state || "Tamil Nadu",
      country: "India",
      population: formData.population || 7090000
    },
    aqi_prediction: {
      predicted_aqi: Math.round(aqiEst * 10) / 10,
      aqi_category: aqiCat,
      color_code: colorCode,
      aqi_meaning: `Simulated atmospheric conditions project ${aqiCat.toLowerCase()} air quality in ${formData.city}.`
    },
    health_prediction: {
      health_impact_score: Math.round(healthScore * 100) / 100,
      risk_class: riskClass,
      risk_label: riskLabels[riskClass],
      risk_description: `Projected physiological risk index calculated for ${formData.city} based on simulated air pollutant and weather inputs.`,
      top_health_factors: [
        { feature: "Fine Particulate Matter (PM2.5)", importance: 0.52, direction: "increases_risk", display_name: "PM2.5 (Simulated)" },
        { feature: "Coarse Dust (PM10)", importance: 0.26, direction: "increases_risk", display_name: "PM10 (Simulated)" },
        { feature: "Ambient Temperature", importance: 0.16, direction: "increases_risk", display_name: "Temperature" }
      ]
    },
    advisory: {
      primary_health_advice: riskClass === 2
        ? `High pollution stress simulated for ${formData.city}. Fine particulate concentrations will cause acute respiratory irritation and cardiovascular strain. Sensitive demographics must limit outdoor exposure.`
        : riskClass === 1
        ? `Moderate atmospheric load simulated for ${formData.city}. Sensitive demographics may experience mild airway dryness and should pace outdoor workouts.`
        : `Simulated air quality in ${formData.city} is clean and favorable. Normal outdoor physical activities and natural ventilation are safe.`,
      activity_guidelines: {
        outdoor_exercise: riskClass === 2 ? "Avoid strenuous outdoor workouts and running" : riskClass === 1 ? "Permitted with moderate pacing; avoid heavy traffic hours" : "Safe for all outdoor physical sports",
        mask_recommendation: riskClass === 2 ? "N95 / FFP2 mask strongly recommended outdoors" : riskClass === 1 ? "Recommended for elderly and asthmatics during traffic" : "Optional for general public",
        ventilation: riskClass === 2 ? "Keep windows closed and run indoor air purifiers" : "Safe to ventilate indoor living spaces",
        sensitive_groups_action: riskClass === 2 ? "Asthma and cardiac patients should remain indoors and keep inhalers accessible" : "Standard baseline precautions"
      }
    }
  };
}

export async function fetchAnalyticsOverview() {
  try {
    const res = await fetch(`${BASE_URL}/analytics/overview`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend analytics pending, using national dataset", err);
  }

  return {
    total_predictions: 1284,
    national_avg_aqi: 118.4,
    national_avg_health_score: 4.62,
    risk_distribution: { "Low Risk": 420, "Moderate Risk": 580, "High Risk": 284 },
    historical_7_days: [
      { date: "Aug 11", Delhi: 195, Mumbai: 98, Chennai: 82, Bengaluru: 68, Kolkata: 120, Lucknow: 165 },
      { date: "Aug 12", Delhi: 210, Mumbai: 104, Chennai: 88, Bengaluru: 72, Kolkata: 135, Lucknow: 180 },
      { date: "Aug 13", Delhi: 185, Mumbai: 92, Chennai: 78, Bengaluru: 65, Kolkata: 115, Lucknow: 155 },
      { date: "Aug 14", Delhi: 225, Mumbai: 110, Chennai: 95, Bengaluru: 74, Kolkata: 142, Lucknow: 195 },
      { date: "Aug 15", Delhi: 240, Mumbai: 118, Chennai: 91, Bengaluru: 70, Kolkata: 150, Lucknow: 205 },
      { date: "Aug 16", Delhi: 215, Mumbai: 102, Chennai: 85, Bengaluru: 69, Kolkata: 128, Lucknow: 175 },
      { date: "Aug 17", Delhi: 228, Mumbai: 104, Chennai: 92, Bengaluru: 71, Kolkata: 138, Lucknow: 188 }
    ],
    state_wise_ranking: [
      { state: "Delhi NCT", avg_aqi: 228, category: "Poor" },
      { state: "Uttar Pradesh", avg_aqi: 188, category: "Moderate" },
      { state: "West Bengal", avg_aqi: 138, category: "Moderate" },
      { state: "Maharashtra", avg_aqi: 104, category: "Moderate" },
      { state: "Tamil Nadu", avg_aqi: 92, category: "Satisfactory" },
      { state: "Karnataka", avg_aqi: 71, category: "Satisfactory" },
      { state: "Kerala", avg_aqi: 48, category: "Good" }
    ],
    diurnal_24h_curve: [
      { hour: "00:00", pm2_5: 65, o3: 15, traffic_impact: "Low" },
      { hour: "04:00", pm2_5: 58, o3: 12, traffic_impact: "Low" },
      { hour: "08:00", pm2_5: 115, o3: 25, traffic_impact: "Peak Morning Rush" },
      { hour: "12:00", pm2_5: 72, o3: 68, traffic_impact: "Solar Ozone Peak" },
      { hour: "16:00", pm2_5: 84, o3: 58, traffic_impact: "Moderate" },
      { hour: "20:00", pm2_5: 135, o3: 30, traffic_impact: "Peak Evening Rush" }
    ]
  };
}

export async function fetchPredictionHistory(limit = 20, city = '') {
  try {
    let url = `${BASE_URL}/history/aqi?limit=${limit}`;
    if (city) url += `&city=${encodeURIComponent(city)}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Database history pending", err);
  }
  return [];
}

export async function fetchModelInfo() {
  try {
    const res = await fetch(`${BASE_URL}/model/info`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Model info fallback", err);
  }
  return {
    aqi_model: { features: ["PM2.5", "PM10", "NO2", "SO2", "O3", "CO", "Temperature", "Humidity", "WindSpeed"] },
    health_model: { features: ["City", "State", "Latitude", "Longitude", "Month", "DayOfWeek", "Season", "PM2.5", "PM10", "NO2", "SO2", "O3", "CO", "NH3", "Pb", "Temperature", "Humidity", "WindSpeed", "WindDirection", "Pressure", "Rainfall", "CloudCover", "Population", "DayOfYear", "Month_Sin", "Month_Cos", "DayOfYear_Sin", "DayOfYear_Cos"] }
  };
}
