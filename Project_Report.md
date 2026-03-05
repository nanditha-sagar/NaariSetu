# NaariSetu: Technical & Functional Project Report

## 1. Project Overview

**NaariSetu** is a specialized health ecosystem designed to empower women through AI-driven screening and continuous health monitoring. It serves as a bridge between personal wellness tracking and clinical awareness, focusing on conditions that disproportionately affect women.

---

## 2. Comprehensive Feature Ecosystem

### A. AI-Powered Screening (The "Core Engine")

The screening module is the entry point for users, designed to provide instant risk assessments.

- **Dynamic Assessment (3-Step Flow)**:
  - **Step 1: Bio-Data**: Captures Age, Blood Group, Height, Weight, and Relationship status.
  - **Step 2: Medical Context**: Deep dive into existing conditions, Vitamin deficiencies, and current symptoms.
  - **Step 3: Menstrual Health**: Detailed analysis of cycle regularity, last period date, and symptoms like cravings/mood swings.
- **Nail-Analysis Scan**: A specialized guided camera interface for capturing nail health, assisting in identifying nutritional gaps like Iron deficiency.
- **Scoring Algorithm**:
  - **Weighted Questionnaires**: Sections like "Fatigue & Energy" are scored based on clinical severity.
  - **Pattern Recognition**: The algorithm cross-references patterns (e.g., Heavy Flow + Fatigue = Anemia Risk) to suggest conditions.
  - **Triage Logic**: Categorizes results into Low/Medium/High risk with a corresponding "Confidence Score."

### B. Specialized Health Trackers

| Tracker            | Metrics Logged                                     | Insights & Triage                                                            |
| :----------------- | :------------------------------------------------- | :--------------------------------------------------------------------------- |
| **Blood Pressure** | Systolic, Diastolic, Pulse, Arm/Position.          | Heart health category (AHA standards), Hypertensive crisis alerts.           |
| **Glucose**        | Value (mg/dL), Timing (Fasting/Post-meal), Source. | Prediabetes/Diabetes range identification, PCOS/Pregnancy risk alerts.       |
| **Anemia**         | Energy levels, Pallor, Breathlessness, Cycle flow. | Daily risk score, Red-flag detection, Hemoglobin trend analysis.             |
| **Period Tracker** | Start/End dates, Flow, PMS symptoms.               | Cycle phase prediction (Follicular/Ovulation/Luteal), Next period countdown. |
| **Mood & Mental**  | Valence, Sleep, Anxiety, Irritability.             | Triage zones (Green to Red), Correlation with sleep and cycle phases.        |
| **Skin Health**    | Itching, Heat, Texture, Spot changes.              | Infection/Flare-up detection, Dietary trigger correlation.                   |

### C. Knowledge & Engagement

- **Educational Hub**: A multimedia gallery of articles and videos (PCOS, Breast Cancer awareness, Nutrition).
- **Daily Health Snapshot**: An aggregated view on the home screen showing the latest screening result and today's tracking status.
- **Personalized Health Tips**: Context-aware suggestions (e.g., "Increase Vitamin C for iron absorption") based on user data.

---

## 3. Technical Architecture

### A. The Modern Stack

- **Framework**: **React Native via Expo** (SDK 54) for native performance across platforms.
- **Routing**: **Expo Router (v6)** for clean, file-based navigation (Tab-based for main hub, Stack-based for trackers).
- **Design System**: **NativeWind (Tailwind CSS)** for a polished, premium aesthetic with consistent tokens.
- **Backend Service Layer**: **Firebase SDK (v12)**:
  - **Authentication**: Email/Password and Persistent Sessions.
  - **Firestore**: Scalable NoSQL database for real-time synchronization.

### B. Scalable Data Persistence (Firestore Schema)

- **`profiles`**: User-specific health metadata (DOB, height, weight).
- **`screenings`**: Records of AI assessments, including scores and image references.
- **`daily_logs`**: Time-series data for quick mood/energy check-ins.
- **`bloodPressure` / `glucose` / `anemia`**: Dedicated collections for high-integrity vital logs with clinical context.

### C. Safety & Triage Architecture

The app implements a **Multi-Level Triage System**:

- **Green Zone**: Optimal health; focus on maintenance.
- **Amber/Yellow Zone**: Requires monitoring or lifestyle adjustments.
- **Red Zone**: Indicates potential medical urgency; provides clear clinical recommendations and "See a Doctor" alerts.

---

## 4. User Journey & Experience

1. **Onboarding**: Simple secure login with immediate redirect to profile setup.
2. **Assessment**: Complete the 3-step screening to establish a health baseline.
3. **Daily Management**: Log vitals through specialized trackers and receive real-time triage feedback.
4. **Learning**: Engage with the Educational Hub to understand symptoms and preventative care.

---

## 5. Vision for Scalability

NaariSetu is built to expand into:

- **Wearable Integration**: Direct sync with Apple Health or Google Fit for automated vitals.
- **Tele-Consultation**: Connecting "Red Zone" users directly with specialists.
- **Community Hub**: A safe space for women to discuss health journeys anonymously.

---

_Created on: 2026-03-04_
_Author: NaariSetu Technical Documentation Team_
