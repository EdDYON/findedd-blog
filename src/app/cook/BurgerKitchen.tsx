'use client'

import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'

type CategoryKey = 'bun' | 'protein' | 'cheese' | 'vegetable' | 'sauce' | 'extra'

type Ingredient = {
  id: string
  name: string
  category: CategoryKey
  color: string
  short: string
}

type Category = {
  key: CategoryKey
  title: string
  hint: string
}

type Recipe = {
  id: string
  name: string
  badge: string
  required: string[]
  optional: string[]
  taste: string[]
  steps: string[]
}

type VisualLayer = Ingredient & {
  role?: 'top' | 'bottom'
  visualKey: string
}

const categories: Category[] = [
  { key: 'bun', title: '汉堡胚', hint: '也可以选择无胚，做成盘餐或生菜包。' },
  { key: 'protein', title: '主体', hint: '肉饼、鸡腿、鱼排或植物肉。' },
  { key: 'cheese', title: '芝士', hint: '负责融化、拉丝和幸福感。' },
  { key: 'vegetable', title: '蔬菜', hint: '增加脆感、酸度和清爽感。' },
  { key: 'sauce', title: '酱料', hint: '汉堡真正的性格开关。' },
  { key: 'extra', title: '加料', hint: '培根、煎蛋、洋葱圈，快乐但危险。' },
]

const ingredients: Ingredient[] = [
  { id: 'sesame-bun', name: '芝麻胚', category: 'bun', color: '#d9822b', short: '芝麻' },
  { id: 'brioche-bun', name: '黄油布里欧修胚', category: 'bun', color: '#f0a23a', short: '黄油胚' },
  { id: 'whole-bun', name: '全麦胚', category: 'bun', color: '#9f6a35', short: '全麦' },
  { id: 'lettuce-wrap', name: '生菜包', category: 'bun', color: '#54a848', short: '生菜包' },
  { id: 'no-bun', name: '不要胚', category: 'bun', color: '#fff5e3', short: '无胚' },
  { id: 'beef-patty', name: '牛肉饼', category: 'protein', color: '#5a2514', short: '牛肉' },
  { id: 'double-beef', name: '双层牛肉饼', category: 'protein', color: '#482012', short: '双牛' },
  { id: 'fried-chicken', name: '炸鸡腿排', category: 'protein', color: '#c57523', short: '炸鸡' },
  { id: 'fish-fillet', name: '鳕鱼排', category: 'protein', color: '#ead29b', short: '鱼排' },
  { id: 'mushroom-patty', name: '蘑菇排', category: 'protein', color: '#6e4a2e', short: '蘑菇' },
  { id: 'american-cheese', name: '美式芝士', category: 'cheese', color: '#ffc329', short: '美式芝士' },
  { id: 'cheddar', name: '切达芝士', category: 'cheese', color: '#f6a51f', short: '切达' },
  { id: 'mozzarella', name: '马苏里拉', category: 'cheese', color: '#fff0b9', short: '马苏' },
  { id: 'lettuce', name: '生菜', category: 'vegetable', color: '#4b9d42', short: '生菜' },
  { id: 'tomato', name: '番茄片', category: 'vegetable', color: '#f93b32', short: '番茄' },
  { id: 'pickle', name: '酸黄瓜', category: 'vegetable', color: '#8ca63a', short: '酸瓜' },
  { id: 'onion', name: '洋葱圈', category: 'vegetable', color: '#f5e0ed', short: '洋葱' },
  { id: 'jalapeno', name: '墨西哥辣椒', category: 'vegetable', color: '#2f8d38', short: '辣椒' },
  { id: 'ketchup', name: '番茄酱', category: 'sauce', color: '#f71918', short: '番茄酱' },
  { id: 'mustard', name: '黄芥末', category: 'sauce', color: '#ffc329', short: '芥末' },
  { id: 'mayo', name: '蛋黄酱', category: 'sauce', color: '#fff0cc', short: '蛋黄酱' },
  { id: 'bbq', name: '烟熏 BBQ 酱', category: 'sauce', color: '#6f2418', short: 'BBQ' },
  { id: 'spicy-mayo', name: '辣味蛋黄酱', category: 'sauce', color: '#ff7a25', short: '辣蛋黄' },
  { id: 'bacon', name: '培根', category: 'extra', color: '#b23a22', short: '培根' },
  { id: 'egg', name: '煎蛋', category: 'extra', color: '#fff3b4', short: '煎蛋' },
  { id: 'onion-ring', name: '炸洋葱圈', category: 'extra', color: '#d9902f', short: '洋葱圈' },
]

