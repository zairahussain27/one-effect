# Architecture Documentation — ONE EFFECT

## Overview

**ONE EFFECT** is a dynamic, research-based environmental contribution platform that measures real-world environmental contributions from everyday sustainable actions and models their collective impact.

```
+---------------------------------------------------------------------------------------+
|                                    ONE EFFECT UI                                      |
|                                                                                       |
|  +-------------------------+   +------------------------------+   +----------------+  |
|  |   Action Input Engine   |   |   Dynamic Impact Engine      |   |   Simulator    |  |
|  |  (Dynamic input schema) |-->| (Research factors & models)  |-->|  (Collective)  |  |
|  +-------------------------+   +--------------+---------------+   +----------------+  |
+-----------------------------------------------|---------------------------------------+
                                                v
                                 +------------------------------+
                                 |  Methodology & Citations     |
                                 |  (EPA WARM, DEFRA, eGRID)    |
                                 +------------------------------+
                                                |
                                                v
                                 +------------------------------+
                                 | Personal & Community Ledger  |
                                 | (Multi-dimensional metrics) |
                                 +------------------------------+
```

## Key Architectural Principles

1. **Dynamic, Unit-Accurate Measurement Models**:
   - Every action has its own distinct physical measurement model.
   - Eliminates generic abstractions like "1 action = 1 point" or "every action = trees planted".
   - Actions accept verified quantities with real-world units (e.g. kg of PET plastic, km cycled, liters conserved, trees planted).

2. **Multi-Dimensional Environmental Effects**:
   - Each action computes direct contributions and primary/secondary environmental effects:
     - Waste diverted from landfills (kg)
     - Water conserved (L)
     - Clean energy saved (kWh)
     - Avoided greenhouse gas emissions (kg CO₂e)
     - Active / low-carbon travel shifted (km)
     - Native reforestation (trees)

3. **Research-Backed Factors & Citations**:
   - Transparent, peer-reviewed conversion factors derived from EPA WARM v15, UK DEFRA 2023, EPA eGRID 2023, and IPCC Sixth Assessment Report.
   - Every result provides a Methodology Drawer with mathematical formulas, reference citations, and honest uncertainty caveats.

4. **Fault-Tolerant AI & Fallback Strategy**:
   - The UI communicates through an abstraction layer (`services/aiService.ts` & `services/api.ts`).
   - If AWS Bedrock Claude 3 Vision or API Gateway encounters network latency or errors, intelligent local fallback rules verify and classify actions smoothly.

5. **Community Aggregation & Privacy**:
   - Collective community impacts aggregate physical metrics safely by area.
   - Individual user data and specific locations remain private while demonstrating collective momentum.

