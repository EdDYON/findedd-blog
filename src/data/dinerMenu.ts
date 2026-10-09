import { burgers } from './burgers'

const dinerMenuSlugs = [
  'classic-cheeseburger',
  'gochujang-fried-chicken',
  'teriyaki-chicken',
  'guacamole-jalapeno',
  'pretzel-sausage-kraut',
  'pesto-mozzarella-chicken',
  'masala-veggie',
  'fish-tartar',
]

const burgerBeltSlugs = [
  'classic-cheeseburger',
  'sichuan-pepper-beef',
  'teriyaki-chicken',
  'gochujang-fried-chicken',
  'guacamole-jalapeno',
  'pretzel-sausage-kraut',
  'pesto-mozzarella-chicken',
  'masala-veggie',
  'falafel-tahini',
  'fish-tartar',
  'thai-shrimp-cake',
  'aussie-burger-with-the-lot',
]

function pickBurgers(slugs: string[]) {
  return slugs.map((slug) => {
    const burger = burgers.find((item) => item.slug === slug)

    if (!burger) throw new Error(`未找到汉堡档案: ${slug}`)
    return burger
  })
}

export const dinerMenuBurgers = pickBurgers(dinerMenuSlugs)
export const burgerBeltBurgers = pickBurgers(burgerBeltSlugs)