const recipes: Recipe[] = [
  {
    id: 'classic',
    name: '经典芝士牛肉堡',
    badge: '入门稳牌',
    required: ['sesame-bun', 'beef-patty', 'american-cheese', 'lettuce', 'tomato', 'pickle', 'ketchup'],
    optional: ['mustard'],
    taste: ['酸甜', '肉香', '清爽'],
    steps: ['烤热芝麻胚', '牛肉饼煎到边缘焦香', '趁热盖芝士', '按生菜、番茄、酸黄瓜和酱料组装'],
  },
  {
    id: 'double',
    name: '双层芝士猛兽堡',
    badge: '高能量',
    required: ['brioche-bun', 'double-beef', 'cheddar', 'pickle', 'bbq'],
    optional: ['bacon', 'onion'],
    taste: ['浓郁', '烟熏', '油脂感'],
    steps: ['布里欧修胚轻烤', '双层牛肉饼分开煎香', '芝士夹在肉饼之间融化', '用 BBQ 酱压住肉香'],
  },
  {
    id: 'spicy-chicken',
    name: '辣酱鸡腿堡',
    badge: '脆皮警告',
    required: ['sesame-bun', 'fried-chicken', 'lettuce', 'spicy-mayo', 'pickle'],
    optional: ['tomato', 'jalapeno'],
    taste: ['辣', '脆', '酸爽'],
    steps: ['炸鸡腿排回烤 3 分钟', '面包胚内侧抹辣味蛋黄酱', '用酸黄瓜和生菜增加清爽感', '喜欢更刺激就加墨西哥辣椒'],
  },
  {
    id: 'breakfast',
    name: '早餐煎蛋培根堡',
    badge: '早起奖励',
    required: ['brioche-bun', 'egg', 'bacon', 'american-cheese', 'mayo'],
    optional: ['beef-patty'],
    taste: ['奶香', '咸香', '柔软'],
    steps: ['黄油胚煎到微脆', '培根煎出焦边', '煎蛋保持半熟或全熟', '蛋黄酱薄薄一层就够'],
  },
  {
    id: 'lettuce-wrap',
    name: '无胚生菜包汉堡',
    badge: '轻食路线',
    required: ['lettuce-wrap', 'beef-patty', 'tomato', 'pickle', 'mustard'],
    optional: ['onion', 'jalapeno'],
    taste: ['清爽', '低负担', '酸辣'],
    steps: ['选两大片完整生菜当外壳', '肉饼煎好后稍微放凉', '番茄和酸黄瓜负责水分', '用芥末提味，不要放太多水感酱料'],
  },
  {
    id: 'mushroom',
    name: '蘑菇芝士素堡',
    badge: '植物灵感',
    required: ['whole-bun', 'mushroom-patty', 'mozzarella', 'lettuce', 'tomato', 'mayo'],
    optional: ['onion', 'bbq'],
    taste: ['鲜味', '柔和', '多汁'],
    steps: ['全麦胚烤热', '蘑菇排煎到表面微焦', '马苏里拉负责拉丝', '用番茄和生菜补水分'],
  },
  {
    id: 'naked',
    name: '无胚肉饼盘',
    badge: '没有胚也能吃',
    required: ['no-bun', 'beef-patty', 'lettuce', 'tomato', 'bbq'],
    optional: ['egg', 'pickle'],
    taste: ['直接', '肉香', '清爽'],
    steps: ['牛肉饼煎好放在生菜上', '番茄和酸黄瓜放旁边', 'BBQ 酱少量点在肉饼上', '可以加煎蛋变成盘餐'],
  },
]

