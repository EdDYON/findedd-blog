'use client'

import Image from 'next/image'
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import { pixelIngredients, type PixelIngredient } from '@/data/pixelIngredients'

type LayerKind =
  | 'bunTop'
  | 'bunBottom'
  | 'base'
  | 'protein'
  | 'cheese'
  | 'vegetable'
  | 'sauce'
  | 'extra'
  | 'seasoning'
  | 'side'
  | 'other'

type KitchenIngredient = PixelIngredient & {
  kind: LayerKind
  color: string
}

type LayerOffset = {
  x: number
  y: number
}

type DragState = {
  key: string
  pointerId: number
  startX: number
  startY: number
  originX: number
  originY: number
  minX: number
  maxX: number
  minY: number
  maxY: number
}

type LayerLayout = {
  x: number
  y: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  rotate: number
  z: number
  opacity: number
}

type VisualLayer = KitchenIngredient & {
  visualKey: string
  layout: LayerLayout
}

const initialSelectedIds = [
  'ingredient-252',
  'ingredient-260',
  'ingredient-001',
  'ingredient-026',
  'ingredient-350',
  'ingredient-104',
  'ingredient-118',
  'ingredient-177',
]

const presets = [
  {
    id: 'classic',
    name: '经典牛肉',
    ids: ['ingredient-252', 'ingredient-260', 'ingredient-001', 'ingredient-026', 'ingredient-350', 'ingredient-104', 'ingredient-118', 'ingredient-177'],
  },
  {
    id: 'double',
    name: '双层芝士',
    ids: ['ingredient-325', 'ingredient-331', 'ingredient-001', 'ingredient-003', 'ingredient-026', 'ingredient-027', 'ingredient-350', 'ingredient-360', 'ingredient-373'],
  },
  {
    id: 'garden',
    name: '蔬菜满层',
    ids: ['ingredient-254', 'ingredient-262', 'ingredient-066', 'ingredient-067', 'ingredient-104', 'ingredient-118', 'ingredient-126', 'ingredient-140', 'ingredient-184'],
  },
]

const kindLabels: Record<LayerKind, string> = {
  bunTop: '面包顶',
  bunBottom: '面包底',
  base: '基础',
  protein: '主体',
  cheese: '芝士',
  vegetable: '蔬菜',
  sauce: '酱料',
  extra: '加料',
  seasoning: '调味',
  side: '配菜',
  other: '其他',
}

const kindClassNames: Record<LayerKind, string> = {
  bunTop: 'bun-top',
  bunBottom: 'bun-bottom',
  base: 'base',
  protein: 'protein',
  cheese: 'cheese',
  vegetable: 'vegetable',
  sauce: 'sauce',
  extra: 'extra',
  seasoning: 'seasoning',
  side: 'side',
  other: 'other',
}

const kindColors: Record<LayerKind, string> = {
  bunTop: '#d9822b',
  bunBottom: '#bf6b27',
  base: '#d79a4a',
  protein: '#6a2d19',
  cheese: '#f4b934',
  vegetable: '#78a94a',
  sauce: '#d94b32',
  extra: '#c56b45',
  seasoning: '#9d704c',
  side: '#d98a2e',
  other: '#c86a62',
}

const categoryHints: Record<string, string> = {
  肉类与肉饼: '肉饼、鸡排、鱼排和其他主体。',
  芝士与鸡蛋: '芝士、煎蛋和柔软夹层。',
  蔬菜与香草: '清爽叶菜、香草和鲜蔬。',
  切片配料: '番茄、酸黄瓜、洋葱等切片。',
  配菜与小食: '脆口小食，也能直接叠进去。',
  酱料: '汉堡的酸甜咸辣。',
  调味料与酱料: '碎料、调味和抹酱。',
  面包与基础食材: '面包顶、面包底和底层基础。',
  汉堡配料综合: '适合直接组装的综合素材。',
}

const layerBand: Record<LayerKind, Omit<LayerLayout, 'x' | 'y' | 'z' | 'rotate' | 'opacity'>> = {
  bunTop: { width: 88, height: 118, scaleX: 1, scaleY: 1 },
  bunBottom: { width: 88, height: 92, scaleX: 1, scaleY: 1 },
  base: { width: 84, height: 80, scaleX: 1, scaleY: 0.78 },
  protein: { width: 83, height: 92, scaleX: 1, scaleY: 0.86 },
  cheese: { width: 78, height: 68, scaleX: 1.04, scaleY: 0.62 },
  vegetable: { width: 76, height: 62, scaleX: 1, scaleY: 0.62 },
  sauce: { width: 70, height: 54, scaleX: 1.26, scaleY: 0.36 },
  extra: { width: 72, height: 66, scaleX: 1, scaleY: 0.68 },
  seasoning: { width: 56, height: 46, scaleX: 0.86, scaleY: 0.5 },
  side: { width: 66, height: 64, scaleX: 0.92, scaleY: 0.62 },
  other: { width: 64, height: 58, scaleX: 0.9, scaleY: 0.62 },
}

