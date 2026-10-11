# ONE EFFECT — 3-Minute Hackathon Demo Script

This script outlines the exact sequence for presenting and recording the ONE EFFECT demonstration.

---

### [0:00 – 0:15] Introduction & The Problem
- **Visual**: Landing page hero section with drifting clouds and floating organic ripples.
- **Narrator**: *"Every day, millions of people make small environmental choices: recycling a plastic bottle, turning off a running tap, or biking instead of driving. But because individual actions feel small, people often feel their choices are insignificant. This is **ONE EFFECT**."*

---

### [0:15 – 0:35] Instant Upload & AI Identification
- **Action**: Click **"See Your Impact →"** or scroll to the **Identify** section.
- **Action**: Drag and drop a photo of a plastic bottle (or click "try a sample item").
- **Visual**: The uploaded photo appears **immediately** on the screen. The scanning bar pulses with live progress: *"Identifying material & structure... Estimating environmental category..."*
- **Visual**: AI card appears:
  - **Identified Item**: `PET BOTTLE`
  - **Confidence**: `94%`
  - **Recommended Action**: `Recycle in dedicated plastic bin`
- **Narrator**: *"When a user uploads a photo, our system previews it instantly in the browser while Amazon Bedrock classifies the item and detects the high-impact action."*

---

### [0:35 – 0:50] Individual Action Impact
- **Action**: Click **"Calculate My Impact →"**.
- **Visual**: Smoothly scrolls to the **Your Action** card showing the user's photo, the identified action, and the bold badge: `1 INDIVIDUAL ACTION`.
- **Narrator**: *"It starts with just one action. But what happens when that action multiplies?"*

---

### [0:50 – 1:40] The Collective "What If?" Simulator
- **Action**: Click **"What If Everyone? →"**.
- **Action**: Adjust simulator controls:
  - **People**: `10,000` (click preset button or drag range slider)
  - **Frequency**: `Weekly`
  - **Duration**: `1 year`
- **Visual**: Real-time animated counter calculates:
  - $10,000 \times 1 \text{ action/week} \times 52 \text{ weeks} = \mathbf{520,000 \text{ collective actions}}$
- **Visual**: Below the simulator, the SVG nature landscape flourishes:
  - Sprouting from a single seed into a **Thriving Ecosystem** filled with lush swaying trees and radiant sunshine.
  - Metrics update dynamically:
    - **Material Diverted**: `12,376 kg`
    - **CO₂ Equivalent Saved**: `33,800 kg`
- **Narrator**: *"Watch the math come to life: 10,000 people, just once a week for one year, diverts over 12 tons of plastic from landfills."*

---

### [1:40 – 2:15] Dynamic Scaling & Community Stages
- **Action**: Increase the people slider or toggle duration to `5 years`.
- **Visual**: All numbers dynamically animate upwards.
- **Visual**: Scroll to **Community Effect** section showing the multi-stage progression: `Seed → Plant → Patch → Garden → Forest`.
- **Narrator**: *"As participation scales, the collective impact compounds exponentially."*

---

### [2:15 – 2:45] Technical Architecture & AWS Resilience
- **Visual**: Highlight the architecture:
  - **Frontend**: Vite, React 18, Framer Motion, Vanilla CSS design tokens.
  - **Cloud Backend**: AWS API Gateway, Node.js Lambda, Amazon S3 (image storage), Amazon Bedrock (Claude 3 Vision).
  - **Resilience Layer**: Dual-tier fallback ensures zero downtime or broken states even without network access.
- **Narrator**: *"Our architecture is lightweight, serverless, and resilient. If cloud connectivity is disrupted, local fallback intelligence seamlessly takes over."*

---

### [2:45 – 3:00] Conclusion
- **Visual**: Final CTA section.
- **Narrator**: *"ONE EFFECT doesn't ask people to change the world alone. It shows what happens when one small action becomes collective. **ONE ACTION. MANY PEOPLE. ONE EFFECT.**"*
