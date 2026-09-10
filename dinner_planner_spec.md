# Product Requirement Document (PRD): Thyme Saver – Weekly Dinner Planner & Smart Grocery Generator

## 1. Executive Summary & Vision
**Product Name:** Thyme Saver  
**Target Audience:** Exhausted parents, busy professionals, students, and time-strapped households.  
**Core Value Proposition:** Thyme Saver eliminates weeknight decision fatigue and post-work burnout. By matching daily schedule busyness, household energy levels, and dietary guardrails, Thyme Saver generates an effortless 7-day meal plan and an aisle-grouped, pantry-checked grocery list in minutes.

---

## 2. Core Features & Effort Reducers

### Feature 1: Household & Dietary Profile
* **Dietary Restrictions & Guardrails:** Toggles for Gluten-Free, Dairy-Free, Vegetarian, Vegan, Nut Allergies, Low-Carb, and Picky Eater / Kid-Friendly.
* **Household Scale Factor:** Adjust adult and child portions to auto-scale grocery ingredient quantities.

### Feature 2: Smart Recipe Engine
* **Custom Recipe Import:** Upload meals via JSON/CSV or manual form (Title, Ingredients + Units, Prep Time, Cleanup Rating, Category).
* **AI/Web Recipe Finder:** Dynamic suggestions based on constraints (e.g., *"15-minute gluten-free comfort food"*).

### Feature 3: Schedule & Vibe-Based Meal Allocation
* **Daily Time & Energy Budgeting:**
  * *Ultra-Busy / Low Energy (15–20 mins)* $\rightarrow$ One-pot, sheet-pan, air fryer, or instant pot meals.
  * *Moderate (30 mins)* $\rightarrow$ Standard weeknight cooking.
  * *Relaxed (45+ mins)* $\rightarrow$ Weekend cooking or batch-prep days.
* **Cleanup Level Filter:** Option to prioritize "Minimum Dishes" for high-stress days.
* **"Cook Once, Eat Twice" (Batch Cooking):** Tag a high-availability day to cook a double batch, automatically designating another day as "Leftover Night."
* **Friday "Pantry Rescue":** Dedicated flexible meal option (e.g., frittata, stir-fry, pizza) to clear out remaining ingredients before the week ends.
* **Single-Day Shuffle:** One-tap swap for individual meals without resetting the entire week's plan.

### Feature 4: Smart Grocery List with Pantry Check
* **Pre-Shop Pantry Check:** Quick checklist of common staples (olive oil, spices, butter, garlic) to eliminate items already in stock before building the store list.
* **Aisle-Grouped Aggregation:** Merges duplicate ingredients across all meals and organizes items by store department (*Produce, Dairy/Refrigerated, Meat/Seafood, Pantry, Frozen*).
* **Interactive Shopping Checklist:** Tap-to-complete view for in-store navigation.

---

## 3. Data Schemas

```json
{
  "userProfile": {
    "householdSize": { "adults": 2, "kids": 2 },
    "dietaryRestrictions": ["Gluten-Free"],
    "isPickyEaterFriendly": true,
    "weeklyMood": "Comfort Food"
  },
  "meal": {
    "id": "meal_201",
    "title": "Sheet-Pan Garlic Herb Chicken & Vegetables",
    "prepTimeMinutes": 20,
    "cleanupLevel": "Minimum Dishes",
    "tags": ["Sheet-Pan", "Gluten-Free", "Kid-Friendly"],
    "isBatchCookable": true,
    "ingredients": [
      { "name": "Chicken breasts", "quantity": 1.5, "unit": "lbs", "category": "Meat/Seafood" },
      { "name": "Broccoli florets", "quantity": 2, "unit": "heads", "category": "Produce" },
      { "name": "Baby potatoes", "quantity": 1, "unit": "bag", "category": "Produce" },
      { "name": "Olive oil", "quantity": 2, "unit": "tbsp", "category": "Pantry", "isPantryStaple": true }
    ]
  },
  "daySchedule": {
    "day": "Monday",
    "timeBudget": "Quick (15-20m)",
    "cleanupPreference": "Minimum Dishes",
    "isLeftoverNight": false,
    "assignedMealId": "meal_201"
  }
}
```

---

## 4. App Workflow (3-Step Flow)

1. **Step 1: Setup Profile & Weekly Constraints**
   * Select dietary needs, household count, and weekly vibe/mood.
   * Rate daily busyness (Monday–Sunday) and flag potential batch-cook or leftover days.
2. **Step 2: Review & Customize Meal Plan**
   * View the 7-day adaptive calendar.
   * Shuffle single meals, lock in leftover nights, or swap in custom recipes.
3. **Step 3: Pantry Check & Final Shopping List**
   * Screen 1: Uncheck household staples you already have in the pantry.
   * Screen 2: Access the aisle-organized, interactive grocery list for store shopping.

---

## 5. Technical Implementation Roadmap

* **Framework:** React (Vite) + Tailwind CSS (Single Page Web Application).
* **State Management:** LocalStorage for user preferences, custom recipes, and active meal plans.
* **Recipe Database:** Pre-populated array of 15–20 initial recipes tagged by time, cleanup level, and dietary flags.

---

## 6. Prompt Instructions for Your Coding Agent

> Copy and paste the prompt below into Cursor, Claude Code, ChatGPT, or your AI IDE:

```text
Act as a Senior Full-Stack Engineer. I want you to help me build a prototype React + Tailwind CSS web app named "Thyme Saver" based on the PRD specification above.

Please build the prototype in these incremental steps:
1. Setup a clean, mobile-responsive layout with step-by-step navigation (Setup -> Meal Plan -> Pantry Check -> Grocery List).
2. Create a Mock Recipe Database with 15-20 meals tagged by prep time, cleanup level (e.g. One-Pot), dietary flags, and batch-cooking capability.
3. Build the setup screen where users configure household size, dietary restrictions, kid-friendly toggles, daily busyness ratings (Quick/Medium/Relaxed), and batch-cook/leftover days.
4. Implement the allocation algorithm that matches meals to days based on prep time, cleanup preferences, and leftover logic, plus a single-meal "Shuffle" button.
5. Create a "Pantry Check" modal screen that lets users strike off basic staples before building the grocery list.
6. Build the Grocery List component that aggregates ingredient quantities and groups them into aisle categories (Produce, Dairy, Meat, Pantry, Frozen) with interactive checkboxes.
```
