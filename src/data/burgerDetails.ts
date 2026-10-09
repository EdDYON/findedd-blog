import type {
  BurgerFlavor,
  BurgerMainStyle,
  BurgerProtein,
  BurgerRecord,
} from './burgerTypes'

type TasteScore = {
  savory: number
  rich: number
  acid: number
  heat: number
  sweet: number
  crunch: number
}

export type BurgerTasteRating = {
  key: keyof TasteScore
  label: string
  score: number
}

export type BurgerRecipeStep = {
  number: string
  title: string
  meta: string
  description: string
}

const flavorScores: Record<BurgerFlavor, Partial<TasteScore>> = {
  咸香: { savory: 5, rich: 3 },
  浓郁: { savory: 4, rich: 5 },
  麻辣: { savory: 3, heat: 5 },
  甜咸: { savory: 4, sweet: 4 },
  酥脆: { crunch: 5, savory: 3 },
  酸辣: { acid: 4, heat: 4 },
  清爽: { acid: 3, rich: 1 },
  酸香: { acid: 5, savory: 3 },
  香草: { savory: 3, acid: 2 },
  奶香: { rich: 5, sweet: 2 },
  香料: { savory: 4, heat: 2 },
  鲜辣: { savory: 4, heat: 4 },
  烟熏: { savory: 5, rich: 4 },
  甜辣: { sweet: 3, heat: 4 },
  鲜味: { savory: 5, rich: 3 },
  酸甜: { acid: 4, sweet: 4 },
}

const tasteLabels: Array<[keyof TasteScore, string]> = [
  ['savory', '鲜香'],
  ['rich', '浓郁'],
  ['acid', '酸度'],
  ['heat', '辣度'],
  ['sweet', '甜度'],
  ['crunch', '脆感'],
]

type MainCookingGuide = {
  portion: string
  prep: string
  cook: string
}

const mainCookingGuides: Record<BurgerMainStyle, MainCookingGuide> = {
  beef: {
    portion: '牛肉馅 130–150 克',
    prep: '肉馅加 1.5 克盐和少量黑胡椒，轻压成比面包宽 1 厘米的肉饼，中心压浅窝。',
    cook: '平底锅中高火预热 2 分钟，肉饼每面煎 3–4 分钟。',
  },
  'pepper-beef': {
    portion: '牛肉馅 130–150 克',
    prep: '肉馅加入 1.5 克盐和现磨花椒或黑胡椒，轻压成饼，中心压浅窝。',
    cook: '平底锅中高火预热 2 分钟，肉饼每面煎 3–4 分钟。',
  },
  'glazed-chicken': {
    portion: '去骨鸡腿肉 150 克',
    prep: '鸡腿肉拍至约 1.5 厘米厚，擦干后撒少量盐；照烧汁或糖浆汁另放。',
    cook: '平底锅中火每面煎 5–6 分钟，最后 1 分钟刷汁并收浓。',
  },
  'fried-chicken': {
    portion: '去骨鸡腿肉 150 克',
    prep: '鸡腿肉拍平，用盐和黑胡椒腌 15 分钟，依次裹面粉、蛋液和面包糠。',
    cook: '油温保持 170°C，炸 6–8 分钟，中途翻面一次。',
  },
  sausage: {
    portion: '香肠肉 130–150 克',
    prep: '香肠去肠衣后压成肉饼；使用整根香肠时纵向剖开。',
    cook: '平底锅中火每面煎 4–5 分钟，边缘煎至焦黄。',
  },
  'grilled-chicken': {
    portion: '鸡胸或鸡腿肉 150 克',
    prep: '鸡肉拍至厚度均匀，用 1.5 克盐和少量黑胡椒腌 10 分钟。',
    cook: '平底锅中火每面煎 5–6 分钟，出锅后静置 2 分钟。',
  },
  veggie: {
    portion: '蔬菜饼 130–160 克',
    prep: '蔬菜饼压紧至约 1.5 厘米厚，冷藏 10 分钟定型。',
    cook: '平底锅中火加少量油，每面煎 3–4 分钟。',
  },
  falafel: {
    portion: '豆丸子料 130–150 克',
    prep: '豆丸子料压成约 1.5 厘米厚的饼，表面薄刷油。',
    cook: '平底锅中火每面煎 3–4 分钟，或用 170°C 油炸 4–5 分钟。',
  },
  fish: {
    portion: '无刺鱼排 140–160 克',
    prep: '鱼排擦干，撒少量盐和黑胡椒；需要酥壳时薄裹一层面粉。',
    cook: '平底锅中火每面煎 3–4 分钟，只翻面一次。',
  },
  shrimp: {
    portion: '去壳虾仁 140 克',
    prep: '虾仁切碎，加 1 茶匙淀粉和少量盐拌匀，压成饼后冷藏 10 分钟。',
    cook: '平底锅中火每面煎 3 分钟，虾肉完全变色后离火。',
  },
  pork: {
    portion: '猪肉馅 130–150 克',
    prep: '猪肉馅加 1.5 克盐和少量黑胡椒，轻压成饼。',
    cook: '平底锅中火每面煎 4–5 分钟，边缘煎至焦黄。',
  },
  bison: {
    portion: '野牛肉馅 130–150 克',
    prep: '肉馅加 1.5 克盐，轻压成饼，减少反复揉压。',
    cook: '平底锅中高火每面煎 3–4 分钟，出锅后静置 2 分钟。',
  },
  salmon: {
    portion: '三文鱼肉 140–160 克',
    prep: '三文鱼切碎，加 1 茶匙面包糠和少量盐，压成饼后冷藏 10 分钟。',
    cook: '平底锅中火每面煎 3–4 分钟，只翻面一次。',
  },
  coconut: {
    portion: '椰蓉素饼料 140 克',
    prep: '椰蓉素饼料拌匀压实，冷藏 10 分钟定型。',
    cook: '平底锅中火加少量油，每面煎 3–4 分钟。',
  },
  tempeh: {
    portion: '天贝 120–140 克',
    prep: '天贝切成约 1.5 厘米厚，表面薄刷酱汁。',
    cook: '平底锅中火每面煎 2–3 分钟，表面均匀上色。',
  },
  lamb: {
    portion: '羊肉馅 130–150 克',
    prep: '羊肉馅加 1.5 克盐、少量孜然和黑胡椒，轻压成饼。',
    cook: '平底锅中高火每面煎 3–4 分钟，出锅后静置 2 分钟。',
  },
  mixed: {
    portion: '混合肉馅 140–160 克',
    prep: '肉馅加 1.5 克盐和少量黑胡椒，混匀后压成厚度一致的肉饼。',
    cook: '平底锅中火每面煎 4–5 分钟，边缘煎至焦黄。',
  },
}

