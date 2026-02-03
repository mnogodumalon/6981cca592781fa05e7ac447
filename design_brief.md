# Design Brief: Fitness Tagebuch

## 1. App Analysis

### What This App Does
Fitness Tagebuch is a comprehensive fitness tracking system that allows users to log their workouts (Trainingseinheiten), track body measurements over time (Körpermessungen), set and monitor fitness goals (Trainingsziele), and maintain an exercise library (Übungen). It's designed for people committed to their fitness journey who want to see tangible progress.

### Who Uses This
Health-conscious individuals who work out regularly and want to track their progress systematically. They care about seeing their improvement over time - whether that's weight loss, muscle gain, or increased endurance. They're motivated by data and visual progress indicators.

### The ONE Thing Users Care About Most
**Their weekly training activity** - specifically how many workouts they've completed this week compared to their goal. This is the immediate, actionable metric that drives daily motivation. Secondary to this is their body composition progress (weight trend).

### Primary Actions (IMPORTANT!)
1. **Training starten** → Primary Action Button - Users want to quickly log a new workout session
2. Messung erfassen - Log body measurements (weight, body fat, etc.)
3. Neues Ziel setzen - Create a new fitness goal

---

## 2. What Makes This Design Distinctive

### Visual Identity
A warm, energetic design that feels motivating without being aggressive. The cream-tinted background creates a welcoming, approachable feel, while the deep coral/terracotta accent color evokes warmth, energy, and vitality - perfect for a fitness app that wants to inspire action rather than intimidate. The overall aesthetic feels like a premium fitness boutique app, not a cold data tracker.

### Layout Strategy
The layout uses **asymmetric hierarchy** to create visual flow:
- **Hero element** (weekly workout count) dominates the top with a large circular progress ring - this is 2-3x larger than other elements
- **Secondary KPIs** (weight, streak, calories) are displayed in a compact horizontal row beneath - deliberately smaller to not compete
- **Weight trend chart** spans full width to give the data breathing room
- **Recent workouts list** uses a card-based approach with generous spacing

The asymmetry comes from the hero being visually dominant while supporting elements are intentionally understated.

### Unique Element
The **circular progress ring** around the weekly workout count creates a game-like, achievement-oriented feel. It uses a thick 8px stroke with rounded caps, and the progress fills with a subtle gradient from coral to a warmer orange. When completed (goal reached), a subtle pulse animation celebrates the achievement. This single element transforms a simple number into a motivating visual.

---

## 3. Theme & Colors

### Font
- **Family:** Outfit
- **URL:** `https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap`
- **Why this font:** Outfit has a friendly, rounded character that feels approachable and modern - perfect for a fitness app that wants to motivate rather than intimidate. It has excellent weight variety for creating hierarchy.

### Color Palette
All colors as complete hsl() functions:

| Purpose | Color | CSS Variable |
|---------|-------|--------------|
| Page background | `hsl(35 30% 97%)` | `--background` |
| Main text | `hsl(20 15% 15%)` | `--foreground` |
| Card background | `hsl(0 0% 100%)` | `--card` |
| Card text | `hsl(20 15% 15%)` | `--card-foreground` |
| Borders | `hsl(35 20% 90%)` | `--border` |
| Primary action | `hsl(12 76% 55%)` | `--primary` |
| Text on primary | `hsl(0 0% 100%)` | `--primary-foreground` |
| Accent highlight | `hsl(12 76% 95%)` | `--accent` |
| Muted background | `hsl(35 20% 94%)` | `--muted` |
| Muted text | `hsl(20 10% 45%)` | `--muted-foreground` |
| Success/positive | `hsl(152 60% 40%)` | (component use) |
| Error/negative | `hsl(0 72% 51%)` | `--destructive` |

### Why These Colors
The warm cream background (slight yellow undertone) creates an inviting, non-clinical feel. The coral/terracotta primary (`hsl(12 76% 55%)`) is energetic and motivating - it's the color of sunset, warmth, and vitality. Unlike aggressive reds or cold blues, it feels encouraging. The deep brown-tinted foreground text is warmer than pure black, maintaining the cozy aesthetic.

### Background Treatment
The background uses a subtle warm cream (`hsl(35 30% 97%)`) - not pure white. This creates depth and makes white cards pop slightly. The effect is similar to quality paper - warm and inviting.

---

## 4. Mobile Layout (Phone)

### Layout Approach
Mobile uses a **hero-dominant vertical flow**. The weekly workout progress ring takes ~40% of the initial viewport, making the most important metric impossible to miss. Below it, secondary metrics are compressed into a tight horizontal scroll to preserve vertical space. The design rewards scrolling with the weight chart and recent activities.

### What Users See (Top to Bottom)

