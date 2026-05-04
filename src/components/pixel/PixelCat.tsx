'use client'

type PixelCatProps = {
  mode?: 'gate' | 'inside'
}

export function PixelCat({ mode = 'inside' }: PixelCatProps) {
  return (
    <div className={`pixel-cat pixel-cat-${mode}`} aria-hidden>
      <span className="pixel-cat-aura" />
      <span className="pixel-cat-sprite" />
      <span className="pixel-cat-heart pixel-cat-heart-one" />
      <span className="pixel-cat-heart pixel-cat-heart-two" />
    </div>
  )
}