const initialSelected = new Set(['sesame-bun', 'beef-patty', 'american-cheese', 'lettuce', 'tomato', 'pickle', 'ketchup'])
const ingredientById = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]))
const bunIds = ingredients.filter((ingredient) => ingredient.category === 'bun').map((ingredient) => ingredient.id)

function byIds(ids: string[], selected: Set<string>) {
  return ids
    .filter((id) => selected.has(id))
    .map((id) => ingredientById.get(id))
    .filter((item): item is Ingredient => Boolean(item))
}

function getMissing(recipe: Recipe, selected: Set<string>) {
  return recipe.required.filter((ingredientId) => !selected.has(ingredientId))
}

function getIngredientName(ingredientId: string) {
  return ingredientById.get(ingredientId)?.name ?? ingredientId
}

function getVisualLayers(selected: Set<string>): VisualLayer[] {
  const bun = [...selected].map((id) => ingredientById.get(id)).find((item) => item?.category === 'bun')
  const hasBread = bun && bun.id !== 'no-bun'
  const topBun = hasBread ? [{ ...bun, role: 'top' as const, visualKey: `${bun.id}-top` }] : []
  const bottomBun = hasBread ? [{ ...bun, role: 'bottom' as const, visualKey: `${bun.id}-bottom` }] : []

  const topSauces = byIds(['mayo', 'spicy-mayo', 'ketchup', 'mustard', 'bbq'], selected).slice(0, 2)
  const vegetables = byIds(['lettuce', 'tomato', 'pickle', 'onion', 'jalapeno'], selected)
  const extras = byIds(['egg', 'bacon', 'onion-ring'], selected)
  const cheeses = byIds(['american-cheese', 'cheddar', 'mozzarella'], selected)
  const proteins = byIds(['double-beef', 'beef-patty', 'fried-chicken', 'fish-fillet', 'mushroom-patty'], selected)

  const layers: Array<Ingredient & Partial<Pick<VisualLayer, 'role' | 'visualKey'>>> = [
    ...topBun,
    ...topSauces,
    ...vegetables,
    ...extras,
    ...cheeses,
    ...proteins,
    ...bottomBun,
  ]

  return layers.map((layer, index) => ({ ...layer, visualKey: layer.visualKey ?? `${layer.id}-${index}` }))
}

function getPreviewTitle(selected: Set<string>, activeRecipe: Recipe, recipeStates: Array<{ recipe: Recipe; canMake: boolean }>) {
  const readyRecipe = recipeStates.find((item) => item.canMake)?.recipe
  if (readyRecipe) return readyRecipe.name
  if (selected.has('no-bun')) return '无胚自由盘'
  return activeRecipe.name
}

