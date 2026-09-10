import { useMemo, useState } from 'react'
import './App.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DIETARY_OPTIONS = ['Gluten-free', 'Dairy-free', 'Vegetarian', 'Vegan', 'Nut-free', 'Kid-friendly']
const PANTRY_STAPLES = ['Olive oil', 'Salt + pepper', 'Garlic', 'Dried herbs', 'Rice', 'Butter']
const RECIPES = [
  { id: 'lemon-chicken', title: 'Lemony sheet-pan chicken', time: 25, cleanup: 'Low', tags: ['Gluten-free', 'Kid-friendly'], color: 'sage', ingredients: [['Chicken thighs', '1.5 lb', 'Meat'], ['Broccoli', '2 heads', 'Produce'], ['Baby potatoes', '1 bag', 'Produce'], ['Lemon', '2', 'Produce']] },
  { id: 'tomato-pasta', title: 'Creamy tomato skillet pasta', time: 30, cleanup: 'Medium', tags: ['Comfort food'], color: 'coral', ingredients: [['Pasta', '1 lb', 'Pantry'], ['Crushed tomatoes', '1 can', 'Pantry'], ['Parmesan', '1 cup', 'Dairy'], ['Spinach', '1 bag', 'Produce']] },
  { id: 'tacos', title: 'Build-your-own taco night', time: 20, cleanup: 'Low', tags: ['Kid-friendly'], color: 'gold', ingredients: [['Ground turkey', '1 lb', 'Meat'], ['Tortillas', '1 pack', 'Pantry'], ['Avocado', '2', 'Produce'], ['Shredded cheese', '1 bag', 'Dairy']] },
  { id: 'coconut-curry', title: 'Coconut chickpea curry', time: 35, cleanup: 'Low', tags: ['Vegetarian', 'Vegan', 'Gluten-free'], color: 'plum', ingredients: [['Chickpeas', '2 cans', 'Pantry'], ['Coconut milk', '1 can', 'Pantry'], ['Bell peppers', '3', 'Produce'], ['Jasmine rice', '1 bag', 'Pantry']] },
  { id: 'salmon', title: 'Maple salmon rice bowls', time: 35, cleanup: 'Medium', tags: ['Gluten-free'], color: 'blue', ingredients: [['Salmon', '1.5 lb', 'Meat'], ['Jasmine rice', '1 bag', 'Pantry'], ['Cucumber', '2', 'Produce'], ['Maple syrup', '2 tbsp', 'Pantry']] },
  { id: 'pizza', title: 'Friday pantry rescue pizza', time: 20, cleanup: 'Low', tags: ['Flexible', 'Kid-friendly'], color: 'coral', ingredients: [['Pizza dough', '1', 'Pantry'], ['Mozzarella', '1 bag', 'Dairy'], ['Bell peppers', '2', 'Produce'], ['Tomato sauce', '1 jar', 'Pantry']] },
  { id: 'gnocchi', title: 'Crispy gnocchi with greens', time: 25, cleanup: 'Low', tags: ['Vegetarian'], color: 'sage', ingredients: [['Gnocchi', '1 pack', 'Pantry'], ['Cherry tomatoes', '1 pint', 'Produce'], ['Kale', '1 bunch', 'Produce'], ['Feta', '1 cup', 'Dairy']] },
]
const TIME_OPTIONS = [{ label: 'Quick', detail: '15-20 min', max: 25 }, { label: 'Steady', detail: '30 min', max: 35 }, { label: 'Relaxed', detail: '45+ min', max: 60 }]

function savedProfile() {
  const saved = window.localStorage.getItem('thyme-saver-profile')
  return saved ? JSON.parse(saved) : {}
}

function makePlan(dailyPace, restrictions, leftoverDay) {
  const compatible = RECIPES.filter((recipe) => !restrictions.includes('Vegan') || recipe.tags.includes('Vegan') || recipe.tags.includes('Vegetarian'))
  return DAYS.map((day, index) => {
    if (day === leftoverDay) return { day, leftover: true }
    if (day === 'Friday') return { day, recipe: RECIPES.find((recipe) => recipe.id === 'pizza') }
    const max = TIME_OPTIONS.find((option) => option.label === dailyPace[day])?.max || 25
    const candidates = compatible.filter((recipe) => recipe.time <= max)
    return { day, recipe: (candidates.length ? candidates : compatible)[index % (candidates.length || compatible.length)] }
  })
}

