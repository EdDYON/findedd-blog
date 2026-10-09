'use client'

import Image from 'next/image'
import { Check, ChevronRight, Plus, Refrigerator, RotateCcw, Search, Sparkles, Trash2, X } from 'lucide-react'
import type { CSSProperties, DragEvent, KeyboardEvent, PointerEvent } from 'react'
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

type DrawerId = 'bread' | 'protein' | 'cheese' | 'vegetable' | 'sauce' | 'side' | 'all'

type KitchenIngredient = PixelIngredient & {
  kind: LayerKind
  color: string
}

type PantryDrawer = {
  id: DrawerId
  name: string
  shortName: string
  summary: string
  hint: string
  color: string
  match: (ingredient: KitchenIngredient) => boolean
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

  if (name.includes('面包顶') || name.includes('汉堡胚顶') || name.includes('包顶')) return 'bunTop'
  if (name.includes('面包底') || name.includes('汉堡胚底') || name.includes('包底')) return 'bunBottom'

  const breadLike = /面包|汉堡胚|吐司|贝果|法棍|热狗|可颂|华夫|皮塔|薄饼|松饼|馒头|面饼/.test(name)
  if (breadLike && !/肉饼|鸡排|鱼排|蔬菜饼|煎饼/.test(name)) return 'base'

  if (/芝士|奶酪|起司|切达|马苏里拉|帕玛森|普罗沃洛内|瑞士|蓝纹|胡椒杰克/.test(name)) return 'cheese'
  if (/酱料/.test(category) || /酱|芥末|蛋黄酱|番茄酱|牧场|千岛|莎莎|青酱|黄油|蜂蜜|辣酱|塔塔/.test(name)) return 'sauce'
  if (/肉类|肉饼/.test(category) || /牛肉|鸡胸|鸡排|鱼排|虾|蟹|猪肉|羊肉|三文鱼|金枪鱼|火鸡|培根|香肠|素肉|豆饼|蔬菜饼|蘑菇肉饼/.test(name)) return 'protein'
  if (/鸡蛋|煎蛋|荷包蛋|培根|火腿|香肠/.test(name)) return 'extra'
  if (/调味/.test(category) || /盐|黑胡椒|辣椒粉|香料|芝麻|葱花|蒜|洋葱碎|调味/.test(name)) return 'seasoning'
  if (/蔬菜|香草|切片配料/.test(category) || /生菜|番茄|洋葱|黄瓜|辣椒|蘑菇|牛油果|菠萝|橄榄|菠菜|芝麻菜|胡萝卜|卷心菜|玉米|香菜|酸黄瓜|萝卜/.test(name)) return 'vegetable'
  if (/配菜|小食/.test(category) || /薯|洋葱圈|脆片|卷心菜沙拉|沙拉|豌豆|玉米粒|炸/.test(name)) return 'side'

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

const pantryDrawers: PantryDrawer[] = [
  {
    id: 'bread',
    name: '面包抽屉',
    shortName: '面包',
    summary: '面包与基础',
    hint: '先选上下胚，也可以只放底胚做开放式汉堡。',
    color: '#e6a35f',
    match: (ingredient) => ['bunTop', 'bunBottom', 'base'].includes(ingredient.kind) || ingredient.category.includes('面包'),
  },
  {
    id: 'protein',
    name: '肉类抽屉',
    shortName: '肉类',
    summary: '肉饼、鸡排、鱼排',
    hint: '这里决定汉堡的主体，素肉和蔬菜饼也归在这一层。',
    color: '#98624a',
    match: (ingredient) => ingredient.kind === 'protein' || ingredient.category.includes('肉类'),
  },
  {
    id: 'cheese',
    name: '芝士抽屉',
    shortName: '芝士',
    summary: '芝士与鸡蛋',
    hint: '芝士片、软芝士和鸡蛋都放在这里，适合补一层口感。',
    color: '#f5be3d',
    match: (ingredient) => ingredient.kind === 'cheese' || ingredient.category.includes('芝士'),
  },
  {
    id: 'vegetable',
    name: '蔬菜抽屉',
    shortName: '蔬菜',
    summary: '叶菜、切片、香草',
    hint: '番茄、洋葱、生菜、酸黄瓜和香草都在这里。',
    color: '#86aa58',
    match: (ingredient) => ingredient.kind === 'vegetable' || ingredient.category.includes('蔬菜') || ingredient.category.includes('切片'),
  },
  {
    id: 'sauce',
    name: '酱料抽屉',
    shortName: '酱料',
    summary: '酱料与调味',
    hint: '番茄酱、芥末、BBQ 和各种调味酱都可以直接叠进去。',
    color: '#d76645',
    match: (ingredient) => ingredient.kind === 'sauce' || ingredient.kind === 'seasoning' || ingredient.category.includes('酱料') || ingredient.category.includes('调味'),
  },
  {
    id: 'side',
    name: '小食配料抽屉',
    shortName: '小食',
    summary: '配菜、加料、小点',
    hint: '薯条、洋葱圈、沙拉、培根、菠萝和其他奇妙加料都丢到这里。',
    color: '#db8050',
    match: (ingredient) => ingredient.kind === 'side' || ingredient.kind === 'extra' || ingredient.kind === 'other' || ingredient.category.includes('配菜'),
  },
  {
    id: 'all',
    name: '全部食材 / 搜索',
    shortName: '全部',
    summary: '381 种全部可选',
    hint: '需要精确找东西时可以打开全局搜索，也可以在这里慢慢翻完整冰箱。',
    color: '#f71918',
    match: () => true,
  },
]

const pantryDrawerViews = pantryDrawers.map((drawer) => ({
  ...drawer,
  items: kitchenIngredients.filter(drawer.match),
}))

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
      visualKey: ingredient.id,
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
  const [activeDrawerId, setActiveDrawerId] = useState<DrawerId>('bread')
  const [query, setQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [recentlyTouchedId, setRecentlyTouchedId] = useState<string | null>(null)
  const [draggedIngredientId, setDraggedIngredientId] = useState<string | null>(null)
  const [isDishDropHot, setIsDishDropHot] = useState(false)
  const [isDishPulsing, setIsDishPulsing] = useState(false)
  const [layerOffsets, setLayerOffsets] = useState<Record<string, LayerOffset>>({})
  const [layerDepths, setLayerDepths] = useState<Record<string, number>>({})
  const [dragState, setDragState] = useState<DragState | null>(null)
  const depthCounter = useRef(500)

  const selectedIngredients = useMemo(() => {
    const items: KitchenIngredient[] = []
    selected.forEach((id) => {
      const ingredient = ingredientById.get(id)
      if (ingredient) items.push(ingredient)
    })
    return items
  }, [selected])

  const activeDrawer = useMemo(
    () => pantryDrawerViews.find((drawer) => drawer.id === activeDrawerId) ?? pantryDrawerViews[0],
    [activeDrawerId],
  )

  const searchResults = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('zh-CN')

    if (needle.length === 0) return kitchenIngredients

    return kitchenIngredients.filter(
      (ingredient) =>
        ingredient.name.toLocaleLowerCase('zh-CN').includes(needle) ||
        ingredient.category.toLocaleLowerCase('zh-CN').includes(needle) ||
        kindLabels[ingredient.kind].toLocaleLowerCase('zh-CN').includes(needle),
    )
  }, [query])

  const searchGroups = useMemo(() => groupIngredients(searchResults), [searchResults])
  const visualLayers = useMemo(() => getVisualLayers(selected), [selected])
  const previewTitle = useMemo(() => getPreviewTitle(selectedIngredients), [selectedIngredients])
  const activeDrawerSelectedCount = activeDrawer.items.filter((ingredient) => selected.has(ingredient.id)).length
  const kindCounts = useMemo(
    () =>
      selectedIngredients.reduce((map, ingredient) => {
        map.set(ingredient.kind, (map.get(ingredient.kind) ?? 0) + 1)
        return map
      }, new Map<LayerKind, number>()),
    [selectedIngredients],
  )

  function flashIngredient(id: string) {
    setRecentlyTouchedId(id)
    window.setTimeout(() => {
      setRecentlyTouchedId((current) => (current === id ? null : current))
    }, 520)
  }

  function flashDish() {
    setIsDishPulsing(false)
    window.requestAnimationFrame(() => setIsDishPulsing(true))
    window.setTimeout(() => setIsDishPulsing(false), 560)
  }

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
    flashIngredient(ingredient.id)
  }

  function addIngredient(ingredient: KitchenIngredient) {
    setSelected((current) => {
      if (current.has(ingredient.id)) return current
      const next = new Set(current)
      next.add(ingredient.id)
      return next
    })
    flashIngredient(ingredient.id)
  }

  function addActiveDrawerIngredients() {
    setSelected((current) => {
      const next = new Set(current)
      activeDrawer.items.forEach((ingredient) => next.add(ingredient.id))
      return next
    })
    if (activeDrawer.items[0]) flashIngredient(activeDrawer.items[0].id)
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

  function openSearch() {
    setIsSearchOpen(true)
  }

  function closeSearch() {
    setIsSearchOpen(false)
  }

  function startIngredientDrag(event: DragEvent<HTMLElement>, ingredient: KitchenIngredient) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('text/plain', ingredient.id)
    setDraggedIngredientId(ingredient.id)
  }

  function finishIngredientDrag() {
    setDraggedIngredientId(null)
    setIsDishDropHot(false)
  }

  function handleDishDragOver(event: DragEvent<HTMLDivElement>) {
    if (!draggedIngredientId) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    setIsDishDropHot(true)
  }

  function handleDishDragLeave(event: DragEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setIsDishDropHot(false)
    }
  }

  function handleDishDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const ingredientId = event.dataTransfer.getData('text/plain')
    const ingredient = ingredientById.get(ingredientId)
    if (ingredient) {
      addIngredient(ingredient)
      flashDish()
    }
    setDraggedIngredientId(null)
    setIsDishDropHot(false)
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

  function handleSearchKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') closeSearch()
  }

  function renderIngredientCard(ingredient: KitchenIngredient, mode: 'drawer' | 'search') {
    const active = selected.has(ingredient.id)
    const touched = recentlyTouchedId === ingredient.id

    return (
      <button
        aria-pressed={active}
        className={`ingredient-card ingredient-card-${mode} ${active ? 'is-selected' : ''} ${touched ? 'is-touched' : ''}`}
        draggable
        key={`${mode}-${ingredient.id}`}
        onClick={() => toggleIngredient(ingredient)}
        onDragEnd={finishIngredientDrag}
        onDragStart={(event) => startIngredientDrag(event, ingredient)}
        style={{ '--chip-color': ingredient.color } as CSSProperties}
        title={`${ingredient.name} / ${kindLabels[ingredient.kind]}`}
        type="button"
      >
        <span className="ingredient-card-art">
          <Image alt="" aria-hidden="true" height={58} src={ingredient.image} unoptimized width={78} />
        </span>
        <span className="ingredient-card-copy">
          <strong>{ingredient.name}</strong>
          <small>{kindLabels[ingredient.kind]}</small>
        </span>
        <span className="ingredient-card-state" aria-hidden="true">
          {active ? <Check size={16} strokeWidth={3.2} /> : <Plus size={16} strokeWidth={3.2} />}
        </span>
      </button>
    )
  }

  return (
    <section className="kitchen kitchen-refined kitchen-drawer-mode" id="basket">
      <div className="ingredient-panel fridge-panel">
        <div className="panel-heading refined-heading">
          <div>
            <p className="eyebrow">BUILD YOUR BURGER</p>
            <h2>冰箱抽屉</h2>
          </div>
          <div className="panel-title-actions">
            <button type="button" onClick={() => applyPreset(initialSelectedIds)}>
              <RotateCcw aria-hidden="true" size={17} strokeWidth={3} />
              默认
            </button>
            <button type="button" onClick={openSearch}>
              <Search aria-hidden="true" size={17} strokeWidth={3} />
              搜索
            </button>
          </div>
        </div>

        <section className="prep-tray" aria-label="当前备料盘">
          <div className="prep-tray-head">
            <div>
              <p>PREP TRAY</p>
              <h3>备料盘</h3>
            </div>
            <div className="prep-tray-actions">
              <span>{selectedIngredients.length} / {kitchenIngredients.length}</span>
              <button type="button" onClick={clearBasket}>
                <Trash2 aria-hidden="true" size={16} strokeWidth={3} />
                清空
              </button>
            </div>
          </div>
          <div className="prep-tray-strip">
            {selectedIngredients.length === 0 ? (
              <p className="empty-tray">点击抽屉里的食材加入备料盘，也可以把食材拖到右侧汉堡里。</p>
            ) : (
              selectedIngredients.map((ingredient) => (
                <button
                  aria-label={`移除 ${ingredient.name}`}
                  className={`tray-item ${recentlyTouchedId === ingredient.id ? 'is-touched' : ''}`}
                  draggable
                  key={ingredient.id}
                  onClick={() => toggleIngredient(ingredient)}
                  onDragEnd={finishIngredientDrag}
                  onDragStart={(event) => startIngredientDrag(event, ingredient)}
                  style={{ '--chip-color': ingredient.color } as CSSProperties}
                  type="button"
                >
                  <Image alt="" aria-hidden="true" height={44} src={ingredient.image} unoptimized width={58} />
                  <span>{ingredient.name}</span>
                  <X aria-hidden="true" size={14} strokeWidth={3.2} />
                </button>
              ))
            )}
          </div>
        </section>

        <div className="fridge-workspace">
          <div className="fridge-drawers" aria-label="冰箱抽屉" role="tablist">
            {pantryDrawerViews.map((drawer) => {
              const active = drawer.id === activeDrawer.id
              const selectedCount = drawer.items.filter((ingredient) => selected.has(ingredient.id)).length

              return (
                <button
                  aria-controls={`drawer-panel-${drawer.id}`}
                  aria-selected={active}
                  className={active ? 'fridge-drawer-button is-active' : 'fridge-drawer-button'}
                  id={`drawer-tab-${drawer.id}`}
                  key={drawer.id}
                  onClick={() => setActiveDrawerId(drawer.id)}
                  role="tab"
                  style={{ '--drawer-color': drawer.color } as CSSProperties}
                  type="button"
                >
                  <span className="drawer-handle" aria-hidden="true">
                    <Refrigerator size={18} strokeWidth={3} />
                  </span>
                  <span className="drawer-copy">
                    <strong>{drawer.name}</strong>
                    <small>{drawer.summary}</small>
                  </span>
                  <span className="drawer-count">{selectedCount}/{drawer.items.length}</span>
                  <ChevronRight className="drawer-arrow" aria-hidden="true" size={16} strokeWidth={3} />
                </button>
              )
            })}
          </div>

          <div
            aria-labelledby={`drawer-tab-${activeDrawer.id}`}
            className="drawer-card"
            id={`drawer-panel-${activeDrawer.id}`}
            key={activeDrawer.id}
            role="tabpanel"
            style={{ '--drawer-color': activeDrawer.color } as CSSProperties}
          >
            <div className="drawer-card-head">
              <div>
                <p>{activeDrawer.summary}</p>
                <h3>{activeDrawer.name}</h3>
                <span>{activeDrawer.hint}</span>
              </div>
              <div className="drawer-card-actions">
                <button type="button" onClick={addActiveDrawerIngredients}>
                  <Plus aria-hidden="true" size={16} strokeWidth={3} />
                  加入当前抽屉
                </button>
                <button type="button" onClick={openSearch}>
                  <Search aria-hidden="true" size={16} strokeWidth={3} />
                  全局搜索
                </button>
              </div>
            </div>

            <div className="drawer-stats-row">
              <span>本抽屉 {activeDrawer.items.length} 种</span>
              <span>已备好 {activeDrawerSelectedCount} 种</span>
              <span>可点击或拖拽</span>
            </div>

            <div className="drawer-shelf">
              {activeDrawer.items.map((ingredient) => renderIngredientCard(ingredient, 'drawer'))}
            </div>
          </div>
        </div>
      </div>

      <aside className="burger-preview" aria-label="当前汉堡预览">
        <div className="preview-card refined-preview-card">
          <p className="eyebrow">FRESHLY BUILT</p>
          <h2>{previewTitle}</h2>
          <div
            className={`${visualLayers.length > 42 ? 'dish-stage crowded-stage' : 'dish-stage'} ${isDishDropHot ? 'is-drop-hot' : ''} ${isDishPulsing ? 'is-drop-pulse' : ''}`}
            onDragLeave={handleDishDragLeave}
            onDragOver={handleDishDragOver}
            onDrop={handleDishDrop}
          >
            <div className="stage-toolbar">
              <span>{visualLayers.length} 层</span>
              <button type="button" onClick={resetLayerLayout}>
                恢复整齐
              </button>
            </div>
            <div className="drop-cue" aria-hidden="true">
              松手加入汉堡
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
            <h2>快捷搭配</h2>
          </div>
          <span>{selectedIngredients.length} / {kitchenIngredients.length}</span>
        </div>

        <div className="preset-row" aria-label="快捷搭配">
          {presets.map((preset) => (
            <button key={preset.id} onClick={() => applyPreset(preset.ids)} type="button">
              <Sparkles aria-hidden="true" size={16} strokeWidth={3} />
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

      {isSearchOpen ? (
        <div
          className="pantry-search-overlay"
          onKeyDown={handleSearchKeyDown}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch()
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pantry-search-title"
        >
          <div className="pantry-search-modal">
            <div className="search-modal-head">
              <div>
                <p className="eyebrow">GLOBAL SEARCH</p>
                <h2 id="pantry-search-title">找食材</h2>
              </div>
              <button aria-label="关闭搜索" type="button" onClick={closeSearch}>
                <X aria-hidden="true" size={22} strokeWidth={3} />
              </button>
            </div>

            <label className="search-input-wrap">
              <Search aria-hidden="true" size={19} strokeWidth={3} />
              <input
                autoFocus
                onChange={(event) => setQuery(event.target.value)}
                placeholder="输入食材名、分类或类型"
                type="search"
                value={query}
              />
            </label>

            <div className="search-results-meta">
              <span>找到 {searchResults.length} 种</span>
              <span>点击加入，再点取消</span>
            </div>

            <div className="search-results">
              {searchGroups.length === 0 ? (
                <p className="empty-stack empty-pantry">没有找到这个食材。</p>
              ) : (
                searchGroups.map((group) => (
                  <section className="search-group" key={group.category}>
                    <div className="search-group-head">
                      <h3>{group.category}</h3>
                      <span>{group.items.length}</span>
                    </div>
                    <div className="search-grid">
                      {group.items.map((ingredient) => renderIngredientCard(ingredient, 'search'))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