**Header:**
- Left: "Fitness Tagebuch" title in semi-bold (600 weight)
- Right: Current date in muted text

**Hero Section (The FIRST thing users see):**
- Large circular progress ring (200px diameter)
- Inside the ring: Current week's workout count as large number (48px, bold)
- Below the number: "von X Trainings" showing goal (14px, muted)
- Below the ring: "Diese Woche" label (14px, muted)
- The ring fills clockwise with coral color based on completion percentage
- **Why this is the hero:** Weekly workout frequency is the #1 driver of fitness results. Users need immediate feedback on whether they're on track THIS week.

**Section 2: Quick Stats Row**
- Horizontal row of 3 compact stat pills/badges (not full cards)
- Stats: Current Weight (latest from Körpermessungen), Training Streak (consecutive days), Total Calories (this week)
- Each pill: icon + value + label stacked vertically
- Background: muted/accent color, no heavy borders
- This section is ~80px tall, kept compact intentionally

**Section 3: Weight Trend Chart**
- Title: "Gewichtsverlauf" (16px, semi-bold)
- Subtitle: "Letzte 30 Tage" (12px, muted)
- Area chart showing weight over time
- Height: ~180px
- Simplified for mobile: fewer Y-axis labels, touch-friendly data points
- Uses primary color with 20% opacity fill

**Section 4: Letzte Trainings**
- Title: "Letzte Trainings" (16px, semi-bold)
- List of 5 most recent workout sessions as cards
- Each card shows: Date/time, Duration, Intensity badge, Exercises count
- Cards have subtle shadow and rounded corners

**Bottom Navigation / Action:**
- Fixed bottom button bar with primary action button
- Button: "Training starten" - full width, coral background, white text
- Height: 56px, generous padding for thumb tap
- Subtle top shadow to separate from content

### Mobile-Specific Adaptations
- Progress ring is centered and given maximum prominence
- Quick stats use horizontal scroll if needed (though 3 should fit)
- Chart is simplified with larger touch targets
- Recent workouts show fewer details than desktop

### Touch Targets
- All interactive elements minimum 44px touch target
- Primary action button is 56px tall
- Card tap areas extend to full card width

### Interactive Elements
- Tapping a workout card could show full workout details (exercises performed, notes)
- Progress ring tap could show weekly breakdown by day

---

## 5. Desktop Layout

### Overall Structure
**Two-column layout with 2:1 ratio** (main content : sidebar)

Left column (66%): Hero progress + Weight chart + Workout history
Right column (33%): Quick stats stacked + Active goals

The eye flows: Hero ring (top-left) → Quick stats (right) → Chart (left, below hero) → Recent activity

### Section Layout

**Top Area:**
- Left: Hero progress ring (slightly smaller than mobile, 160px) with weekly workout count
- Right: Stacked quick stat cards (Weight, Streak, Calories burned this week) - 3 cards vertical

**Main Content Area (Left):**
- Weight trend chart - full width of left column, 280px height
- More detailed with hover states showing exact values
- Below chart: "Letzte Trainings" section as a styled table/list

**Supporting Area (Right sidebar):**
- Active goals section showing current Trainingsziele
- Each goal as a compact card with progress indicator
- Goal status badges (In Arbeit, Erreicht, etc.)

**Header (Full Width):**
- Left: "Fitness Tagebuch" title
- Center: Current date
- Right: "Training starten" button (primary style)

### What Appears on Hover
- Chart data points show tooltip with exact weight and date
- Workout rows highlight and show "Details ansehen" action
- Goal cards show progress percentage

### Clickable/Interactive Areas
- Workout rows expandable to show exercises performed
- Goals clickable to see full goal details and history

---

## 6. Components

### Hero KPI
The MOST important metric that users see first.

- **Title:** Trainings diese Woche
- **Data source:** trainingseinheiten app
- **Calculation:** Count of records where trainingsdatum is within current week (Monday-Sunday)
- **Display:** Large number (48px mobile, 40px desktop) inside a circular progress ring. The ring shows percentage toward weekly goal (default goal: 4 workouts/week if no explicit goal set).
- **Context shown:** "von X Trainings" below the number, showing the target. Ring fills proportionally.
- **Why this is the hero:** Workout frequency is the #1 predictor of fitness success. Showing it prominently with progress visualization creates accountability and motivation.

### Secondary KPIs

**Aktuelles Gewicht**
- Source: koerpermessungen
- Calculation: Latest record's gewicht value, sorted by messdatum descending
- Format: number with 1 decimal + " kg"
- Display: Compact stat pill on mobile, card on desktop

**Training Streak**
- Source: trainingseinheiten
- Calculation: Count consecutive days with at least one workout, ending today or yesterday
- Format: number + " Tage"
- Display: Compact stat pill on mobile, card on desktop