const kindStackOrder: Record<LayerKind, number> = {
  bunBottom: 0,
  base: 1,
  protein: 2,
  cheese: 3,
  extra: 4,
  vegetable: 5,
  side: 6,
  seasoning: 7,
  sauce: 8,
  other: 9,
  bunTop: 10,
}

function getLayerKind(ingredient: PixelIngredient): LayerKind {
  const { category, name } = ingredient

  if (name.includes('面包顶') || name.includes('汉堡胚顶')) return 'bunTop'
  if (name.includes('面包底') || name.includes('汉堡胚底')) return 'bunBottom'

  const breadLike = /面包|汉堡胚|吐司|贝果|法棍|热狗|可颂|华夫|皮塔|薄饼/.test(name)
  if (breadLike && !/肉饼|蛋饼|煎饼/.test(name)) return 'base'

  if (/鸡蛋|煎蛋|荷包蛋|培根|火腿|香肠/.test(name)) return 'extra'
  if (/芝士|奶酪|起司|切达|马苏里拉|美式芝士|布里|瑞士/.test(name)) return 'cheese'

  if (/酱料/.test(category) || /酱|芥末|蛋黄酱|美乃滋|黄油|沙拉|莎莎|蘸/.test(name)) return 'sauce'

  if (/肉类|肉饼/.test(category) || /牛肉|鸡|鱼|虾|猪|肉饼|肉排|排|鳕鱼|三文鱼|金枪鱼|豆饼|素肉|蘑菇肉饼|豆腐排/.test(name)) {
    return 'protein'
  }

  if (/调味/.test(category) || /盐|胡椒|粉|籽|香料|调味|碎|丁|芝麻|葱花|蒜/.test(name)) return 'seasoning'

  if (/蔬菜|香草|切片配料/.test(category) || /生菜|番茄|洋葱|黄瓜|辣椒|蘑菇|菇|牛油果|菠萝|橄榄|胡萝卜|卷心菜|甘蓝|萝卜|芦笋|玉米|香菜|罗勒/.test(name)) {
    return 'vegetable'
  }

  if (/配菜|小食/.test(category) || /薯|洋葱圈|脆片|炸|球|块|圈|薯条/.test(name)) return 'side'

  return 'other'
}

function decorateIngredient(ingredient: PixelIngredient): KitchenIngredient {
  const kind = getLayerKind(ingredient)

  return {
    ...ingredient,
    kind,
    color: kindColors[kind],
  }
}

const kitchenIngredients = pixelIngredients.map(decorateIngredient)
const ingredientById = new Map(kitchenIngredients.map((ingredient) => [ingredient.id, ingredient]))

const atlasGroups = Array.from(
  kitchenIngredients.reduce((map, ingredient) => {
    const group = map.get(ingredient.category)
    if (group) {
      group.push(ingredient)
    } else {
      map.set(ingredient.category, [ingredient])
    }
    return map
  }, new Map<string, KitchenIngredient[]>()),
).map(([category, items]) => ({ category, items }))

function groupIngredients(items: KitchenIngredient[]) {
  const grouped = new Map<string, KitchenIngredient[]>()
  items.forEach((ingredient) => {
    const group = grouped.get(ingredient.category)
    if (group) {
      group.push(ingredient)
    } else {
      grouped.set(ingredient.category, [ingredient])
    }
  })

  return Array.from(grouped).map(([category, groupItems]) => ({ category, items: groupItems }))
}

function sortForStack(a: KitchenIngredient, b: KitchenIngredient) {
  const byKind = kindStackOrder[a.kind] - kindStackOrder[b.kind]
  if (byKind !== 0) return byKind
  return a.index - b.index
}

function getKindPosition(index: number, total: number) {
  if (total <= 1) return 0
  return index - (total - 1) / 2
}

