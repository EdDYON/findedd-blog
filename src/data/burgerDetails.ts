import type {
  BurgerFlavor,
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

const proteinInstructions: Record<BurgerProtein, string> = {
  牛肉: '高温煎出焦香外壳，保留肉汁后静置片刻。',
  鸡肉: '把鸡肉煎烤至完全熟透，表面形成均匀焦色。',
  猪肉: '将猪肉煎至完全熟透，让边缘微焦并沥去多余油脂。',
  鱼类: '轻柔煎烤鱼排至完全熟透，避免反复翻动。',
  海鲜: '将海鲜快速煎熟，保持弹嫩并及时离火。',
  素食: '把植物主料煎到外层定型、边缘酥香。',
  羊肉: '用高温锁住肉汁，再以香料补足羊肉的浓郁气味。',
  混合肉: '将混合肉料压成均匀肉饼，煎至完全熟透并形成焦边。',
  野味: '以中高火煎熟主料，避免过度加热令口感发干。',
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
  const ingredientLine = burger.components.slice(1).join('、')

  return [
    `这份档案以${burger.country}版本为线索，记录它如今最有辨识度的一种组合。${burger.summary}`,
    `${ingredientLine}共同构成了它的地方性格。${burger.pairing}`,
  ]
}

export function getBurgerRecipeSteps(burger: BurgerRecord): BurgerRecipeStep[] {
  const [bun, main, ...rest] = burger.components
  const middleLayers = rest.slice(0, -1)
  const finish = rest.at(-1)

  return [
    {
      number: '01',
      title: '烤香承托',
      description: `将${bun}切面轻烤到干爽微脆，让它能接住酱汁而不迅速变软。`,
    },
    {
      number: '02',
      title: '做好主角',
      description: `准备${main}。${proteinInstructions[burger.protein]}`,
    },
    {
      number: '03',
      title: '整理夹层',
      description: middleLayers.length > 0
        ? `分别处理${middleLayers.join('、')}，冷配料保持清脆，热配料在装配前完成。`
        : '把需要的蔬菜、芝士和调味料提前备好，避免主料出锅后久等。',
    },
    {
      number: '04',
      title: '叠好开吃',
      description: `从底部面包开始按档案顺序叠放，最后加入${finish ?? '调味酱'}，压稳后趁热食用。`,
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
