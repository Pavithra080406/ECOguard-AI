from typing import List, Dict, Any

def generate_health_advisory(aqi_val: float, aqi_cat: str, health_score: float, risk_class: int, top_factors: List[Dict[str, Any]], weather: dict) -> tuple[List[str], Dict[str, Any], Dict[str, Any]]:
    advice = []
    actions = []

    primary_pollutant = top_factors[0]["feature"] if top_factors else "PM2.5"

    if risk_class == 0: # Low Risk
        advice.append("Ambient air quality is favorable with minimal environmental health hazards.")
        advice.append("Outdoor workouts, sports, school activities, and natural ventilation are fully safe.")
        actions.append("Outdoor exercise and activities are encouraged.")
        actions.append("Open home and office windows for fresh air circulation.")
    elif risk_class == 1: # Moderate Risk
        advice.append(f"Moderate health risk detected. Elevated levels of {primary_pollutant} can trigger airway irritation.")
        advice.append("Individuals with respiratory or cardiac conditions should avoid strenuous outdoor exertion during peak traffic hours.")
        advice.append("Maintain good hydration and keep indoor spaces filtered if sensitivity arises.")
        actions.append("Wear N95/protective masks if commuting along major arterial roads.")
        actions.append("Reduce high-intensity outdoor cardio running; shift to shaded parks or indoor facilities.")
    else: # High Risk
        advice.append(f"High environmental health risk! Severe exposure to {primary_pollutant} poses acute physiological stress.")
        advice.append("Vulnerable populations (children, seniors, cardiac & asthma patients) must avoid outdoor exposure.")
        advice.append("Operate HEPA air purifiers indoors and seal windows against outdoor particulate infiltration.")
        actions.append("Mandatory N95/FFP2 respirator masks for anyone going outdoors.")
        actions.append("Suspend all outdoor physical sports and prolonged street-level transit.")

    # Deep age-group and clinical vulnerability guidance
    age_and_vulnerability_guidance = {
        "Infants & Children (0-14 yrs)": {
            "title": "Infants & School Children",
            "impact": (
                "Children breathe more air per kilogram of body weight. Particulates penetrate deeper into developing lungs, "
                "increasing the risk of acute bronchitis, coughing fits, and reduced lung capacity development."
                if risk_class > 0 else
                "Minimal risk to child lung development. Normal outdoor play and school sports are safe."
            ),
            "precaution": "Limit outdoor playground hours during peak smog hours; monitor for persistent coughing." if risk_class > 0 else "Safe for outdoor sports."
        },
        "Adults & Outdoor Workers": {
            "title": "Adults & Outdoor Commuters",
            "impact": (
                "Prolonged exposure during high physical activity causes airway mucosal irritation, eye stinging, reduced stamina, and early fatigue."
                if risk_class > 0 else
                "Optimal conditions for outdoor work, marathon training, and physical exertion."
            ),
            "precaution": "Take regular indoor breaks, stay hydrated, and wear protective anti-pollution masks during commute." if risk_class > 0 else "No restrictions."
        },
        "Senior Citizens (60+ yrs)": {
            "title": "Older Adults & Seniors",
            "impact": (
                "Age-related decrease in lung elasticity and immune defenses elevates susceptibility to secondary respiratory infections, "
                "aggravated breathlessness, and elevated arterial blood pressure."
                if risk_class > 0 else
                "Low risk. Morning and evening walks are beneficial."
            ),
            "precaution": "Avoid early morning walks when thermal inversion traps ground pollutants; walk indoors or in well-ventilated halls." if risk_class > 0 else "Safe for daily walks."
        },
        "Asthma, COPD & Respiratory Illness": {
            "title": "Patients with Asthma & Chronic Respiratory Disease",
            "impact": (
                "Inhaled fine particles (PM2.5/NO2) trigger immediate hyper-reactive bronchospasms, airway narrowing, and mucosal inflammation, "
                "frequently precipitating acute asthma attacks and COPD flare-ups."
                if risk_class > 0 else
                "Baseline airway stability maintained. Keep routine medications handy."
            ),
            "precaution": "Keep rescue inhalers (bronchodilators) immediately accessible at all times; run indoor HEPA filtration." if risk_class > 0 else "Maintain regular medication."
        },
        "Cardiovascular & Hypertension Patients": {
            "title": "Cardiovascular & Heart Disease Patients",
            "impact": (
                "Fine particulates pass into the bloodstream causing systemic endothelial inflammation, arterial vasoconstriction, "
                "elevated blood pressure, and heightened risk of ischemic cardiac events and arrhythmia."
                if risk_class > 0 else
                "Normal cardiovascular strain levels from ambient air."
            ),
            "precaution": "Avoid sudden high-intensity physical exertion in polluted air; monitor blood pressure and pulse." if risk_class > 0 else "Standard routine."
        },
        "Pregnant Women": {
            "title": "Expectant Mothers",
            "impact": (
                "Systemic inflammatory response and elevated carbon monoxide can impair maternal-fetal oxygen transfer and placental microcirculation."
                if risk_class > 0 else
                "Safe environmental conditions for pregnancy wellness."
            ),
            "precaution": "Stay in clean indoor air spaces; use air purifiers in sleeping areas." if risk_class > 0 else "Regular prenatal outdoor walks safe."
        }
    }

    # Flattened text format for backward compatibility
    sensitive_groups_text = {k: v["impact"] for k, v in age_and_vulnerability_guidance.items()}

    decision_support = {
        "aqi_status": aqi_cat,
        "primary_pollutant": primary_pollutant,
        "recommended_actions": actions,
        "sensitive_groups_guidance": sensitive_groups_text,
        "detailed_vulnerability_guidance": age_and_vulnerability_guidance
    }

    return advice, decision_support

def generate_ai_summary(city: str, aqi_val: float, aqi_cat: str, health_score: float, risk_label: str, top_factors: List[Dict[str, Any]]) -> str:
    top_pollutant = top_factors[0]["feature"] if top_factors else "PM2.5"
    top_impact = top_factors[0]["value"] if top_factors else "elevated"

    summary = (
        f"{city} currently records an estimated Air Quality Index of {aqi_val:.1f}, placing it in the '{aqi_cat}' category. "
        f"The primary ambient pollutant is {top_pollutant} at {top_impact}. "
        f"The health risk assessment engine projects an environmental Health Impact Score of {health_score:.2f}, "
        f"categorized as '{risk_label}'. "
    )

    if risk_label == "Low Risk":
        summary += "Air quality conditions are healthy. Outdoor recreation, school sports, and general public activities can proceed without health restrictions."
    elif risk_label == "Moderate Risk":
        summary += "Moderate environmental impact detected. Children, seniors, and individuals suffering from asthma or cardiovascular conditions should limit prolonged outdoor exertion."
    else:
        summary += "Elevated health risk alert. All residents—particularly children, elderly citizens, and people with respiratory or heart conditions—are advised to stay indoors, use air purifiers, and wear N95 masks."

    return summary
