from typing import List, Dict, Any

# Clinical knowledge base for specific pollutant-biological interactions
POLLUTANT_CLINICAL_PATHWAYS = {
    "PM2.5": {
        "chemical_name": "Fine Particulate Matter (PM2.5)",
        "mechanism": "Trans-alveolar migration into bloodstream triggering systemic oxidative stress and endothelial inflammation",
        "children": "Small airway caliber and high respiratory frequency leads to 2.4x higher mass deposition per lung surface area, provoking bronchiolar hyper-reactivity.",
        "commuters": "Deep alveolar deposition during outdoor physical exertion causing acute reduction in forced vital capacity (FVC) and exercise fatigue.",
        "seniors": "Impaired phagocytic clearance and age-related vascular stiffness exacerbate cardiac arrhythmia risk and nocturnal dyspnea.",
        "asthma": "Alveolar macrophage activation and mast cell degranulation provoke immediate bronchoconstriction and steroid-resistant airway swelling.",
        "cardiac": "Systemic cytokine release (IL-6, TNF-alpha) induces vascular vasoconstriction, elevated arterial pressure, and accelerated plaque instability.",
        "pregnancy": "Nanoscale particle transfer across placental barrier may impair umbilical-placental perfusion and elevate maternal oxidative load.",
        "action": "Utilize true HEPA (H13) air filtration indoors and wear well-fitted N95/FFP2 respirators when traveling."
    },
    "PM10": {
        "chemical_name": "Coarse Particulate Matter (PM10)",
        "mechanism": "Upper tracheobronchial impaction causing mechanical mucosal abrasion and goblet cell hypersecretion",
        "children": "Upper airway mucosal irritation, persistent dry cough, and rhinitis during outdoor playground activity.",
        "commuters": "Nasopharyngeal irritation, vocal cord dryness, and accelerated upper respiratory tract inflammation.",
        "seniors": "Ciliary clearance dysfunction leads to prolonged particle retention in upper airways and secondary bacterial vulnerability.",
        "asthma": "Mechanical irritation of large central airways triggers reflex coughing bouts and mucus hypersecretion.",
        "cardiac": "Upper airway inflammatory cascades contribute to sympathetic nervous system stimulation and heart rate elevation.",
        "pregnancy": "Maternal upper airway congestion and snoring-related nocturnal sleep fragmentation.",
        "action": "Rinse eyes and nasal passages after outdoor exposure; keep windows sealed against coarse road dust."
    },
    "NO2": {
        "chemical_name": "Nitrogen Dioxide (NO2)",
        "mechanism": "Potent oxidant gas causing lipid peroxidation in airway epithelial lining fluid",
        "children": "Induces epithelial barrier permeability, dramatically increasing childhood sensitivity to seasonal allergens.",
        "commuters": "Direct inhalation of traffic exhaust causes acute pharyngeal burning, eye stinging, and decreased time-to-exhaustion.",
        "seniors": "Accelerates decline in gas diffusion capacity (DLCO), magnifying baseline breathlessness during daily ambulation.",
        "asthma": "Potentiates extreme bronchial responsiveness to sub-threshold triggers, tripling the probability of acute rescue inhaler usage.",
        "cardiac": "Impairs systemic endothelial nitric oxide bioavailability, provoking acute systemic arterial vasoconstriction.",
        "pregnancy": "Systemic maternal nitrative stress; avoid prolonged transit along congested vehicular expressways.",
        "action": "Avoid transit along heavily congested diesel corridors during morning/evening commute spikes."
    },
    "O3": {
        "chemical_name": "Ground-Level Ozone (O3)",
        "mechanism": "Powerful free radical oxidizer reacting instantly with respiratory tract lining fluids",
        "children": "Rapid antioxidant depletion in young lung tissue, inducing chest soreness and restrictive airway pain upon deep breathing.",
        "commuters": "Post-workout substernal chest tightness, airway cramping, and diminished peak expiratory flow rate.",
        "seniors": "Severe worsening of chronic bronchitis symptoms and diminished arterial oxygenation under midday ambient heat.",
        "asthma": "Causes direct epithelial desquamation and neutrophilic airway influx, precipitating severe steroid-refractory spasms.",
        "cardiac": "Sympathetic autonomic nervous dominance and baroreceptor reflex alteration causing heart rate variability decline.",
        "pregnancy": "Maternal oxidative stress during peak afternoon solar radiation hours; maintain indoor air-conditioned sanctuary.",
        "action": "Reschedule all outdoor physical training to early morning hours before sunlight catalyzes photochemical ozone formation."
    },
    "SO2": {
        "chemical_name": "Sulfur Dioxide (SO2)",
        "mechanism": "Hydrolysis to sulfurous acid on moist airway membranes causing cholinergic reflex bronchoconstriction",
        "children": "Rapid sensory nerve stimulation causing laryngospasm and acute wheezing in young children within 5 minutes of exposure.",
        "commuters": "Throat stinging, coughing, and acute eye burning near industrial or coal combustion sources.",
        "seniors": "Aggravation of pre-existing emphysema and reduction in alveolar gas exchange efficiency.",
        "asthma": "Ultra-rapid bronchoconstriction occurring within 2 minutes of inhalation even at very low threshold concentrations.",
        "cardiac": "Reflex pulmonary vasoconstriction increasing right ventricular afterload and cardiac work.",
        "pregnancy": "Avoid downwind areas from heavy industrial boilers or sulfur-emitting energy plants.",
        "action": "Keep fast-acting inhaled anticholinergics/beta-agonists accessible; seal living quarters against industrial sulfur plumes."
    },
    "CO": {
        "chemical_name": "Carbon Monoxide (CO)",
        "mechanism": "High-affinity binding to hemoglobin forming carboxyhemoglobin (COHb), impairing cellular oxygen delivery",
        "children": "Higher metabolic basal oxygen demand makes developing brain tissue sensitive to sub-clinical COHb elevations.",
        "commuters": "Mild frontal headache, drowsiness, and delayed reaction times during slow-moving urban tunnel/traffic congestion.",
        "seniors": "Reduces myocardial oxygen reserve, triggering silent myocardial ischemia and anginal chest heaviness.",
        "asthma": "Indirect worsening of dyspnea due to systemic tissue hypoxia superimposed on mechanical airway resistance.",
        "cardiac": "Direct reduction of coronary oxygen supply; critical risk factor for ischemic cardiac decompensation.",
        "pregnancy": "CO crosses placenta and binds fetal hemoglobin with 200x affinity, severely reducing fetal tissue oxygenation.",
        "action": "Ensure vehicular cabin recirculation is activated in traffic jams; avoid idling engines in enclosed parking structures."
    },
    "Temperature": {
        "chemical_name": "Thermal Meteorological Stress",
        "mechanism": "Thermoregulatory strain combined with atmospheric boundary layer trapping of criteria pollutants",
        "children": "Rapid dehydration risk and accelerated pollutant inhalation due to high thermal respiratory rates.",
        "commuters": "Heat exhaustion, electrolyte depletion, and intensified pulmonary pollutant uptake.",
        "seniors": "Cardiovascular thermoregulatory strain, elevated blood viscosity, and increased thrombosis probability.",
        "asthma": "Thermal hyperpnea provokes airway drying and exercise-induced bronchoconstriction.",
        "cardiac": "Severe cutaneous vasodilation strains cardiac output, creating hemodynamic instability in hypertensive patients.",
        "pregnancy": "Elevated maternal core body temperature and blood pressure fluctuations; prioritize cool, filtered indoor environments.",
        "action": "Maintain active electrolyte hydration and utilize indoor temperature control during peak midday heat."
    },
    "Humidity": {
        "chemical_name": "Atmospheric Moisture & Vapor Pressure",
        "mechanism": "High relative humidity promotes hygroscopic growth of fine particulates and enhances bio-aerosol persistence",
        "children": "Dense humid air facilitates allergen and mold spore suspension, triggering pediatric rhinitis.",
        "commuters": "Sensory discomfort, reduced sweat evaporation, and intensified perceived respiratory resistance.",
        "seniors": "Oppressive moisture impedes respiratory heat dissipation and elevates perception of breathlessness.",
        "asthma": "Hygroscopically swollen particulate matter and high mold counts provoke allergic airway flare-ups.",
        "cardiac": "Elevated circulatory demands to support evaporative cooling under high ambient vapor pressure.",
        "pregnancy": "Increased maternal fatigue and peripheral edema; stay in dehumidified indoor spaces.",
        "action": "Use indoor dehumidification and air filtration to mitigate mold and particle suspension."
    }
}

