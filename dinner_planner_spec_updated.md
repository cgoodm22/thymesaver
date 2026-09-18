# Product Requirement Document (PRD): Thyme Saver – Weekly Dinner Planner & Smart Grocery Generator

## 1. Executive Summary & Vision
**Product Name:** Thyme Saver  
**Target Audience:** Exhausted parents, busy professionals, students, and time-strapped households.  
**Core Value Proposition:** Thyme Saver eliminates weeknight decision fatigue and post-work burnout. By matching daily schedule busyness, household energy levels, and strict dietary guardrails, Thyme Saver generates an effortless 7-day meal plan, links directly to step-by-step cooking recipes, and produces a consolidated, aisle-grouped, pantry-checked grocery list in minutes.

---

## 2. Core Features & Feedback Refinements

### Feature 1: Household & Strict Dietary Profile Engine
* **Strict Allergen & Dietary Filters:** Toggles for Gluten-Free, Dairy-Free, Vegetarian, Vegan, Nut-Free, Low-Carb, and Picky Eater / Kid-Friendly.
  * **Strict Exclusion Rule:** If a restriction (e.g., Gluten-Free or Vegetarian) is selected, the meal recommendation engine MUST strictly filter out meals containing violating ingredients.
  * **Dietary-Aware Pantry Check:** Default pantry check suggestions must adapt to diet profiles (e.g., do NOT offer chicken broth or bacon as staple suggestions for Vegetarian/Vegan profiles).
* **Household Scale Factor:** Adjust adult and child portions to auto-scale grocery ingredient quantities.

### Feature 2: Robust Meal & Favorites Library (100+ Meals + Custom Recipe Import)
* **Expanded Recipe Database:** A diverse, built-in database of **100+ recipes** categorized across prep times, cleanup levels, and dietary flags to completely eliminate meal repetition.
* **External Recipe Links:** Every built-in or added meal includes a verified or user-provided `sourceUrl` link on the title, allowing users to tap open step-by-step preparation instructions.
* **Custom Recipe Import Engine (Link or Manual Entry):**
  * **Paste a Link (URL):** Users can paste a web URL from Pinterest, TikTok, or NYT Cooking, enter a title, set prep time, check dietary flags, and list ingredients.
  * **Manual Quick Entry:** For unwritten or family recipes without a web link.
  * **Local Persistence:** Custom recipes are saved to local storage, tagged with `isCustom: true`, and automatically added to the active meal generator pool.
* **Favorites System:**
  * Tap a heart icon to "Favorite" any recipe.
  * Dedicated **Favorites Library** view.
  * Ability to swap any day's planned meal with a recipe from the user's Favorites or Custom Recipe collection.

### Feature 3: Adaptive Schedule & Vibe Allocation
* **Expanded Leftover Night Limits:** Configure up to **3 Leftover / Batch-Cook Days** per week (e.g., Cook double on Sunday $\rightarrow$ Leftover Monday & Wednesday).
* **Strict Day-Specific Logic:**
  * **Friday "Pantry Rescue":** Specialized flex meals (e.g., Friday Night Rescue Pizza, Stir-Fry, Frittata) are strictly restricted to Friday (or Saturday) and cannot be assigned to mid-week slots like Tuesday.
* **Cleanup & Time Filters:**
  * *Quick (15–20 mins):* One-pot, sheet-pan, air fryer, or instant pot meals.
  * *Moderate (30 mins):* Standard weeknight cooking.
  * *Relaxed (45+ mins):* Weekend or batch-prep days.
* **Single-Day Shuffle:** Re-roll individual meals without resetting the rest of the weekly plan.

### Feature 4: Smart Grocery Aggregator & Pantry Check
* **Exact Quantity Consolidation:**
  * Ingredients across all meals must be math-aggregated and unit-consolidated (e.g., combine `1 bunch cilantro` + `1 bunch cilantro` into `2 bunches cilantro`, or `0.5 lb` + `1 lb` into `1.5 lbs beef`). No redundant string listings like `1 bunch + 1 bunch`.
* **Pre-Shop Pantry Strikethrough:** Filter out staple items (olive oil, spices, garlic) before building the store list.
* **Aisle-Grouped Organization:** Items sorted into store departments (*Produce, Dairy/Refrigerated, Meat/Seafood, Pantry, Frozen*).

---

## 3. Data Schemas

