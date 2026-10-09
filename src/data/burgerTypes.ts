export const burgerProteins = ['牛肉', '鸡肉', '猪肉', '鱼类', '海鲜', '素食', '羊肉', '混合肉', '野味'] as const

export const burgerFlavors = [
  '咸香',
  '浓郁',
  '麻辣',
  '甜咸',
  '酥脆',
  '酸辣',
  '清爽',
  '酸香',
  '香草',
  '奶香',
  '香料',
  '鲜辣',
  '烟熏',
  '甜辣',
  '鲜味',
  '酸甜',
] as const

export type BurgerProtein = (typeof burgerProteins)[number]
export type BurgerFlavor = (typeof burgerFlavors)[number]

export type BurgerBunStyle =
  | 'sesame'
  | 'plain'
  | 'pretzel'
  | 'corn'
  | 'ciabatta'
  | 'brioche'
  | 'soft'
  | 'pita'
  | 'coconut'
  | 'toast'
  | 'rice'
  | 'donut'
  | 'wrap'
  | 'slider'
  | 'baguette'
  | 'noodle'

export type BurgerMainStyle =
  | 'beef'
  | 'pepper-beef'
  | 'glazed-chicken'
  | 'fried-chicken'
  | 'sausage'
  | 'grilled-chicken'
  | 'veggie'
  | 'falafel'
  | 'fish'
  | 'shrimp'
  | 'pork'
  | 'bison'
  | 'salmon'
  | 'coconut'
  | 'tempeh'
  | 'lamb'
  | 'mixed'

export type BurgerFreshStyle =
  | 'pickles'
  | 'lotus-kimchi'
  | 'slaw'
  | 'kimchi'
  | 'guacamole'
  | 'kraut'
  | 'tomato-basil'
  | 'onion'
  | 'onion-herbs'
  | 'herbs-pickles'
  | 'lettuce'
  | 'papaya'
  | 'classic'
  | 'beetroot-pineapple'
  | 'chili-slaw'
  | 'olive'
  | 'fries'
  | 'red-cabbage'
  | 'green-chile'

export type BurgerCheeseStyle = 'cheddar' | 'mozzarella' | 'brie' | 'swiss' | 'blue' | 'pimento' | 'stuffed' | 'none'

export type BurgerSauceStyle =
  | 'ketchup'
  | 'mayo'
  | 'glaze'
  | 'gochujang'
  | 'salsa'
  | 'mustard'
  | 'pesto'
  | 'yogurt'
  | 'tahini'
  | 'tartar'
  | 'sweet-chili'
  | 'bbq'
  | 'brown-gravy'
  | 'peanut'
  | 'tomato-soak'
  | 'remoulade'
  | 'chili'
  | 'butter'

export type BurgerVisualRecipe = {
  bunStyle: BurgerBunStyle
  mainStyle: BurgerMainStyle
  freshStyle: BurgerFreshStyle
  cheeseStyle: BurgerCheeseStyle
  sauceStyle: BurgerSauceStyle
}

export type BurgerVisual = BurgerVisualRecipe & {
  bun: string
  bunShade: string
  main: string
  cheese: string
  greens: string
  sauce: string
  accent: string
}

export type BurgerReference = {
  label: string
  url: string
}

export type BurgerRecord = {
  slug: string
  archiveNo: string
  name: string
  englishName: string
  country: string
  countryCode: string
  protein: BurgerProtein
  flavors: BurgerFlavor[]
  summary: string
  pairing: string
  components: string[]
  visual: BurgerVisual
  reference: BurgerReference
}

export type WorldBurgerSeed = Omit<BurgerRecord, 'archiveNo' | 'visual'> & {
  visual: BurgerVisualRecipe
}