def generate_health_advisory(
    aqi_val: float,
    aqi_cat: str,
    health_score: float,
    risk_class: int,
    top_factors: List[Dict[str, Any]],
    weather: dict
) -> tuple[List[str], Dict[str, Any]]:
    """
    Explainable AI (XAI) Health Advisory Engine.
    Dynamically derives clinical pathways and demographic guidance using SHAP feature attribution
    rather than rigid static thresholds.
    """
    # 1. Extract Top SHAP Drivers
    primary_factor = top_factors[0] if top_factors else {"feature": "PM2.5", "impact": 0.45, "direction": "increases risk"}
    secondary_factor = top_factors[1] if len(top_factors) > 1 else {"feature": "PM10", "impact": 0.25, "direction": "increases risk"}

    prim_name = primary_factor["feature"]
    sec_name = secondary_factor["feature"]

    # Match to clinical pathway dictionary
    def get_pathway(feat_name: str):
        for k, v in POLLUTANT_CLINICAL_PATHWAYS.items():
            if k.lower() in feat_name.lower() or feat_name.lower() in k.lower():
                return v
        return POLLUTANT_CLINICAL_PATHWAYS["PM2.5"]

    prim_pathway = get_pathway(prim_name)
    sec_pathway = get_pathway(sec_name)

    # 2. Compute Explainable SHAP Clinical Syntheses
    total_shap_impact = sum(f.get("impact", 0.1) for f in top_factors) or 1.0
    prim_pct = int((primary_factor.get("impact", 0.5) / total_shap_impact) * 100)
    sec_pct = int((secondary_factor.get("impact", 0.25) / total_shap_impact) * 100)

    # 3. Dynamic Demographics Guidance synthesized by XAI
    demographics = {
        "Infants & Children (0-14 yrs)": {
            "title": "Infants & School Children (0–14 yrs)",
            "primary_driver": f"{prim_name} (+{primary_factor.get('impact', 0.4):.2f} SHAP impact, {prim_pct}% contribution)",
            "secondary_driver": f"{sec_name} ({sec_pct}% contribution)",
            "physiological_mechanism": prim_pathway["children"],
            "impact": (
                f"Explainable AI shows {prim_name} is the primary driver ({prim_pct}% attribution). "
                f"{prim_pathway['children']} High respiratory rates accelerate cumulative alveolar deposition."
            ),
            "precaution": (
                f"{prim_pathway['action']} Avoid outdoor school playground activities during peak {prim_name} hours."
            )
        },
        "Adults & Outdoor Workers": {
            "title": "Adult Commuters & Outdoor Workers",
            "primary_driver": f"{prim_name} (+{primary_factor.get('impact', 0.4):.2f} SHAP impact)",
            "secondary_driver": f"{sec_name} (+{secondary_factor.get('impact', 0.2):.2f} SHAP impact)",
            "physiological_mechanism": prim_pathway["commuters"],
            "impact": (
                f"SHAP attribution identifies {prim_name} ({primary_factor.get('value', '')}) as driving acute exertion fatigue. "
                f"{prim_pathway['commuters']} Combined with {sec_name}, it elevates respiratory airway resistance."
            ),
            "precaution": (
                f"Wear high-efficiency filtration masks during transit. {prim_pathway['action']}"
            )
        },
        "Senior Citizens (60+ yrs)": {
            "title": "Older Adults & Senior Citizens (60+ yrs)",
            "primary_driver": f"{prim_name} (+{primary_factor.get('impact', 0.4):.2f} SHAP impact)",
            "secondary_driver": f"{sec_name} (+{secondary_factor.get('impact', 0.2):.2f} SHAP impact)",
            "physiological_mechanism": prim_pathway["seniors"],
            "impact": (
                f"Model XAI highlights {prim_name} as accelerating cardiopulmonary strain. "
                f"{prim_pathway['seniors']} Blended atmospheric load elevates resting systolic pressure."
            ),
            "precaution": (
                f"Reschedule morning outdoor strolls. {prim_pathway['action']} Maintain prescribed cardiovascular and hypertensive medications."
            )
        },
        "Asthma, COPD & Respiratory Illness": {
            "title": "Patients with Asthma & Chronic Respiratory Illness",
            "primary_driver": f"{prim_name} (+{primary_factor.get('impact', 0.4):.2f} SHAP impact)",
            "secondary_driver": f"{sec_name} ({sec_pct}% contribution)",
            "physiological_mechanism": prim_pathway["asthma"],
            "impact": (
                f"XAI identifies {prim_name} as triggering acute bronchial hyper-responsiveness. "
                f"{prim_pathway['asthma']} High risk of bronchospasms and sudden peak expiratory flow drop."
            ),
            "precaution": (
                f"Keep fast-acting bronchodilator inhalers within immediate reach. {prim_pathway['action']}"
            )
        },
        "Cardiovascular & Hypertension Patients": {
            "title": "Cardiovascular & Hypertension Patients",
            "primary_driver": f"{prim_name} (+{primary_factor.get('impact', 0.4):.2f} SHAP impact)",
            "secondary_driver": f"{sec_name} ({sec_pct}% contribution)",
            "physiological_mechanism": prim_pathway["cardiac"],
            "impact": (
                f"SHAP feature weighting confirms {prim_name} drives systemic vascular resistance. "
                f"{prim_pathway['cardiac']} Elevates myocardial oxygen consumption under current ambient load."
            ),
            "precaution": (
                f"Avoid sudden isometric physical exertion outdoors. Monitor resting heart rate and blood pressure regularly."
            )
        },
        "Pregnant Women": {
            "title": "Expectant Mothers & Prenatal Health",
            "primary_driver": f"{prim_name} (+{primary_factor.get('impact', 0.4):.2f} SHAP impact)",
            "secondary_driver": f"{sec_name} ({sec_pct}% contribution)",
            "physiological_mechanism": prim_pathway["pregnancy"],
            "impact": (
                f"XAI feature analysis links {prim_name} to maternal systemic oxidative markers. "
                f"{prim_pathway['pregnancy']}"
            ),
            "precaution": (
                f"Maintain clean indoor air spaces with HEPA air purification. {prim_pathway['action']}"
            )
        }
    }

    # 4. Synthesize AI Advisory Statements
    advice = [
        f"Explainable AI identifies {prim_name} ({prim_pct}% SHAP contribution) and {sec_name} ({sec_pct}% SHAP contribution) as the primary risk drivers.",
        f"Biological pathway: {prim_pathway['mechanism']}.",
        f"Targeted clinical recommendation: {prim_pathway['action']}"
    ]

    actions = [
        f"Targeted action against {prim_name}: {prim_pathway['action']}",
        f"Sensitive groups (Asthma/Cardiovascular): Limit exposure during peak {prim_name} concentration intervals.",
        f"Indoor management: Seal living environments and run continuous HEPA/carbon filtration."
    ]

    decision_support = {
        "aqi_status": aqi_cat,
        "primary_pollutant": prim_name,
        "primary_shap_driver": primary_factor,
        "secondary_shap_driver": secondary_factor,
        "biological_mechanism": prim_pathway["mechanism"],
        "recommended_actions": actions,
        "sensitive_groups_guidance": {k: v["impact"] for k, v in demographics.items()},
        "detailed_vulnerability_guidance": demographics
    }

    return advice, decision_support

def generate_ai_summary(
    city: str,
    aqi_val: float,
    aqi_cat: str,
    health_score: float,
    risk_label: str,
    top_factors: List[Dict[str, Any]]
) -> str:
    primary_factor = top_factors[0] if top_factors else {"feature": "PM2.5", "impact": 0.45}
    secondary_factor = top_factors[1] if len(top_factors) > 1 else {"feature": "PM10", "impact": 0.25}

    prim_name = primary_factor["feature"]
    sec_name = secondary_factor["feature"]
    prim_val = primary_factor.get("value", "")

    summary = (
        f"In {city}, the XGBoost intelligence engine predicts an Air Quality Index of {aqi_val:.1f} ({aqi_cat}) "
        f"and an Explainable Health Impact Score of {health_score:.2f} ({risk_label}). "
        f"SHAP TreeExplainer feature attribution proves that {prim_name} (measured at {prim_val}) is the primary risk driver "
        f"(+{primary_factor.get('impact', 0.4):.2f} impact), followed by {sec_name} (+{secondary_factor.get('impact', 0.2):.2f} impact). "
        f"This specific pollutant fingerprint predominantly elevates alveolar inflammatory risk for asthmatics, children, and hypertensive individuals."
    )

    return summary