const safeTemperatures: Record<BurgerProtein, string | null> = {
  牛肉: '中心温度 71°C',
  鸡肉: '中心温度 74°C',
  猪肉: '中心温度 71°C',
  鱼类: '中心温度 63°C',
  海鲜: '中心温度 63°C',
  素食: null,
  羊肉: '中心温度 71°C',
  混合肉: '中心温度 74°C',
  野味: '中心温度 71°C',
}

function clampScore(score: number) {
  return Math.min(5, Math.max(1, score))
}

export function getBurgerTasteRatings(burger: BurgerRecord): BurgerTasteRating[] {
  const scores: TasteScore = {
    savory: burger.protein === '素食' ? 2 : 3,
    rich: 2,
    acid: 1,
    heat: 1,
    sweet: 1,
    crunch: 2,
  }

  for (const flavor of burger.flavors) {
    const additions = flavorScores[flavor]

    for (const [key, value] of Object.entries(additions) as Array<[keyof TasteScore, number]>) {
      scores[key] = Math.max(scores[key], value)
    }
  }

  const ingredientText = burger.components.join('')

  if (/酸|醋|泡菜|腌|番茄|青柠/.test(ingredientText)) scores.acid += 1
  if (/辣|椒|芥末/.test(ingredientText)) scores.heat += 1
  if (/甜|糖|菠萝|香蕉|果酱/.test(ingredientText)) scores.sweet += 1
  if (/炸|脆|薯条|坚果/.test(ingredientText)) scores.crunch += 1
  if (/芝士|奶酪|黄油|蛋黄酱|肉汁/.test(ingredientText)) scores.rich += 1
  if (/牛肉|猪肉|鸡|鱼|虾|香肠|培根/.test(ingredientText)) scores.savory += 1

  return tasteLabels.map(([key, label]) => ({
    key,
    label,
    score: clampScore(scores[key]),
  }))
}

export function getBurgerStory(burger: BurgerRecord) {
  return [burger.summary]
}

export function getBurgerRecipeSteps(burger: BurgerRecord): BurgerRecipeStep[] {
  const [bun, main, ...rest] = burger.components
  const middleLayers = rest.slice(0, -1)
  const finish = rest.at(-1)
  const guide = mainCookingGuides[burger.visual.mainStyle]
  const safeTemperature = safeTemperatures[burger.protein]

  return [
    {
      number: '01',
      title: '分量',
      meta: '1 份',
      description: `${bun} 1 个，${guide.portion}；${middleLayers.join('、')}和${finish ?? '调味酱'}各适量。`,
    },
    {
      number: '02',
      title: '主料准备',
      meta: main,
      description: guide.prep,
    },
    {
      number: '03',
      title: '配菜与酱',
      meta: '5–10 分钟',
      description: `${middleLayers.join('、')}切好或加热，含水配料沥干；${finish ?? '调味酱'}单独放置。`,
    },
    {
      number: '04',
      title: '煎制主料',
      meta: safeTemperature ?? '两面焦黄',
      description: `${guide.cook}${safeTemperature ? `用温度计从侧面插入中心，达到 ${safeTemperature.replace('中心温度 ', '')}。` : ''}`,
    },
    {
      number: '05',
      title: '烤面包',
      meta: '45–60 秒',
      description: `${bun}切开，切面薄涂黄油或食用油，中火烤至微黄。`,
    },
    {
      number: '06',
      title: '组装',
      meta: '趁热食用',
      description: `${burger.components.join(' → ')}依次叠放；装好后静置 1 分钟。`,
    },
  ]
}

export function getSimilarBurgers(
  burger: BurgerRecord,
  catalog: BurgerRecord[],
  limit = 3,
) {
  return catalog
    .filter((candidate) => candidate.slug !== burger.slug)
    .map((candidate) => {
      const sharedFlavors = candidate.flavors.filter((flavor) => burger.flavors.includes(flavor)).length
      const score =
        sharedFlavors * 4 +
        (candidate.protein === burger.protein ? 5 : 0) +
        (candidate.country === burger.country ? 3 : 0) +
        (candidate.visual.bunStyle === burger.visual.bunStyle ? 1 : 0) +
        (candidate.visual.mainStyle === burger.visual.mainStyle ? 1 : 0)

      return { burger: candidate, score }
    })
    .sort((left, right) => right.score - left.score || left.burger.archiveNo.localeCompare(right.burger.archiveNo))
    .slice(0, limit)
    .map(({ burger: candidate }) => candidate)
}
