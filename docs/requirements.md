# PIGADE-X: Detailed Requirements & Success Metrics

This document outlines the detailed requirements and success metrics for the PIGADE-X project.

## 1. CME/ICME Types for Detection

The system will be designed to detect the following types of solar events and structures as they pass the Aditya-L1 spacecraft at the L1 point:

-   **Full Halo CMEs:** 
-   **Partial Halo CMEs:** 
-   **Magnetic Clouds (MCs):** 
-   **Sheath Regions:** 
-   **Interplanetary Shocks:** 

## 2. Performance Metrics

### 2.1. Detection Latency

-   **Target:** Less than 15 minutes from the time the core features of an event are observed in the SWIS-ASPEX data stream to the alert being issued.
-   **Acceptable:** 15-30 minutes.

### 2.2. Accuracy Metrics

The following metrics will be used to evaluate the model's performance on a curated test set of known events.

-   **Precision:** TBD
-   **Recall:** TBD
-   **F1-Score:** TBD
-   **False Positive Rate:** TBD
-   **Boundary Identification Accuracy:** (e.g., accuracy in identifying shock arrival time, start and end of sheath/MC) - TBD

## 3. Input Parameters from SWIS-ASPEX

The model will primarily use the following Level 2 data products. The exact features will be refined during the feature engineering phase.

### 3.1. SWIS (Solar Wind Ion Spectrometer)

-   **Parameter:** Proton Density (n_p)
-   **Parameter:** Alpha Particle Density (n_alpha)
-   **Parameter:** Proton Bulk Velocity (V_p)
-   **Parameter:** Proton Temperature (T_p)
-   **Parameter:** Alpha-to-Proton Ratio (n_alpha / n_p)
-   **Parameter:** Directional Fluxes

### 3.2. STEPS (Supra Thermal & Energetic Particle Spectrometer)

-   **Parameter:** Energetic Particle Counts (in various energy channels)
-   **Parameter:** Directional energetic particle data

## 4. Collaboration Protocols

-   **Data Access:** Protocols for accessing Aditya-L1 Level 2 data from ISRO/PRL data centers.
-   **Validation:** Process for validating detected events with subject matter experts and cross-referencing with other mission data (e.g., ACE, WIND).
