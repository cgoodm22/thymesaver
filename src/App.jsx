import { useMemo, useState } from 'react'
import './App.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DIETARY_OPTIONS = ['Gluten-free', 'Dairy-free', 'Vegetarian', 'Vegan', 'Nut-free', 'Low-carb', 'Kid-friendly']
const AISLES = ['Produce', 'Dairy', 'Meat', 'Pantry', 'Frozen']
const PANTRY_STAPLES = [
  { name: 'Olive oil', quantity: 1, unit: 'bottle', category: 'Pantry', staple: true },
  { name: 'Salt', quantity: 1, unit: 'container', category: 'Pantry', staple: true },
  { name: 'Black pepper', quantity: 1, unit: 'container', category: 'Pantry', staple: true },
  { name: 'Garlic', quantity: 1, unit: 'bulb', category: 'Produce', staple: true },
  { name: 'Dried herbs', quantity: 1, unit: 'jar', category: 'Pantry', staple: true },
  { name: 'Butter', quantity: 1, unit: 'pack', category: 'Dairy', staple: true, dairy: true },
  { name: 'Chicken broth', quantity: 1, unit: 'carton', category: 'Pantry', staple: true, meat: true },
]

const SEEDS = [
  ['Lemony sheet-pan chicken', 25, ['Gluten-free', 'Kid-friendly'], 'Meat', 'Chicken thighs', 'Broccoli'],
  ['Creamy tomato skillet pasta', 30, ['Vegetarian'], 'Dairy', 'Pasta', 'Parmesan'],
  ['Build-your-own taco night', 20, ['Kid-friendly'], 'Meat', 'Ground turkey', 'Tortillas'],
  ['Coconut chickpea curry', 35, ['Vegetarian', 'Vegan', 'Gluten-free', 'Kid-friendly'], 'Pantry', 'Chickpeas', 'Bell peppers'],
  ['Maple salmon rice bowls', 35, ['Gluten-free', 'Dairy-free'], 'Meat', 'Salmon', 'Cucumber'],
  ['Friday pantry rescue pizza', 20, ['Kid-friendly'], 'Dairy', 'Pizza dough', 'Mozzarella', true],
  ['Crispy gnocchi with greens', 25, ['Vegetarian'], 'Dairy', 'Gnocchi', 'Kale'],
  ['Black bean sweet potato bowls', 30, ['Vegetarian', 'Vegan', 'Gluten-free', 'Kid-friendly'], 'Produce', 'Sweet potatoes', 'Black beans'],
  ['Turkey meatball pitas', 35, ['Kid-friendly'], 'Meat', 'Ground turkey', 'Pitas'],
  ['Ginger tofu stir-fry', 20, ['Vegetarian', 'Vegan', 'Dairy-free', 'Kid-friendly'], 'Produce', 'Tofu', 'Snap peas'],
  ['Sheet-pan sausage and peppers', 30, ['Gluten-free'], 'Meat', 'Chicken sausage', 'Bell peppers'],
  ['Creamy pesto gnocchi', 25, ['Vegetarian'], 'Dairy', 'Gnocchi', 'Pesto'],
  ['Miso soba noodle bowls', 25, ['Vegetarian', 'Vegan', 'Dairy-free'], 'Pantry', 'Soba noodles', 'Edamame'],
  ['One-pot lemon orzo', 30, ['Vegetarian'], 'Dairy', 'Orzo', 'Spinach'],
  ['Honey garlic salmon', 25, ['Gluten-free', 'Dairy-free', 'Kid-friendly'], 'Meat', 'Salmon', 'Green beans'],
  ['Veggie frittata', 35, ['Vegetarian', 'Gluten-free', 'Kid-friendly'], 'Dairy', 'Eggs', 'Zucchini'],
  ['Chicken and rice soup', 45, ['Gluten-free', 'Dairy-free', 'Kid-friendly'], 'Meat', 'Chicken breast', 'Carrots'],
  ['Roasted cauliflower tacos', 30, ['Vegetarian', 'Vegan', 'Dairy-free'], 'Produce', 'Cauliflower', 'Corn tortillas'],
  ['Beef and broccoli skillet', 25, ['Gluten-free', 'Dairy-free'], 'Meat', 'Beef strips', 'Broccoli'],
  ['Peanut noodle salad', 20, ['Vegetarian', 'Vegan'], 'Pantry', 'Rice noodles', 'Peanut butter'],
  ['Baked mac and cheese', 45, ['Vegetarian', 'Kid-friendly'], 'Dairy', 'Macaroni', 'Cheddar'],
  ['Lentil shepherd\'s pie', 50, ['Vegetarian', 'Vegan', 'Dairy-free'], 'Produce', 'Lentils', 'Potatoes'],
  ['Chicken fajita bowls', 30, ['Gluten-free', 'Dairy-free'], 'Meat', 'Chicken breast', 'Bell peppers'],
  ['Mushroom barley risotto', 45, ['Vegetarian'], 'Produce', 'Mushrooms', 'Pearl barley'],
]