function App() {
  const [step, setStep] = useState(1)
  const [adults, setAdults] = useState(() => savedProfile().adults || 2)
  const [kids, setKids] = useState(() => savedProfile().kids || 1)
  const [restrictions, setRestrictions] = useState(() => savedProfile().restrictions || ['Kid-friendly'])
  const [dailyPace, setDailyPace] = useState(Object.fromEntries(DAYS.map((day) => [day, day === 'Saturday' || day === 'Sunday' ? 'Relaxed' : 'Quick'])))
  const [leftoverDay, setLeftoverDay] = useState('Wednesday')
  const [plan, setPlan] = useState(() => makePlan(Object.fromEntries(DAYS.map((day) => [day, 'Quick'])), ['Kid-friendly'], 'Wednesday'))
  const [pantry, setPantry] = useState(PANTRY_STAPLES)
  const [checkedGroceries, setCheckedGroceries] = useState([])

  const groceries = useMemo(() => {
    const grouped = {}
    plan.forEach(({ recipe }) => recipe?.ingredients.forEach(([name, quantity, aisle]) => {
      if (pantry.includes(name)) return
      grouped[aisle] = grouped[aisle] || []
      const existing = grouped[aisle].find((item) => item.name === name)
      if (existing) existing.quantity = `${existing.quantity} + ${quantity}`
      else grouped[aisle].push({ name, quantity })
    }))
    return grouped
  }, [plan, pantry])

  const toggleRestriction = (option) => setRestrictions((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option])
  const saveProfile = () => {
    window.localStorage.setItem('thyme-saver-profile', JSON.stringify({ adults, kids, restrictions }))
    setPlan(makePlan(dailyPace, restrictions, leftoverDay))
    setStep(2)
  }
  const shuffle = (day) => setPlan((current) => current.map((item) => item.day === day ? { ...item, recipe: RECIPES[(RECIPES.findIndex((recipe) => recipe.id === item.recipe?.id) + 1) % RECIPES.length] } : item))

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="/" aria-label="Thyme Saver home"><span className="brand-mark">TS</span><span>thyme saver</span></a><div className="topbar-note"><span className="pulse-dot" /> Your week, a little lighter</div><button className="avatar" type="button" aria-label="Open profile">AM</button></header>
    <section className="intro"><div><p className="eyebrow">Week of September 14</p><h1>Make room for <em>easy.</em></h1><p className="lede">A dinner plan that meets you where your energy is.</p></div><div className="week-summary"><strong>{adults + kids}</strong><span>hungry humans<br />to feed</span></div></section>
    <nav className="steps" aria-label="Planner steps">{[['01', 'Your week'], ['02', 'Meal plan'], ['03', 'Pantry check'], ['04', 'Grocery list']].map(([number, label], index) => <button type="button" className={`step ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'done' : ''}`} onClick={() => index + 1 <= step + 1 && setStep(index + 1)} key={number}><span className="step-number">{step > index + 1 ? 'OK' : number}</span><span>{label}</span></button>)}</nav>
    <div className="content-grid">
      {step === 1 && <section className="workflow-panel setup-panel"><PanelHeading number="01" step="1" title="Tell us about your table." copy="We will use this to make the week feel doable, not demanding." /><div className="form-section"><label className="field-label">Who is eating?</label><div className="counter-row"><Counter label="Adults" value={adults} onChange={setAdults} /><Counter label="Kids" value={kids} onChange={setKids} /></div></div><div className="form-section"><label className="field-label">Any guardrails?</label><div className="toggle-grid">{DIETARY_OPTIONS.map((option) => <button type="button" className={`toggle ${restrictions.includes(option) ? 'selected' : ''}`} onClick={() => toggleRestriction(option)} key={option}><span>{restrictions.includes(option) ? '✓' : '+'}</span>{option}</button>)}</div></div><div className="form-section"><label className="field-label">What does the week feel like?</label><div className="pace-list">{DAYS.map((day) => <div className="pace-row" key={day}><span>{day}</span><div>{TIME_OPTIONS.map((option) => <button type="button" className={dailyPace[day] === option.label ? 'selected' : ''} onClick={() => setDailyPace((current) => ({ ...current, [day]: option.label }))} key={option.label}>{option.label}<small>{option.detail}</small></button>)}</div></div>)}</div></div><div className="form-section batch-row"><div><label className="field-label">Cook once, eat twice</label><p>Pick a day with a little more breathing room for leftovers.</p></div><select value={leftoverDay} onChange={(event) => setLeftoverDay(event.target.value)}><option value="None">No leftovers</option>{DAYS.slice(1, -1).map((day) => <option value={day} key={day}>{day} night</option>)}</select></div><button type="button" className="primary-button" onClick={saveProfile}>Build my week <span>→</span></button></section>}
      {step === 2 && <section className="workflow-panel plan-panel"><PanelHeading number="02" step="2" title="Your week, sorted." copy="We matched the menu to your energy budget. Swap anything that does not feel like you." /><div className="plan-list">{plan.map(({ day, recipe, leftover }) => <article className="day-card" key={day}><div className="day-label"><span>{day.slice(0, 3)}</span><strong>{day}</strong></div>{leftover ? <div className="leftover-card"><span className="leftover-icon">↻</span><div><strong>Leftover night</strong><p>Future you says thank you.</p></div></div> : <><div className={`meal-color ${recipe.color}`} /><div className="meal-info"><span className="meal-tag">{recipe.time} min · {recipe.cleanup} cleanup</span><h3>{recipe.title}</h3><div className="tag-list">{recipe.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><button className="icon-button" type="button" onClick={() => shuffle(day)} title={`Shuffle ${day}`}>↻</button></>}</article>)}</div><div className="panel-actions"><button className="text-button" type="button" onClick={() => setStep(1)}>← Edit setup</button><button className="primary-button" type="button" onClick={() => setStep(3)}>Check my pantry <span>→</span></button></div></section>}
      {step === 3 && <section className="workflow-panel pantry-panel"><PanelHeading number="03" step="3" title="Quick pantry check." copy="Uncheck anything you already have. We will keep it off the shopping list." /><div className="pantry-list">{PANTRY_STAPLES.map((item) => <label className={`pantry-item ${pantry.includes(item) ? 'in-pantry' : ''}`} key={item}><input type="checkbox" checked={pantry.includes(item)} onChange={() => setPantry((current) => current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item])} /><span className="checkbox">✓</span><span>{item}</span><small>{pantry.includes(item) ? 'Already have it' : 'Add to list'}</small></label>)}</div><div className="pantry-note"><span>i</span><p>We will also skip pantry staples already used in your recipes, so your list stays focused.</p></div><div className="panel-actions"><button className="text-button" type="button" onClick={() => setStep(2)}>← Review meals</button><button className="primary-button" type="button" onClick={() => setStep(4)}>Show grocery list <span>→</span></button></div></section>}
      {step === 4 && <section className="workflow-panel grocery-panel"><PanelHeading number="04" step="4" title="Ready when you are." copy={`${Object.values(groceries).flat().length} things to pick up for ${adults + kids} people.`} /><div className="grocery-groups">{Object.entries(groceries).map(([aisle, items]) => <div className="grocery-group" key={aisle}><div className="grocery-heading"><h3>{aisle}</h3><span>{items.length} items</span></div>{items.map((item) => <label className={`grocery-item ${checkedGroceries.includes(item.name) ? 'checked' : ''}`} key={item.name}><input type="checkbox" checked={checkedGroceries.includes(item.name)} onChange={() => setCheckedGroceries((current) => current.includes(item.name) ? current.filter((entry) => entry !== item.name) : [...current, item.name])} /><span className="checkbox">✓</span><span>{item.name}</span><small>{item.quantity}</small></label>)}</div>)}</div><div className="panel-actions"><button className="text-button" type="button" onClick={() => setStep(3)}>← Pantry check</button><button className="secondary-button" type="button" onClick={() => window.print()}>Print list</button></div></section>}
      <aside className="aside-panel"><div className="aside-top"><span className="sun-mark">✳</span><span>Small wins</span></div><h2>Decision fatigue is not a character flaw.</h2><p>We are here to make dinner one less thing to carry.</p><div className="aside-rule" /><div className="aside-stat"><strong>{plan.filter((item) => item.recipe?.time <= 25 || item.leftover).length}</strong><span>low-lift nights<br />on your plan</span></div><div className="aside-footer">made for real life <span>♡</span></div></aside>
    </div>
    <footer className="footer"><span>thyme saver</span><span>Less planning. More living.</span><span>Prototype · 2026</span></footer>
  </main>
}

function PanelHeading({ number, step, title, copy }) {
  return <div className="panel-heading"><div><p className="eyebrow">Step {step} of 4</p><h2>{title}</h2><p>{copy}</p></div><span className="section-number">{number}</span></div>
}

function Counter({ label, value, onChange }) {
  return <div className="counter"><span>{label}</span><div><button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Remove ${label}`}>-</button><strong>{value}</strong><button type="button" onClick={() => onChange(value + 1)} aria-label={`Add ${label}`}>+</button></div></div>
}

export default App