function getLayerLayout(layer: KitchenIngredient, indexInKind: number, totalInKind: number, globalIndex: number, totalLayers: number): LayerLayout {
  const base = layerBand[layer.kind]
  const crowd = Math.max(0, totalLayers - 16)
  const compact = Math.min(28, crowd * 1.35)
  const kindPosition = getKindPosition(indexInKind, totalInKind)
  const lane = globalIndex % 7
  const wave = ((lane % 3) - 1) * 5
  const microShift = totalLayers > 44 ? ((globalIndex % 9) - 4) * 3 : wave
  const opacity = totalLayers > 90 ? 0.82 : totalLayers > 52 ? 0.9 : 1

  if (layer.kind === 'bunTop') {
    return {
      ...base,
      x: kindPosition * 8,
      y: 30 + indexInKind * 10,
      rotate: kindPosition * 2,
      z: 420 + indexInKind,
      opacity,
    }
  }

  if (layer.kind === 'bunBottom') {
    return {
      ...base,
      x: kindPosition * 8,
      y: 288 - Math.min(indexInKind, 5) * 5,
      rotate: kindPosition * -1.4,
      z: 25 + indexInKind,
      opacity,
    }
  }

  if (layer.kind === 'base') {
    return {
      ...base,
      x: kindPosition * 9,
      y: 268 - Math.min(indexInKind, 7) * 8,
      rotate: kindPosition * 1.6,
      z: 45 + indexInKind,
      opacity,
    }
  }

  const bandY: Record<Exclude<LayerKind, 'bunTop' | 'bunBottom' | 'base'>, number> = {
    protein: 236,
    cheese: 202,
    extra: 174,
    vegetable: 150,
    side: 166,
    seasoning: 132,
    sauce: 116,
    other: 184,
  }

  const layerStep = layer.kind === 'protein' ? 18 : layer.kind === 'cheese' ? 14 : layer.kind === 'sauce' ? 10 : 12
  const compressedStep = Math.max(4, layerStep - compact * 0.22)
  const y = bandY[layer.kind] - kindPosition * compressedStep + Math.sin(globalIndex * 1.2) * 3
  const width = Math.max(34, base.width - Math.max(0, totalLayers - 28) * 0.16)

  return {
    ...base,
    width,
    x: microShift + kindPosition * 2.5,
    y,
    rotate: ((globalIndex % 5) - 2) * (totalLayers > 34 ? 1.3 : 0.9),
    z: 90 + kindStackOrder[layer.kind] * 24 + indexInKind,
    opacity,
  }
}

function getVisualLayers(selected: Set<string>): VisualLayer[] {
  const selectedIngredients = kitchenIngredients.filter((ingredient) => selected.has(ingredient.id)).sort(sortForStack)
  const totalsByKind = selectedIngredients.reduce((map, ingredient) => {
    map.set(ingredient.kind, (map.get(ingredient.kind) ?? 0) + 1)
    return map
  }, new Map<LayerKind, number>())
  const indexesByKind = new Map<LayerKind, number>()

  return selectedIngredients.map((ingredient, globalIndex) => {
    const indexInKind = indexesByKind.get(ingredient.kind) ?? 0
    indexesByKind.set(ingredient.kind, indexInKind + 1)

    return {
      ...ingredient,
      visualKey: `${ingredient.id}-${globalIndex}`,
      layout: getLayerLayout(ingredient, indexInKind, totalsByKind.get(ingredient.kind) ?? 1, globalIndex, selectedIngredients.length),
    }
  })
}

function getPreviewTitle(selectedItems: KitchenIngredient[]) {
  if (selectedItems.length === 0) return '空盘待命'

  const hasTop = selectedItems.some((ingredient) => ingredient.kind === 'bunTop')
  const hasBottom = selectedItems.some((ingredient) => ingredient.kind === 'bunBottom')
  const proteins = selectedItems.filter((ingredient) => ingredient.kind === 'protein').length
  const sauces = selectedItems.filter((ingredient) => ingredient.kind === 'sauce').length

  if (hasTop && hasBottom && proteins >= 2) return '多层自选汉堡'
  if (hasTop && hasBottom && sauces >= 2) return '重酱像素汉堡'
  if (hasTop && hasBottom) return '自选像素汉堡'
  if (proteins > 0) return '开放式汉堡'
  return '自由食材叠叠堡'
}

