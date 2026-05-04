'use client'

type PixelCatProps = {
  mode?: 'gate' | 'inside'
  button?: boolean
  active?: boolean
  label?: string
  onClick?: () => void
}

function CatBits() {
  return (
    <>
      <span className="pixel-cat-aura" />
      <span className="pixel-cat-sprite" />
      <span className="pixel-cat-heart pixel-cat-heart-one" />
      <span className="pixel-cat-heart pixel-cat-heart-two" />
    </>
  )
}

export function PixelCat({ mode = 'inside', button = false, active = false, label, onClick }: PixelCatProps) {
  const className = [
    'pixel-cat',
    `pixel-cat-${mode}`,
    button ? 'pixel-cat-button' : '',
    active ? 'pixel-cat-active' : '',
  ].filter(Boolean).join(' ')

  if (button) {
    return (
      <button type="button" className={className} aria-label={label ?? '打开像素小猫'} onClick={onClick}>
        <CatBits />
      </button>
    )
  }

  return (
    <div className={className} aria-hidden>
      <CatBits />
    </div>
  )
}