const RECIPE_URLS = {
  'Lemony sheet-pan chicken': 'https://www.budgetbytes.com/oven-roasted-chicken-legs/',
  'Creamy tomato skillet pasta': 'https://www.budgetbytes.com/creamy-tomato-pasta-with-sausage/',
  'Build-your-own taco night': 'https://www.budgetbytes.com/turkey-taco-skillet/',
  'Coconut chickpea curry': 'https://www.budgetbytes.com/chana-saag/',
  'Maple salmon rice bowls': 'https://www.budgetbytes.com/teriyaki-salmon-recipe/',
  'Friday pantry rescue pizza': 'https://www.budgetbytes.com/thick-rich-pizza-sauce/',
  'Crispy gnocchi with greens': 'https://www.budgetbytes.com/gnocchi-with-spring-vegetables/',
  'Black bean sweet potato bowls': 'https://www.budgetbytes.com/roasted-sweet-potatoes/',
  'Turkey meatball pitas': 'https://www.budgetbytes.com/turkey-meatballs/',
  'Ginger tofu stir-fry': 'https://www.budgetbytes.com/quick-tofu-stir-fry/',
  'Sheet-pan sausage and peppers': 'https://www.budgetbytes.com/grilled-sausage-and-peppers-foil-packet/',
  'Creamy pesto gnocchi': 'https://www.budgetbytes.com/gnocchi-with-spring-vegetables/',
  'Miso soba noodle bowls': 'https://www.budgetbytes.com/chicken-yakisoba/',
  'One-pot lemon orzo': 'https://www.budgetbytes.com/lemony-artichoke-and-quinoa-salad/',
  'Honey garlic salmon': 'https://www.budgetbytes.com/honey-garlic-chicken/',
  'Veggie frittata': 'https://www.budgetbytes.com/how-to-make-a-frittata/',
  'Chicken and rice soup': 'https://www.budgetbytes.com/creamy-chicken-rice-soup/',
  'Roasted cauliflower tacos': 'https://www.budgetbytes.com/cauliflower-tacos-with-romesco-sauce/',
  'Beef and broccoli skillet': 'https://www.budgetbytes.com/garlic-noodles-with-beef-and-broccoli/',
  'Peanut noodle salad': 'https://www.budgetbytes.com/peanut-noodles-with-chicken/',
  'Baked mac and cheese': 'https://www.budgetbytes.com/extra-cheesy-homemade-mac-and-cheese/',
  'Lentil shepherd\'s pie': 'https://www.budgetbytes.com/cheesy-cottage-pie/',
  'Chicken fajita bowls': 'https://www.budgetbytes.com/stovetop-chicken-fajitas/',
  'Mushroom barley risotto': 'https://www.budgetbytes.com/baked-barley-mushrooms/',
}

function makeRecipe(seed, variant = 0) {
  const [title, time, tags, category, main, side, rescue] = seed
  const suffixes = ['with Lime', 'with Crispy Herbs', 'with Roasted Veggies', 'with Weeknight Sauce', 'with Fresh Greens']
  const variantTitle = variant ? `${title} ${suffixes[variant - 1]}` : title
  return {
    id: `${title.toLowerCase().replace(/[^a-z]+/g, '-')}-${variant}`,
    baseTitle: title,
    title: variantTitle,
    sourceUrl: RECIPE_URLS[title],
    prepTimeMinutes: time + (variant % 3) * 5,
    cleanupLevel: time <= 25 ? 'Minimum dishes' : 'Moderate',
    dietaryFlags: tags,
    category,
    isBatchCookable: time >= 30,
    isFridayRescueOnly: Boolean(rescue),
    color: ['sage', 'coral', 'gold', 'plum', 'blue'][variant % 5],
    ingredients: [
      { name: main, quantity: category === 'Meat' ? 1.5 : 1, unit: category === 'Meat' ? 'lb' : 'pack', category },
      { name: side, quantity: variant % 2 ? 2 : 1, unit: variant % 2 ? 'heads' : 'bag', category: category === 'Meat' ? 'Produce' : category },
      { name: variant % 2 ? 'Cherry tomatoes' : 'Lime', quantity: 2, unit: 'whole', category: 'Produce' },
      { name: 'Olive oil', quantity: 2, unit: 'tbsp', category: 'Pantry', isPantryStaple: true },
    ],
  }
}