**Kalorien diese Woche**
- Source: trainingseinheiten
- Calculation: Sum of kalorien field for current week
- Format: number + " kcal"
- Display: Compact stat pill on mobile, card on desktop

### Chart

- **Type:** Area chart - because we want to show trend over time, and area charts feel more substantial/motivating than simple lines. The filled area creates visual weight that emphasizes progress.
- **Title:** Gewichtsverlauf
- **What question it answers:** "Am I making progress toward my weight goal?" Users need to see the trend, not just today's number.
- **Data source:** koerpermessungen app
- **X-axis:** messdatum (Date), label: hidden (dates shown on axis)
- **Y-axis:** gewicht (Weight in kg), label: "kg"
- **Mobile simplification:** Fewer axis labels, larger dots for touch, 180px height
- **Colors:** Primary coral color for line, primary with 20% opacity for fill

### Lists/Tables

**Letzte Trainings**
- Purpose: Show recent workout history so users can track their activity and recall what they did
- Source: trainingseinheiten
- Fields shown: trainingsdatum (formatted as "DD. MMM, HH:MM"), trainingsdauer + "min", intensitaet badge, count of ausgefuehrte_uebungen
- Mobile style: Cards with stacked info
- Desktop style: Table-like rows with columns
- Sort: trainingsdatum descending
- Limit: 5 items

**Aktive Ziele (Desktop sidebar only)**
- Purpose: Keep goals visible for motivation
- Source: trainingsziele
- Filter: aktueller_status = "in_arbeit" OR "nicht_begonnen"
- Fields shown: zielbezeichnung, zielkategorie badge, zieldatum
- Style: Compact cards
- Sort: zieldatum ascending
- Limit: 3 items

### Primary Action Button (REQUIRED!)

- **Label:** "Training starten"
- **Action:** add_record
- **Target app:** trainingseinheiten (6981cc906bdf8cfb3e2d5422)
- **What data:** Form with fields: trainingsdatum (auto-filled with current datetime), trainingsdauer, intensitaet (select), kalorien, ausgefuehrte_uebungen (multi-select from Übungen app), stimmung (select), notizen_training
- **Mobile position:** bottom_fixed - always accessible with thumb
- **Desktop position:** header - top right corner, prominent but not intrusive
- **Why this action:** Logging a workout is THE most frequent action. Users open the app when they're about to train or just finished. Making this one-tap accessible removes friction and increases logging compliance.

---

## 7. Visual Details

### Border Radius
rounded (8px) - friendly and modern without being too playful

### Shadows
subtle - Cards use `0 1px 3px rgba(0,0,0,0.08)` for gentle lift. No heavy drop shadows.

### Spacing
spacious - generous padding (20px mobile, 24px desktop inside cards), comfortable gaps between sections (24px mobile, 32px desktop)

### Animations
- **Page load:** stagger fade-in, hero first, then stats, then chart, then list
- **Hover effects:** Cards lift slightly with increased shadow, rows highlight with accent background
- **Tap feedback:** Scale down to 0.98 on press, back to 1 on release
- **Progress ring:** Animates filling on load (0.8s ease-out)

---

## 8. CSS Variables (Copy Exactly!)

The implementer MUST copy these values exactly into `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --background: hsl(35 30% 97%);
  --foreground: hsl(20 15% 15%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(20 15% 15%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(20 15% 15%);
  --primary: hsl(12 76% 55%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(35 20% 94%);
  --secondary-foreground: hsl(20 15% 15%);
  --muted: hsl(35 20% 94%);
  --muted-foreground: hsl(20 10% 45%);
  --accent: hsl(12 76% 95%);
  --accent-foreground: hsl(12 76% 35%);
  --destructive: hsl(0 72% 51%);
  --border: hsl(35 20% 90%);
  --input: hsl(35 20% 90%);
  --ring: hsl(12 76% 55%);
  --radius: 0.5rem;

  --success: hsl(152 60% 40%);
}

body {
  font-family: 'Outfit', sans-serif;
}
```

---

## 9. Implementation Checklist

The implementer should verify:
- [ ] Font loaded from URL above (Outfit)
- [ ] All CSS variables copied exactly
- [ ] Mobile layout matches Section 4 (hero ring dominant, bottom fixed button)
- [ ] Desktop layout matches Section 5 (2:1 column ratio, header button)
- [ ] Hero element (progress ring) is prominent as described
- [ ] Colors create warm, motivating mood described in Section 2
- [ ] Progress ring animates on load
- [ ] Primary action button positioned correctly for each breakpoint
- [ ] Chart uses area style with coral color
- [ ] Recent workouts show as cards on mobile, table-like on desktop