```json
{
  "userProfile": {
    "householdSize": { "adults": 2, "kids": 2 },
    "dietaryRestrictions": ["Gluten-Free", "Vegetarian"],
    "isPickyEaterFriendly": true,
    "maxLeftoverDays": 3,
    "favoriteMealIds": ["meal_102", "meal_205", "custom_001"]
  },
  "meal": {
    "id": "custom_001",
    "title": "Grandma's Garlic & Veggie Pasta",
    "sourceUrl": "https://www.example.com/grandmas-veggie-pasta",
    "isCustom": true,
    "prepTimeMinutes": 20,
    "cleanupLevel": "Minimum Dishes",
    "dietaryFlags": ["Vegetarian", "Kid-Friendly"],
    "isBatchCookable": true,
    "isFridayRescueOnly": false,
    "ingredients": [
      { "name": "Gluten-Free Penne", "quantity": 1, "unit": "box", "category": "Pantry" },
      { "name": "Bell peppers", "quantity": 2, "unit": "whole", "category": "Produce" },
      { "name": "Zucchini", "quantity": 2, "unit": "whole", "category": "Produce" },
      { "name": "Olive oil", "quantity": 2, "unit": "tbsp", "category": "Pantry", "isPantryStaple": true }
    ]
  },
  "daySchedule": {
    "day": "Friday",
    "timeBudget": "Quick (15-20m)",
    "cleanupPreference": "Minimum Dishes",
    "isLeftoverNight": false,
    "isPantryRescueNight": true,
    "assignedMealId": "meal_301"
  }
}
```

---

## 4. App Workflow (4-Step Flow)

1. **Step 1: Household & Schedule Setup**
   * Select dietary restrictions, household scale, and set up to 3 batch-cook/leftover days.
   * Rate daily busyness and mark Friday as Pantry Rescue night.
2. **Step 2: Interactive 7-Day Meal Plan**
   * View the tailored calendar.
   * Click meal titles to open recipe URL links.
   * Favorite recipes, add custom recipes via URL link or form, or swap out any day's meal using the "Shuffle" or "Pick from Favorites/Custom" modal.
3. **Step 3: Dietary-Aware Pantry Check**
   * Review pre-populated staples filtered to match dietary preferences (no meat/gluten staples if restricted).
   * Uncheck items already in stock.
4. **Step 4: Consolidated Shopping List**
   * View aisle-grouped ingredients with clean math aggregation (e.g., `2 heads garlic`, `1.5 lbs chicken breasts`).
   * Interactive checkboxes for in-store shopping.

---

## 5. Technical Implementation Roadmap

* **Framework:** React + Tailwind CSS (Single-Page Application).
* **State Management:** LocalStorage for user preferences, favorited meal IDs, custom imported meals, and generated weekly plans.
* **Recipe Library:** Massive 100+ recipe dataset array tagged strictly with dietary flags (`containsGluten`, `containsMeat`, `containsDairy`, `isFridayRescueOnly`, `isKidFriendly`).
* **Aggregation Logic:** Helper function that groups items by lowercase normalized name and unit type, summing numeric quantities.

---

## 6. Updated Prompt Instructions for Your Coding Agent

> Copy and paste this updated master prompt into Cursor, Bolt.new, v0.dev, or GitHub Copilot:

```text
Act as a Senior Full-Stack React Engineer. I want you to build/update the React + Tailwind CSS application "Thyme Saver" based on the PRD specification above.

Key requirements to implement:
1. MASSIVE RECIPE DATABASE (100+ MEALS):
   - Provide a large, varied library of 100+ distinct meals covering Vegetarian, Vegan, Gluten-Free, Dairy-Free, Nut-Free, Low-Carb, and Kid-Friendly options so meals never feel repetitive.
   - Include a valid 'sourceUrl' for EVERY meal so clicking the meal title opens the recipe link in a new tab.

2. CUSTOM RECIPE IMPORT (VIA LINK OR FORM):
   - Add an "Add Custom Recipe" feature allowing users to import meals by pasting a recipe URL + title, or entering details manually.
   - Store custom recipes in localStorage so they seamlessly join the user's meal pool, favorites list, and grocery aggregator.

3. STRICT DIETARY & ALLERGEN FILTERING:
   - When a user selects dietary filters (e.g., Gluten-Free or Vegetarian), STRICTLY filter out violating meals from allocation and random shuffles.
   - Adjust the Pantry Check staples list dynamically so Vegetarian/Vegan profiles never see meat or poultry items, and Gluten-Free profiles never see wheat-based staples.

4. UP TO 3 LEFTOVER DAYS & STRICT FRIDAY PANTRY RESCUE:
   - Allow users to select up to 3 Leftover/Batch-Cook nights per week in setup.
   - Meals tagged as 'isFridayRescueOnly' (e.g., Friday Night Rescue Pizza) must ONLY be eligible for assignment on Friday or Saturday.

5. FAVORITES SYSTEM:
   - Add a heart icon on meal cards to favorite/unfavorite recipes.
   - Add a "Favorites" tab/modal allowing users to view saved and custom meals and swap any daily scheduled meal with one of their favorites.

6. CONSOLIDATED GROCERY AGGREGATION:
   - Build a math aggregation helper for the grocery list that combines duplicate ingredients into a single line item with summed numeric quantities (e.g., combine two "1 bunch" entries into "2 bunches", not "1 bunch + 1 bunch"). Group by department (Produce, Dairy, Meat, Pantry, Frozen).
```