const RECIPES = SEEDS.flatMap((seed) => [0, 1, 2, 3, 4].map((variant) => makeRecipe(seed, variant)))
const recipeFamily = (recipe) => (recipe.baseTitle || recipe.title).split(/\s+with\b/i)[0].trim().toLowerCase()
const randomItem = (items) => items[Math.floor(Math.random() * items.length)]

function readStorage(key, fallback) {
  try { return JSON.parse(window.localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function compatible(recipe, restrictions) {
  if (restrictions.includes('Vegetarian') && recipe.category === 'Meat') return false
  if (restrictions.includes('Vegan') && (!recipe.dietaryFlags.includes('Vegan') || recipe.category === 'Dairy')) return false
  if (restrictions.includes('Dairy-free') && recipe.category === 'Dairy') return false
  if (restrictions.includes('Gluten-free') && ['Pasta', 'Pantry'].includes(recipe.category) && !recipe.dietaryFlags.includes('Gluten-free')) return false
  if (restrictions.includes('Nut-free') && recipe.title.toLowerCase().includes('peanut')) return false
  if (restrictions.includes('Low-carb') && ['Pasta', 'Pantry'].includes(recipe.category)) return false
  if (restrictions.includes('Kid-friendly') && !recipe.dietaryFlags.includes('Kid-friendly')) return false
  return true
}

function makePlan(pace, restrictions, leftoverDays, recipes) {
  const eligible = recipes.filter((recipe) => compatible(recipe, restrictions))
  const usedFamilies = new Set()
  const usedRecipeIds = new Set()
  return DAYS.map((day) => {
    if (leftoverDays.includes(day)) return { day, leftover: true }
    const max = pace[day] === 'Quick' ? 25 : pace[day] === 'Steady' ? 35 : 60
    const available = eligible.filter((recipe) => !usedRecipeIds.has(recipe.id) && !usedFamilies.has(recipeFamily(recipe)) && (!recipe.isFridayRescueOnly || day === 'Friday'))
    const choices = available.filter((recipe) => recipe.prepTimeMinutes <= max)
    const pool = choices.length ? choices : available
    if (!pool.length) return { day, leftover: true }
    const recipe = randomItem(pool)
    usedFamilies.add(recipeFamily(recipe))
    usedRecipeIds.add(recipe.id)
    return { day, recipe }
  })
}

function storedPlanHasVariety(plan) {
  const families = plan.filter((item) => item.recipe).map((item) => recipeFamily(item.recipe))
  const recipeIds = plan.filter((item) => item.recipe).map((item) => item.recipe.id)
  const hasUniqueFamilies = new Set(families).size === families.length
  const hasUniqueRecipes = new Set(recipeIds).size === recipeIds.length
  const hasDirectLinks = plan.filter((item) => item.recipe).every((item) => item.recipe.sourceUrl && !item.recipe.sourceUrl.includes('/search?'))
  const hasValidRescueNights = plan.every((item) => !item.recipe?.isFridayRescueOnly || item.day === 'Friday')
  return hasUniqueFamilies && hasUniqueRecipes && hasDirectLinks && hasValidRescueNights
}

function App() {
  const profile = readStorage('thyme-saver-profile', {})
  const [step, setStep] = useState(1)
  const [adults, setAdults] = useState(profile.adults || 2)
  const [kids, setKids] = useState(profile.kids || 1)
  const [restrictions, setRestrictions] = useState(profile.restrictions || ['Kid-friendly'])
  const [dailyPace, setDailyPace] = useState(Object.fromEntries(DAYS.map((day) => [day, day === 'Saturday' || day === 'Sunday' ? 'Relaxed' : 'Quick'])))
  const [leftoverDays, setLeftoverDays] = useState(profile.leftoverDays || ['Wednesday'])
  const [customRecipes, setCustomRecipes] = useState(() => readStorage('thyme-saver-custom-recipes', []))
  const [favorites, setFavorites] = useState(() => readStorage('thyme-saver-favorites', []))
  const [plan, setPlan] = useState(() => {
    const savedPlan = readStorage('thyme-saver-plan', null)
    return savedPlan && storedPlanHasVariety(savedPlan) ? savedPlan : makePlan(Object.fromEntries(DAYS.map((day) => [day, 'Quick'])), ['Kid-friendly'], ['Wednesday'], RECIPES)
  })
  const [pantry, setPantry] = useState(() => readStorage('thyme-saver-pantry', PANTRY_STAPLES.map((item) => item.name)))
  const [checkedGroceries, setCheckedGroceries] = useState([])
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [libraryMode, setLibraryMode] = useState('favorites')
  const [swapDay, setSwapDay] = useState(null)
  const [newRecipe, setNewRecipe] = useState({ title: '', sourceUrl: '', prepTimeMinutes: 30, ingredients: '' })
  const allRecipes = [...RECIPES, ...customRecipes]

  const groceries = useMemo(() => {
    const grouped = {}
    plan.forEach(({ recipe }) => recipe?.ingredients.forEach((ingredient) => {
      if (pantry.includes(ingredient.name) || ingredient.isPantryStaple) return
      const key = `${ingredient.name.toLowerCase()}|${ingredient.unit}`
      const aisle = ingredient.category === 'Dairy' ? 'Dairy' : AISLES.includes(ingredient.category) ? ingredient.category : 'Pantry'
      grouped[aisle] ||= {}
      grouped[aisle][key] ||= { ...ingredient }
      grouped[aisle][key].quantity += ingredient.quantity * Math.max(1, adults / 2 + kids / 4)
    }))
    return Object.fromEntries(AISLES.filter((aisle) => grouped[aisle]).map((aisle) => [aisle, Object.values(grouped[aisle])]))
  }, [plan, pantry, adults, kids])

  const toggleRestriction = (option) => setRestrictions((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])
  const saveProfile = () => {
    window.localStorage.setItem('thyme-saver-profile', JSON.stringify({ adults, kids, restrictions, leftoverDays }))
    const nextPlan = makePlan(dailyPace, restrictions, leftoverDays, allRecipes)
    setPlan(nextPlan)
    window.localStorage.setItem('thyme-saver-plan', JSON.stringify(nextPlan))
    setStep(2)
  }
  const shuffle = (day) => setPlan((current) => current.map((item) => {
    if (item.day !== day || item.leftover) return item
    const currentFamily = item.recipe ? recipeFamily(item.recipe) : ''
    const usedByOtherDays = new Set(current.filter((other) => other.day !== day && other.recipe).map((other) => recipeFamily(other.recipe)))
    const candidates = allRecipes.filter((recipe) => recipe.id !== item.recipe?.id && recipeFamily(recipe) !== currentFamily && !usedByOtherDays.has(recipeFamily(recipe)) && compatible(recipe, restrictions) && (!recipe.isFridayRescueOnly || day === 'Friday'))
    const next = randomItem(candidates.length ? candidates : allRecipes.filter((recipe) => recipe.id !== item.recipe?.id && !usedByOtherDays.has(recipeFamily(recipe)) && compatible(recipe, restrictions) && (!recipe.isFridayRescueOnly || day === 'Friday')))
    return { ...item, recipe: next || item.recipe }
  }))
  const toggleFavorite = (id) => setFavorites((current) => { const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]; window.localStorage.setItem('thyme-saver-favorites', JSON.stringify(next)); return next })
  const addCustomRecipe = (event) => {
    event.preventDefault()
    if (!newRecipe.title.trim()) return
    const base = makeRecipe([newRecipe.title, Number(newRecipe.prepTimeMinutes), restrictions, 'Pantry', newRecipe.title, 'Fresh vegetables'], 0)
    const recipe = { ...base, id: `custom-${Date.now()}`, baseTitle: newRecipe.title, title: newRecipe.title, sourceUrl: newRecipe.sourceUrl || `https://www.google.com/search?q=${encodeURIComponent(newRecipe.title)}`, isCustom: true, ingredients: newRecipe.ingredients.split(',').filter(Boolean).map((name) => ({ name: name.trim(), quantity: 1, unit: 'each', category: 'Pantry' })) }
    const next = [...customRecipes, recipe]
    setCustomRecipes(next); window.localStorage.setItem('thyme-saver-custom-recipes', JSON.stringify(next)); setNewRecipe({ title: '', sourceUrl: '', prepTimeMinutes: 30, ingredients: '' }); setLibraryMode('favorites')
  }
  const usedByOtherDays = new Set(plan.filter((item) => item.day !== swapDay && item.recipe).map((item) => recipeFamily(item.recipe)))
  const visibleLibrary = (libraryMode === 'favorites' ? allRecipes.filter((recipe) => favorites.includes(recipe.id) || recipe.isCustom) : allRecipes).filter((recipe) => (!swapDay || !recipe.isFridayRescueOnly || swapDay === 'Friday') && (!swapDay || !usedByOtherDays.has(recipeFamily(recipe))))
  const assignRecipe = (recipe) => { if (swapDay && (!recipe.isFridayRescueOnly || swapDay === 'Friday')) setPlan((current) => current.map((item) => item.day === swapDay ? { day: swapDay, recipe } : item)); setSwapDay(null); setLibraryOpen(false) }

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="/" aria-label="Thyme Saver home"><span className="brand-mark">TS</span><span>thyme saver</span></a><div className="topbar-note"><span className="pulse-dot" /> Your week, a little lighter</div><button className="avatar" type="button" aria-label="Open recipe library" onClick={() => setLibraryOpen(true)}>♥</button></header>
    <section className="intro"><div className="intro-copy"><p className="eyebrow">Week of September 14</p><h1>Make room for <em>easy.</em></h1><p className="lede">A dinner plan that meets you where your energy is.</p><button className="library-feature" type="button" onClick={() => setLibraryOpen(true)}><span className="library-feature-icon">♥</span><span><strong>Favorites &amp; custom recipes</strong><small>Keep the meals your household loves close, or add a family recipe to this week.</small></span><b>→</b></button></div><div className="intro-visual"><div className="week-summary"><strong>{adults + kids}</strong><span>hungry humans<br />to feed</span></div></div></section>
    <nav className="steps" aria-label="Planner steps">{[['01', 'Your week'], ['02', 'Meal plan'], ['03', 'Pantry check'], ['04', 'Grocery list']].map(([number, label], index) => <button type="button" className={`step ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'done' : ''}`} onClick={() => index + 1 <= step + 1 && setStep(index + 1)} key={number}><span className="step-number">{step > index + 1 ? 'OK' : number}</span><span>{label}</span></button>)}</nav>
    <div className="content-grid">
      {step === 1 && <section className="workflow-panel setup-panel"><PanelHeading number="01" step="1" title="Tell us about your table." copy="We will use this to make the week feel doable, not demanding." /><div className="form-section"><label className="field-label">Who is eating?</label><div className="counter-row"><Counter label="Adults" value={adults} onChange={setAdults} /><Counter label="Kids" value={kids} onChange={setKids} /></div></div><div className="form-section"><label className="field-label">Any guardrails?</label><div className="toggle-grid">{DIETARY_OPTIONS.map((option) => <button type="button" className={`toggle ${restrictions.includes(option) ? 'selected' : ''}`} onClick={() => toggleRestriction(option)} key={option}><span>{restrictions.includes(option) ? '✓' : '+'}</span>{option}</button>)}</div></div><div className="form-section"><label className="field-label">What does the week feel like?</label><div className="pace-list">{DAYS.map((day) => <div className="pace-row" key={day}><span>{day}</span><div>{['Quick', 'Steady', 'Relaxed'].map((option) => <button type="button" className={dailyPace[day] === option ? 'selected' : ''} onClick={() => setDailyPace((current) => ({ ...current, [day]: option }))} key={option}>{option}<small>{option === 'Quick' ? '15-20 min' : option === 'Steady' ? '30 min' : '45+ min'}</small></button>)}</div></div>)}</div></div><div className="form-section batch-row"><div><label className="field-label">Cook once, eat twice</label><p>Select up to 3 leftover or batch-cook nights.</p></div><select multiple value={leftoverDays} onChange={(event) => setLeftoverDays([...event.target.selectedOptions].map((option) => option.value).slice(0, 3))}>{DAYS.slice(1, -1).map((day) => <option value={day} key={day}>{day} night</option>)}</select></div><button type="button" className="primary-button" onClick={saveProfile}>Build my week <span>→</span></button></section>}
      {step === 2 && <section className="workflow-panel plan-panel"><PanelHeading number="02" step="2" title="Your week, sorted." copy="Swap anything that does not feel like you." /><div className="action-guide" aria-label="Meal plan actions"><span><b>♥</b> Favorite recipe</span><span><b>↔</b> Select recipe</span><span><b>↻</b> Swap recipe</span></div><div className="plan-list">{plan.map(({ day, recipe, leftover }) => <article className="day-card" key={day}><div className="day-label"><span>{day.slice(0, 3)}</span><strong>{day}</strong></div>{leftover ? <div className="leftover-card"><span className="leftover-icon">↻</span><div><strong>Leftover night</strong><p>Future you says thank you.</p></div></div> : <><div className={`meal-color ${recipe.color}`} /><div className="meal-info"><span className="meal-tag">{recipe.prepTimeMinutes} min · {recipe.cleanupLevel}</span><h3><a href={recipe.sourceUrl} target="_blank" rel="noreferrer">{recipe.title}</a></h3><div className="tag-list">{recipe.dietaryFlags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div></div><button className={`icon-button ${favorites.includes(recipe.id) ? 'favorited' : ''}`} type="button" onClick={() => toggleFavorite(recipe.id)} title="Favorite recipe" aria-label={`Favorite ${recipe.title}`}>♥</button><button className="icon-button" type="button" onClick={() => { setSwapDay(day); setLibraryOpen(true) }} title={`Select a recipe for ${day}`} aria-label={`Select a recipe for ${day}`}>↔</button><button className="icon-button" type="button" onClick={() => shuffle(day)} title={`Swap recipe for ${day}`} aria-label={`Swap recipe for ${day}`}>↻</button></>}</article>)}</div><div className="panel-actions"><button className="text-button" type="button" onClick={() => setStep(1)}>← Edit setup</button><button className="primary-button" type="button" onClick={() => setStep(3)}>Check my pantry <span>→</span></button></div></section>}
      {step === 3 && <section className="workflow-panel pantry-panel"><PanelHeading number="03" step="3" title="Quick pantry check." copy="Uncheck anything you already have. We will keep it off the shopping list." /><div className="pantry-list">{PANTRY_STAPLES.filter((item) => !(restrictions.includes('Vegetarian') || restrictions.includes('Vegan')) || !item.meat).filter((item) => !restrictions.includes('Dairy-free') || !item.dairy).map((item) => <label className={`pantry-item ${pantry.includes(item.name) ? 'in-pantry' : ''}`} key={item.name}><input type="checkbox" checked={pantry.includes(item.name)} onChange={() => { const next = pantry.includes(item.name) ? pantry.filter((entry) => entry !== item.name) : [...pantry, item.name]; setPantry(next); window.localStorage.setItem('thyme-saver-pantry', JSON.stringify(next)) }} /><span className="checkbox">✓</span><span>{item.name}</span><small>{pantry.includes(item.name) ? 'Already have it' : 'Add to list'}</small></label>)}</div><div className="pantry-note"><span>i</span><p>Staples adapt to your dietary profile and are removed from the final list when already in stock.</p></div><div className="panel-actions"><button className="text-button" type="button" onClick={() => setStep(2)}>← Review meals</button><button className="primary-button" type="button" onClick={() => setStep(4)}>Show grocery list <span>→</span></button></div></section>}
      {step === 4 && <section className="workflow-panel grocery-panel"><PanelHeading number="04" step="4" title="Ready when you are." copy={`${Object.values(groceries).flat().length} things to pick up for ${adults + kids} people.`} /><div className="grocery-groups">{Object.entries(groceries).map(([aisle, items]) => <div className="grocery-group" key={aisle}><div className="grocery-heading"><h3>{aisle}</h3><span>{items.length} items</span></div>{items.map((item) => <label className={`grocery-item ${checkedGroceries.includes(item.name) ? 'checked' : ''}`} key={`${aisle}-${item.name}`}><input type="checkbox" checked={checkedGroceries.includes(item.name)} onChange={() => setCheckedGroceries((current) => current.includes(item.name) ? current.filter((entry) => entry !== item.name) : [...current, item.name])} /><span className="checkbox">✓</span><span>{item.name}</span><small>{Number(item.quantity.toFixed(1))} {item.unit}</small></label>)}</div>)}</div><div className="panel-actions"><button className="text-button" type="button" onClick={() => setStep(3)}>← Pantry check</button><button className="secondary-button" type="button" onClick={() => window.print()}>Print list</button></div></section>}
      <aside className="aside-panel"><div className="aside-top"><span className="sun-mark">✳</span><span>Small wins</span></div><h2>Decision fatigue is not a character flaw.</h2><p>We are here to make dinner one less thing to carry.</p><div className="aside-rule" /><div className="aside-stat"><strong>{plan.filter((item) => item.recipe?.prepTimeMinutes <= 25 || item.leftover).length}</strong><span>low-lift nights<br />on your plan</span></div><button className="library-link" type="button" onClick={() => setLibraryOpen(true)}>Open recipe library →</button></aside>
    </div>
    {libraryOpen && <div className="modal-backdrop" onClick={() => setLibraryOpen(false)}><section className="recipe-library" onClick={(event) => event.stopPropagation()}><div className="library-header"><div><p className="eyebrow">Recipe library</p><h2>{swapDay ? `Choose a meal for ${swapDay}` : 'Favorites & custom recipes'}</h2></div><button className="icon-button" type="button" onClick={() => setLibraryOpen(false)}>×</button></div><div className="library-tabs"><button type="button" className={libraryMode === 'favorites' ? 'selected' : ''} onClick={() => setLibraryMode('favorites')}>Favorites ({favorites.length})</button><button type="button" className={libraryMode === 'all' ? 'selected' : ''} onClick={() => setLibraryMode('all')}>All 120+ meals</button><button type="button" className={libraryMode === 'add' ? 'selected' : ''} onClick={() => setLibraryMode('add')}>Add custom</button></div>{libraryMode === 'add' ? <form className="custom-form" onSubmit={addCustomRecipe}><label>Title<input required value={newRecipe.title} onChange={(event) => setNewRecipe({ ...newRecipe, title: event.target.value })} /></label><label>Recipe URL<input type="url" value={newRecipe.sourceUrl} onChange={(event) => setNewRecipe({ ...newRecipe, sourceUrl: event.target.value })} placeholder="https://..." /></label><label>Prep minutes<input type="number" min="5" value={newRecipe.prepTimeMinutes} onChange={(event) => setNewRecipe({ ...newRecipe, prepTimeMinutes: event.target.value })} /></label><label>Ingredients, comma separated<textarea value={newRecipe.ingredients} onChange={(event) => setNewRecipe({ ...newRecipe, ingredients: event.target.value })} placeholder="pasta, tomatoes, basil" /></label><button className="primary-button" type="submit">Save custom recipe</button></form> : <div className="library-list">{visibleLibrary.length ? visibleLibrary.map((recipe) => <div className="library-item" key={recipe.id}><div><a href={recipe.sourceUrl} target="_blank" rel="noreferrer">{recipe.title}</a><small>{recipe.prepTimeMinutes} min · {recipe.isCustom ? 'Custom recipe' : recipe.dietaryFlags.join(' · ')}</small></div>{swapDay ? <button className="secondary-button" type="button" onClick={() => assignRecipe(recipe)}>Use this</button> : <button className={`icon-button ${favorites.includes(recipe.id) ? 'favorited' : ''}`} type="button" onClick={() => toggleFavorite(recipe.id)}>♥</button>}</div>) : <p className="empty-library">Favorite a meal from your plan or add a custom recipe to see it here.</p>}</div>}</section></div>}
    <footer className="footer"><span>thyme saver</span><span>Less planning. More living.</span><span>Prototype · 2026</span></footer>
  </main>
}

function PanelHeading({ number, step, title, copy }) { return <div className="panel-heading"><div><p className="eyebrow">Step {step} of 4</p><h2>{title}</h2><p>{copy}</p></div><span className="section-number">{number}</span></div> }
function Counter({ label, value, onChange }) { return <div className="counter"><span>{label}</span><div><button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Remove ${label}`}>-</button><strong>{value}</strong><button type="button" onClick={() => onChange(value + 1)} aria-label={`Add ${label}`}>+</button></div></div> }
export default App
