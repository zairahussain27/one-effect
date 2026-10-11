# Impact Calculation Methodology — ONE EFFECT

> **Disclaimer**: All impact metrics in this prototype are illustrative estimates designed for demonstration during the Environmental Hacks hackathon. They demonstrate the power of collective multiplying effects rather than verified peer-reviewed scientific claims.

---

## Mathematical Formulation

### 1. Number of Periods
Let $d$ be duration in months and $f$ be frequency:
- **Once**: $T = 1$
- **Weekly**: $T = \text{round}\left(\frac{d \times 52}{12}\right)$
- **Monthly**: $T = d$
- **Daily**: $T = \text{round}\left(\frac{d \times 365}{12}\right)$

### 2. Collective Action Count
$$\text{Total Actions} = N_{\text{people}} \times T$$

### 3. Metric Quantification
For each environmental category metric with factor $F_m$:
$$\text{Impact Value} = \text{Total Actions} \times F_m$$

---

## Illustrative Factors Reference

| Action Category | Metric Name | Unit | Illustrative Factor ($F_m$) | Context |
| :--- | :--- | :--- | :--- | :--- |
| **PET Bottle Recycling** | Material Diverted | kg | `0.0238` | Average 500ml PET bottle weight |
| | CO₂e Saved | kg | `0.0650` | Avoided virgin plastic production |
| | Resource Units Saved | units | `0.0167` | Crude oil & feedstock savings |
| **Water Conservation** | Water Saved | Litres | `1.0000` | 1 minute reduced tap flow |
| | Showers Worth of Water | showers | `0.0125` | ~80L standard shower equivalent |
| | Pumping Energy Saved | Wh | `0.8000` | Municipal water pumping energy |
| **Electricity Conservation** | Energy Saved | kWh | `0.0500` | Idle appliance standby load |
| | CO₂ Avoided | kg | `0.0380` | Grid carbon intensity average |
| | Home-Days Powered | days | `0.0017` | ~30 kWh/day household benchmark |
| **Low-Carbon Transport** | CO₂ Avoided | kg | `0.2100` | 1 km combustion car trip substituted |
| | Car Kilometres Saved | km | `2.0000` | Short trip distance |
| | Fuel Conserved | Litres | `0.1600` | Internal combustion fuel savings |
| **Green Space Protection** | Green Space Cared For | m² | `0.5000` | Single garden patch / tree bed |
| | Soil Carbon Stored | g | `15.0000` | Root zone organic matter |
| | Pollinators Supported | index | `0.0100` | Native flora habitat index |