export default function BurgerKitchen() {
  const [selected, setSelected] = useState(() => new Set(initialSelected))
  const [activeRecipeId, setActiveRecipeId] = useState(recipes[0].id)
  const activeRecipe = recipes.find((recipe) => recipe.id === activeRecipeId) ?? recipes[0]

  const recipeStates = useMemo(
    () =>
      recipes.map((recipe) => {
        const missing = getMissing(recipe, selected)
        return {
          recipe,
          missing,
          canMake: missing.length === 0,
        }
      }),
    [selected],
  )

  const visualLayers = useMemo(() => getVisualLayers(selected), [selected])
  const canMakeCount = recipeStates.filter((item) => item.canMake).length
  const previewTitle = getPreviewTitle(selected, activeRecipe, recipeStates)
  const selectedIngredients = [...selected].map(getIngredientName).filter((name) => name !== '不要胚')

  function toggleIngredient(ingredient: Ingredient) {
    setSelected((current) => {
      const next = new Set(current)
      if (ingredient.category === 'bun') {
        bunIds.forEach((id) => next.delete(id))
        next.add(ingredient.id)
        return next
      }
      if (next.has(ingredient.id)) {
        next.delete(ingredient.id)
      } else {
        next.add(ingredient.id)
      }
      return next
    })
  }

  function applyRecipe(recipe: Recipe) {
    setActiveRecipeId(recipe.id)
    setSelected(new Set([...recipe.required, ...recipe.optional]))
  }

  function clearBasket() {
    setSelected(new Set(['sesame-bun']))
  }

  return (
    <section className="kitchen kitchen-refined" id="basket">
      <div className="ingredient-panel">
        <div className="panel-heading refined-heading">
          <div>
            <p className="eyebrow">BUILD YOUR BURGER</p>
            <h2>选择食材</h2>
          </div>
          <button type="button" onClick={clearBasket}>
            重置
          </button>
        </div>

        {categories.map((category) => (
          <div className="ingredient-group" key={category.key}>
            <div>
              <h3>{category.title}</h3>
              <p>{category.hint}</p>
            </div>
            <div className="ingredient-chips">
              {ingredients
                .filter((ingredient) => ingredient.category === category.key)
                .map((ingredient) => {
                  const active = selected.has(ingredient.id)
                  return (
                    <button
                      className={active ? 'ingredient-chip active' : 'ingredient-chip'}
                      key={ingredient.id}
                      onClick={() => toggleIngredient(ingredient)}
                      style={{ '--chip-color': ingredient.color } as CSSProperties}
                      type="button"
                    >
                      <span />
                      {ingredient.name}
                    </button>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      <aside className="burger-preview" aria-label="当前汉堡预览">
        <div className="preview-card refined-preview-card">
          <p className="eyebrow">FRESHLY BUILT</p>
          <h2>{previewTitle}</h2>
          <div className={selected.has('no-bun') ? 'dish-stage no-bun-stage' : 'dish-stage'}>
            <div className="plate-glow" />
            {visualLayers.length <= 1 ? (
              <p className="empty-stack">再加肉饼、蔬菜和酱料，汉堡就会变得好吃。</p>
            ) : (
              <div className="crafted-burger" aria-hidden="true">
                {visualLayers.map((layer, index) => (
                  <div
                    className={`visual-layer visual-${layer.category} visual-${layer.id} ${layer.role ? `visual-${layer.role}` : ''}`}
                    key={layer.visualKey}
                    style={{ '--layer-color': layer.color, '--delay': `${index * 38}ms` } as CSSProperties}
                  >
                    {layer.category === 'bun' && layer.role === 'top' && layer.id !== 'lettuce-wrap' ? (
                      <span className="sesame-dots" />
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="preview-meta">
            <p>
              已选择 <strong>{selectedIngredients.length}</strong> 种材料，可直接做 <strong>{canMakeCount}</strong> 款汉堡。
            </p>
            <div className="selected-mini-list">
              {selectedIngredients.slice(0, 8).map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="recipes" id="recipes">
        <div className="panel-heading refined-heading">
          <div>
            <p className="eyebrow">CAN I COOK?</p>
            <h2>可制作配方</h2>
          </div>
          <span>{canMakeCount} / {recipes.length} 可做</span>
        </div>

        <div className="recipe-grid">
          {recipeStates.map(({ recipe, missing, canMake }) => (
            <article className={recipe.id === activeRecipe.id ? 'recipe-card active' : 'recipe-card'} key={recipe.id}>
              <div className="recipe-card-top">
                <p>{recipe.badge}</p>
                <span>{canMake ? '可制作' : `缺 ${missing.length} 个`}</span>
              </div>
              <h3>{recipe.name}</h3>
              <div className="taste-list">
                {recipe.taste.map((taste) => (
                  <span key={taste}>{taste}</span>
                ))}
              </div>
              {missing.length > 0 ? (
                <p className="missing">还缺：{missing.map(getIngredientName).join('、')}</p>
              ) : (
                <p className="missing ready">材料齐了，可以开做。</p>
              )}
              <ol>
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <button type="button" onClick={() => applyRecipe(recipe)}>
                按这个组装
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