export default function BurgerKitchen() {
  const [selected, setSelected] = useState(() => new Set(initialSelectedIds))
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [showSelectedOnly, setShowSelectedOnly] = useState(false)
  const [layerOffsets, setLayerOffsets] = useState<Record<string, LayerOffset>>({})
  const [layerDepths, setLayerDepths] = useState<Record<string, number>>({})
  const [dragState, setDragState] = useState<DragState | null>(null)
  const depthCounter = useRef(500)

  const selectedIngredients = useMemo(
    () => kitchenIngredients.filter((ingredient) => selected.has(ingredient.id)),
    [selected],
  )

  const visibleIngredients = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('zh-CN')

    return kitchenIngredients.filter((ingredient) => {
      const inCategory = activeCategory === 'all' || ingredient.category === activeCategory
      const inSearch =
        needle.length === 0 ||
        ingredient.name.toLocaleLowerCase('zh-CN').includes(needle) ||
        ingredient.category.toLocaleLowerCase('zh-CN').includes(needle) ||
        kindLabels[ingredient.kind].toLocaleLowerCase('zh-CN').includes(needle)
      const inSelection = !showSelectedOnly || selected.has(ingredient.id)

      return inCategory && inSearch && inSelection
    })
  }, [activeCategory, query, selected, showSelectedOnly])

  const visibleGroups = useMemo(() => groupIngredients(visibleIngredients), [visibleIngredients])
  const visualLayers = useMemo(() => getVisualLayers(selected), [selected])
  const previewTitle = useMemo(() => getPreviewTitle(selectedIngredients), [selectedIngredients])
  const kindCounts = useMemo(
    () =>
      selectedIngredients.reduce((map, ingredient) => {
        map.set(ingredient.kind, (map.get(ingredient.kind) ?? 0) + 1)
        return map
      }, new Map<LayerKind, number>()),
    [selectedIngredients],
  )

  function toggleIngredient(ingredient: KitchenIngredient) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(ingredient.id)) {
        next.delete(ingredient.id)
      } else {
        next.add(ingredient.id)
      }
      return next
    })
  }

  function addVisibleIngredients() {
    setSelected((current) => {
      const next = new Set(current)
      visibleIngredients.forEach((ingredient) => next.add(ingredient.id))
      return next
    })
  }

  function clearBasket() {
    setSelected(new Set())
    resetLayerLayout()
  }

  function applyPreset(ids: string[]) {
    setSelected(new Set(ids.filter((id) => ingredientById.has(id))))
    resetLayerLayout()
  }

  function resetLayerLayout() {
    setLayerOffsets({})
    setLayerDepths({})
    setDragState(null)
    depthCounter.current = 500
  }

  function bringLayerToFront(key: string) {
    depthCounter.current += 1
    setLayerDepths((current) => ({ ...current, [key]: depthCounter.current }))
  }

  function startLayerDrag(event: PointerEvent<HTMLDivElement>, key: string) {
    if (event.button !== 0) return

    const stage = event.currentTarget.closest('.dish-stage')
    if (!(stage instanceof HTMLElement)) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    bringLayerToFront(key)

    const origin = layerOffsets[key] ?? { x: 0, y: 0 }
    const stageRect = stage.getBoundingClientRect()
    const layerRect = event.currentTarget.getBoundingClientRect()
    const padding = 8

    setDragState({
      key,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: origin.x,
      originY: origin.y,
      minX: origin.x + stageRect.left + padding - layerRect.left,
      maxX: origin.x + stageRect.right - padding - layerRect.right,
      minY: origin.y + stageRect.top + padding - layerRect.top,
      maxY: origin.y + stageRect.bottom - padding - layerRect.bottom,
    })
  }

  function moveLayer(event: PointerEvent<HTMLDivElement>, key: string) {
    if (!dragState || dragState.key !== key || dragState.pointerId !== event.pointerId) return

    event.preventDefault()
    const nextX = Math.min(dragState.maxX, Math.max(dragState.minX, dragState.originX + event.clientX - dragState.startX))
    const nextY = Math.min(dragState.maxY, Math.max(dragState.minY, dragState.originY + event.clientY - dragState.startY))

    setLayerOffsets((current) => ({ ...current, [key]: { x: nextX, y: nextY } }))
  }

  function finishLayerDrag(event: PointerEvent<HTMLDivElement>, key: string) {
    if (!dragState || dragState.key !== key || dragState.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setDragState(null)
  }

  function nudgeLayer(event: KeyboardEvent<HTMLDivElement>, key: string) {
    const amount = event.shiftKey ? 12 : 4
    const delta =
      event.key === 'ArrowLeft'
        ? { x: -amount, y: 0 }
        : event.key === 'ArrowRight'
          ? { x: amount, y: 0 }
          : event.key === 'ArrowUp'
            ? { x: 0, y: -amount }
            : event.key === 'ArrowDown'
              ? { x: 0, y: amount }
              : null

    if (event.key === 'Escape' || event.key === 'Home') {
      event.preventDefault()
      setLayerOffsets((current) => ({ ...current, [key]: { x: 0, y: 0 } }))
      return
    }

    if (!delta) return
    event.preventDefault()
    bringLayerToFront(key)
    setLayerOffsets((current) => {
      const origin = current[key] ?? { x: 0, y: 0 }
      return {
        ...current,
        [key]: {
          x: Math.min(120, Math.max(-120, origin.x + delta.x)),
          y: Math.min(120, Math.max(-120, origin.y + delta.y)),
        },
      }
    })
  }

  return (
    <section className="kitchen kitchen-refined" id="basket">
      <div className="ingredient-panel full-pantry-panel">
        <div className="panel-heading refined-heading">
          <div>
            <p className="eyebrow">BUILD YOUR BURGER</p>
            <h2>全部食材</h2>
          </div>
          <button type="button" onClick={() => applyPreset(initialSelectedIds)}>
            默认
          </button>
        </div>

        <div className="pantry-toolbar">
          <input
            aria-label="搜索食材"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索食材"
            type="search"
            value={query}
          />
          <div className="pantry-actions">
            <button aria-pressed={showSelectedOnly} className={showSelectedOnly ? 'active' : ''} onClick={() => setShowSelectedOnly((current) => !current)} type="button">
              已选
            </button>
            <button onClick={addVisibleIngredients} type="button">
              加入当前
            </button>
            <button onClick={clearBasket} type="button">
              清空
            </button>
          </div>
        </div>

        <div className="category-filter" aria-label="食材分类">
          <button aria-pressed={activeCategory === 'all'} className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')} type="button">
            全部
            <span>{kitchenIngredients.length}</span>
          </button>
          {atlasGroups.map((group) => (
            <button
              aria-pressed={activeCategory === group.category}
              className={activeCategory === group.category ? 'active' : ''}
              key={group.category}
              onClick={() => setActiveCategory(group.category)}
              type="button"
            >
              {group.category}
              <span>{group.items.length}</span>
            </button>
          ))}
        </div>

        <div className="pantry-count-row">
          <span>显示 {visibleIngredients.length} 种</span>
          <span>已放入 {selectedIngredients.length} 种</span>
        </div>

        <div className="all-ingredient-groups">
          {visibleGroups.length === 0 ? (
            <p className="empty-stack empty-pantry">没有找到这个食材。</p>
          ) : (
            visibleGroups.map((group) => (
              <section className="ingredient-group ingredient-group-full" key={group.category}>
                <div className="ingredient-group-heading">
                  <h3>{group.category}</h3>
                  <p>{categoryHints[group.category] ?? '来自食材贴图表的可用素材。'}</p>
                  <span>{group.items.length}</span>
                </div>
                <div className="ingredient-chips all-ingredient-grid">
                  {group.items.map((ingredient) => {
                    const active = selected.has(ingredient.id)
                    return (
                      <button
                        aria-pressed={active}
                        className={active ? 'ingredient-chip active' : 'ingredient-chip'}
                        key={ingredient.id}
                        onClick={() => toggleIngredient(ingredient)}
                        style={{ '--chip-color': ingredient.color } as CSSProperties}
                        title={`${ingredient.name} / ${kindLabels[ingredient.kind]}`}
                        type="button"
                      >
                        <Image
                          alt=""
                          aria-hidden="true"
                          className="ingredient-chip-art"
                          height={52}
                          src={ingredient.image}
                          unoptimized
                          width={72}
                        />
                        <span className="ingredient-chip-label">{ingredient.name}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      <aside className="burger-preview" aria-label="当前汉堡预览">
        <div className="preview-card refined-preview-card">
          <p className="eyebrow">FRESHLY BUILT</p>
          <h2>{previewTitle}</h2>
          <div className={visualLayers.length > 42 ? 'dish-stage crowded-stage' : 'dish-stage'}>
            <div className="stage-toolbar">
              <span>{visualLayers.length} 层</span>
              <button type="button" onClick={resetLayerLayout}>
                恢复整齐
              </button>
            </div>
            <div className="plate-glow" />
            {visualLayers.length === 0 ? (
              <p className="empty-stack">先放入食材。</p>
            ) : (
              <div className="crafted-burger" aria-label="可拖动食材的汉堡工作区">
                {visualLayers.map((layer, index) => {
                  const offset = layerOffsets[layer.visualKey] ?? { x: 0, y: 0 }
                  const isDragging = dragState?.key === layer.visualKey

                  return (
                    <div
                      aria-label={`拖动${layer.name}`}
                      className={`visual-layer draggable-layer has-sprite visual-kind-${kindClassNames[layer.kind]} ${isDragging ? 'is-dragging' : ''}`}
                      key={layer.visualKey}
                      onKeyDown={(event) => nudgeLayer(event, layer.visualKey)}
                      onPointerCancel={(event) => finishLayerDrag(event, layer.visualKey)}
                      onPointerDown={(event) => startLayerDrag(event, layer.visualKey)}
                      onPointerMove={(event) => moveLayer(event, layer.visualKey)}
                      onPointerUp={(event) => finishLayerDrag(event, layer.visualKey)}
                      role="button"
                      style={
                        {
                          '--layer-color': layer.color,
                          '--delay': `${Math.min(index * 18, 560)}ms`,
                          '--drag-x': `${offset.x}px`,
                          '--drag-y': `${offset.y}px`,
                          '--layer-x': `${layer.layout.x}px`,
                          '--layer-y': `${layer.layout.y}px`,
                          '--layer-width': `${layer.layout.width}%`,
                          '--layer-height': `${layer.layout.height}px`,
                          '--layer-scale-x': layer.layout.scaleX,
                          '--layer-scale-y': layer.layout.scaleY,
                          '--layer-rotate': `${layer.layout.rotate}deg`,
                          '--layer-opacity': layer.layout.opacity,
                          zIndex: layerDepths[layer.visualKey] ?? layer.layout.z,
                        } as CSSProperties
                      }
                      tabIndex={0}
                    >
                      <Image
                        alt=""
                        aria-hidden="true"
                        className="sprite-layer-image"
                        draggable={false}
                        height={130}
                        src={layer.image}
                        unoptimized
                        width={280}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="preview-meta">
            <p>
              已放入 <strong>{selectedIngredients.length}</strong> 种食材，当前 <strong>{visualLayers.length}</strong> 层都可以拖动。
            </p>
            <div className="selected-mini-list">
              {selectedIngredients.slice(0, 16).map((ingredient) => (
                <span key={ingredient.id}>{ingredient.name}</span>
              ))}
              {selectedIngredients.length > 16 ? <span>+{selectedIngredients.length - 16}</span> : null}
            </div>
          </div>
        </div>
      </aside>

      <div className="recipes build-summary" id="recipes">
        <div className="panel-heading refined-heading">
          <div>
            <p className="eyebrow">QUICK BUILDS</p>
            <h2>搭配面板</h2>
          </div>
          <span>{selectedIngredients.length} / {kitchenIngredients.length}</span>
        </div>

        <div className="preset-row" aria-label="快捷搭配">
          {presets.map((preset) => (
            <button key={preset.id} onClick={() => applyPreset(preset.ids)} type="button">
              {preset.name}
            </button>
          ))}
        </div>

        <div className="kind-summary-grid">
          {(Object.keys(kindLabels) as LayerKind[]).map((kind) => (
            <div className="kind-summary-card" key={kind} style={{ '--chip-color': kindColors[kind] } as CSSProperties}>
              <span>{kindLabels[kind]}</span>
              <strong>{kindCounts.get(kind) ?? 0}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="ingredient-atlas" id="atlas">
        <div className="panel-heading refined-heading">
          <div>
            <p className="eyebrow">PIXEL PANTRY</p>
            <h2>汉堡食材图鉴</h2>
          </div>
          <span>{pixelIngredients.length} 枚素材</span>
        </div>

        <p className="atlas-intro">
          按食材贴图表.xlsx 的行顺序导入，名称与图片逐行对应。每个素材都保留透明背景，可用于汉堡组装、食材图鉴和创意配方。
        </p>

        {atlasGroups.map((group) => (
          <section className="atlas-group" key={group.category}>
            <div className="atlas-group-heading">
              <h3>{group.category}</h3>
              <span>{group.items.length} 枚</span>
            </div>
            <div className="atlas-grid">
              {group.items.map((item) => (
                <article className="atlas-card" key={`${item.id}-${item.sheet}-${item.index}`}>
                  <div className="atlas-art">
                    <Image alt={item.name} height={120} src={item.image} unoptimized width={150} />
                  </div>
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <span>#{item.index}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
