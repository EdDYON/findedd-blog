import type { CSSProperties } from 'react'
import type { BurgerRecord, BurgerVisual } from '@/data/burgers'

type BurgerSpecimenProps = {
  burger: BurgerRecord
  large?: boolean
  biteStage?: number
}

type LayerProps = {
  visual: BurgerVisual
}

function BunBottom({ visual }: LayerProps) {
  if (visual.bunStyle === 'toast') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-fill" d="M56 170L255 165L267 203L69 211Z" />
        <path className="specimen-bun-shade-line" d="M76 190L246 185" />
      </g>
    )
  }

  if (visual.bunStyle === 'rice' || visual.bunStyle === 'noodle') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-fill" d="M61 174C96 159 229 159 260 176L250 205C210 219 108 219 70 204Z" />
        <path className="specimen-detail-line" d="M84 187C125 197 201 199 239 188" />
        {visual.bunStyle === 'noodle' && <path className="specimen-noodle-line" d="M88 198C106 181 123 207 143 189C162 174 178 207 198 188C215 174 226 195 239 186" />}
      </g>
    )
  }

  if (visual.bunStyle === 'donut') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-fill" d="M60 178C89 160 232 160 261 179L249 208C209 220 108 220 70 207Z" />
        <path className="specimen-donut-glaze" d="M75 181C112 170 209 170 248 182L239 195C200 203 119 203 82 194Z" />
      </g>
    )
  }

  if (visual.bunStyle === 'wrap') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-fill" d="M53 164L103 148L161 176L218 149L269 165L242 211H79Z" />
        <path className="specimen-bun-shade-line" d="M82 173L160 198L239 173" />
      </g>
    )
  }

  if (visual.bunStyle === 'baguette') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-fill" d="M42 177L63 162L258 163L279 178L258 207L63 208Z" />
        <path className="specimen-bun-shade-line" d="M72 191L249 191" />
      </g>
    )
  }

  if (visual.bunStyle === 'slider') {
    return (
      <g className="specimen-bun-bottom-group specimen-slider-layer">
        <path className="specimen-bun-fill" d="M82 178C110 166 211 166 239 179L229 204C197 216 124 216 92 204Z" />
      </g>
    )
  }

  if (visual.bunStyle === 'pita') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-fill" d="M59 169C96 157 225 158 263 171L249 207C207 218 111 218 70 205Z" />
        <path className="specimen-detail-line" d="M76 189C125 201 205 202 247 188" />
      </g>
    )
  }

  if (visual.bunStyle === 'ciabatta') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-fill" d="M48 177L68 164L246 165L270 177L251 207L75 208Z" />
        <path className="specimen-bun-shade-line" d="M72 191L245 191" />
      </g>
    )
  }

  if (visual.bunStyle === 'pretzel') {
    return (
      <g className="specimen-bun-bottom-group">
        <path className="specimen-bun-shade-fill" d="M58 176C92 163 231 164 264 178L248 207C207 220 110 219 72 205Z" />
        <path className="specimen-light-line" d="M79 190C124 201 204 201 244 190" />
      </g>
    )
  }

  return (
    <g className="specimen-bun-bottom-group">
      <path className="specimen-bun-fill" d="M62 177C91 165 229 165 258 177L247 205C214 220 106 220 73 205Z" />
      <path className="specimen-bun-shade-line" d="M82 194C125 205 203 205 239 194" />
    </g>
  )
}

function MainLayer({ visual }: LayerProps) {
  switch (visual.mainStyle) {
    case 'pepper-beef':
      return (
        <g className="specimen-main-group">
          <path className="specimen-main-fill" d="M53 143C77 127 239 128 266 145L257 176C211 188 107 188 63 176Z" />
          <g className="specimen-pepper-dots">
            <circle cx="91" cy="153" r="3" />
            <circle cx="126" cy="166" r="3" />
            <circle cx="164" cy="149" r="3" />
            <circle cx="201" cy="165" r="3" />
            <circle cx="235" cy="151" r="3" />
          </g>
        </g>
      )
    case 'glazed-chicken':
      return (
        <g className="specimen-main-group">
          <path className="specimen-main-fill" d="M58 151C73 133 111 130 137 139C158 127 210 130 238 142C262 152 263 173 244 181C198 190 111 190 70 180C53 174 48 161 58 151Z" />
          <path className="specimen-sauce-line" d="M78 152C121 140 199 141 239 154" />
          <path className="specimen-light-line" d="M100 162C123 156 140 156 154 160" />
        </g>
      )
    case 'fried-chicken':
      return (
        <g className="specimen-main-group specimen-fried-group">
          <path className="specimen-main-fill" d="M52 151L67 136L86 139L103 127L123 135L143 125L164 136L187 126L206 138L230 132L267 151L258 174L239 181L213 177L194 187L169 180L144 188L121 179L97 184L72 177Z" />
          <path className="specimen-crust-line" d="M80 153L105 145M137 151L163 143M195 153L223 144" />
        </g>
      )
    case 'sausage':
      return (
        <g className="specimen-main-group specimen-sausage-group">
          <path className="specimen-main-fill" d="M58 150C58 137 70 130 83 132L157 144C171 147 176 159 171 170C166 181 154 184 141 181L74 169C63 167 58 160 58 150Z" />
          <path className="specimen-main-fill" d="M151 143L232 132C248 130 260 140 260 153C260 164 252 171 241 173L168 182C154 183 145 174 145 162C145 152 147 147 151 143Z" />
          <path className="specimen-light-line" d="M91 138L84 165M126 143L120 173M192 140L197 176M226 136L232 171" />
        </g>
      )
    case 'grilled-chicken':
      return (
        <g className="specimen-main-group">
          <path className="specimen-main-fill" d="M62 144C89 130 224 130 256 145L248 177C211 188 110 188 69 177Z" />
          <path className="specimen-grill-line" d="M93 139L112 181M141 134L159 184M190 134L207 181M228 139L238 173" />
        </g>
      )
    case 'veggie':
      return (
        <g className="specimen-main-group">
          <path className="specimen-main-fill" d="M57 146C80 130 240 130 263 147L255 177C211 189 110 189 65 177Z" />
          <g className="specimen-veggie-dots">
            <circle cx="91" cy="153" r="5" />
            <circle cx="126" cy="166" r="4" />
            <circle cx="163" cy="150" r="5" />
            <circle cx="199" cy="164" r="4" />
            <circle cx="232" cy="151" r="5" />
          </g>
        </g>
      )
    case 'falafel':
      return (
        <g className="specimen-main-group specimen-falafel-group">
          <circle className="specimen-main-fill" cx="104" cy="157" r="31" />
          <circle className="specimen-main-fill" cx="160" cy="151" r="34" />
          <circle className="specimen-main-fill" cx="216" cy="158" r="30" />
          <g className="specimen-falafel-dots">
            <circle cx="99" cy="151" r="3" />
            <circle cx="151" cy="143" r="3" />
            <circle cx="172" cy="162" r="3" />
            <circle cx="220" cy="151" r="3" />
          </g>
        </g>
      )
    case 'fish':
      return (
        <g className="specimen-main-group specimen-fish-group">
          <path className="specimen-main-fill" d="M59 142L76 130L251 134L264 151L250 181L72 178L52 160Z" />
          <path className="specimen-crust-line" d="M77 149L104 138L130 148L157 137L184 149L212 139L240 151" />
          <path className="specimen-light-line" d="M91 164L223 166" />
        </g>
      )
    case 'shrimp':
      return (
        <g className="specimen-main-group specimen-shrimp-group">
          <path className="specimen-main-fill" d="M57 149C78 131 235 129 263 148L256 176C216 189 106 189 64 176Z" />
          <path className="specimen-shrimp-mark" d="M91 160C101 143 121 144 126 158C119 170 101 171 91 160ZM145 157C157 140 177 143 181 157C174 171 154 171 145 157ZM199 159C210 143 231 145 234 158C227 171 208 171 199 159Z" />
        </g>
      )
    case 'pork':
      return (
        <g className="specimen-main-group specimen-pork-group">
          <path className="specimen-main-fill" d="M57 147C82 132 239 130 264 148L255 178C216 187 108 190 64 176Z" />
          <path className="specimen-crackling-fill" d="M62 144C95 128 228 128 258 144L249 154C207 147 110 148 70 156Z" />
          <path className="specimen-light-line" d="M91 140L102 151M126 134L137 148M165 132L175 147M205 134L214 149M235 139L242 151" />
        </g>
      )
    case 'bison':
      return (
        <g className="specimen-main-group specimen-bison-group">
          <path className="specimen-main-fill" d="M49 151C63 130 97 133 114 127C137 120 179 128 196 128C223 128 255 134 270 153L259 178C214 191 105 191 61 178Z" />
          <path className="specimen-grill-line" d="M82 149L106 177M137 139L158 184M191 139L211 181M231 146L245 174" />
        </g>
      )
    case 'salmon':
      return (
        <g className="specimen-main-group specimen-salmon-group">
          <path className="specimen-main-fill" d="M58 147C82 130 236 130 262 149L253 178C210 189 110 188 66 177Z" />
          <path className="specimen-salmon-line" d="M81 158C104 141 127 141 149 158M150 157C173 140 199 141 221 158M217 158L242 147" />
        </g>
      )
    case 'coconut':
      return (
        <g className="specimen-main-group specimen-coconut-patty-group">
          <path className="specimen-main-fill" d="M57 145C85 130 237 131 263 148L254 179C211 189 108 189 64 176Z" />
          <path className="specimen-coconut-shred" d="M78 151L99 169M102 143L123 174M134 141L151 177M166 141L180 176M197 142L211 174M229 148L241 169" />
        </g>
      )
    case 'tempeh':
      return (
        <g className="specimen-main-group specimen-tempeh-group">
          <path className="specimen-main-fill" d="M61 137L256 138L250 181L67 180Z" />
          <g className="specimen-tempeh-dots">
            <circle cx="91" cy="151" r="5" />
            <circle cx="122" cy="167" r="5" />
            <circle cx="153" cy="150" r="5" />
            <circle cx="187" cy="166" r="5" />
            <circle cx="221" cy="151" r="5" />
          </g>
        </g>
      )
    case 'lamb':
      return (
        <g className="specimen-main-group specimen-lamb-group">
          <path className="specimen-main-fill" d="M54 148C70 130 100 135 122 128C149 120 175 132 198 128C222 126 252 136 266 151L256 178C213 190 108 190 63 177Z" />
          <g className="specimen-herb-dots">
            <circle cx="91" cy="154" r="4" />
            <circle cx="128" cy="165" r="4" />
            <circle cx="166" cy="148" r="4" />
            <circle cx="201" cy="166" r="4" />
            <circle cx="234" cy="151" r="4" />
          </g>
        </g>
      )
    case 'mixed':
      return (
        <g className="specimen-main-group specimen-mixed-group">
          <path className="specimen-main-fill" d="M54 148C75 129 244 130 266 149L257 178C214 190 107 190 63 177Z" />
          <path className="specimen-mixed-line" d="M78 145L106 177M110 137L140 181M145 135L174 182M181 136L211 179M218 142L242 173" />
          <path className="specimen-mixed-line" d="M94 177L117 139M131 181L153 135M169 181L191 137M207 178L229 143" />
        </g>
      )
    default:
      return (
        <g className="specimen-main-group">
          <path className="specimen-main-fill" d="M55 148C74 131 246 131 265 148C274 157 265 177 249 180C206 188 112 188 69 180C51 177 45 158 55 148Z" />
          <path className="specimen-grill-line" d="M91 151L112 175M151 144L171 180M211 149L231 174" />
        </g>
      )
  }
}

function SauceLayer({ visual }: LayerProps) {
  if (visual.sauceStyle === 'glaze') {
    return <path className="specimen-sauce-ribbon specimen-sauce-glaze" d="M69 134C109 146 213 145 253 134L247 150C198 160 116 159 74 149Z" />
  }

  if (visual.sauceStyle === 'mustard') {
    return <path className="specimen-sauce-stroke" d="M72 137C91 119 108 153 128 135C147 117 166 153 186 135C205 117 224 151 247 133" />
  }

  if (visual.sauceStyle === 'pesto') {
    return (
      <g className="specimen-sauce-group">
        <circle className="specimen-sauce-fill" cx="95" cy="137" r="11" />
        <circle className="specimen-sauce-fill" cx="131" cy="132" r="12" />
        <circle className="specimen-sauce-fill" cx="169" cy="138" r="12" />
        <circle className="specimen-sauce-fill" cx="207" cy="131" r="11" />
        <circle className="specimen-sauce-fill" cx="239" cy="138" r="10" />
      </g>
    )
  }

  if (visual.sauceStyle === 'butter') {
    return (
      <g className="specimen-sauce-group specimen-butter-group">
        <path className="specimen-sauce-fill" d="M84 126L130 124L135 145L88 148Z" />
        <path className="specimen-sauce-fill" d="M151 123L197 125L193 147L147 145Z" />
        <path className="specimen-sauce-fill" d="M211 127L246 126L249 145L215 148Z" />
      </g>
    )
  }

  if (visual.sauceStyle === 'peanut') {
    return (
      <g className="specimen-sauce-group specimen-peanut-group">
        <circle className="specimen-sauce-fill" cx="91" cy="137" r="16" />
        <circle className="specimen-sauce-fill" cx="128" cy="132" r="19" />
        <circle className="specimen-sauce-fill" cx="171" cy="137" r="20" />
        <circle className="specimen-sauce-fill" cx="215" cy="133" r="18" />
        <circle className="specimen-sauce-fill" cx="246" cy="139" r="14" />
      </g>
    )
  }

  if (visual.sauceStyle === 'brown-gravy' || visual.sauceStyle === 'tomato-soak') {
    return <path className="specimen-sauce-ribbon specimen-sauce-soak" d="M58 128C96 118 228 119 263 130L253 160L229 148L205 164L179 149L153 165L126 149L100 163L72 150Z" />
  }

  if (['mayo', 'yogurt', 'tahini', 'tartar', 'remoulade'].includes(visual.sauceStyle)) {
    return <path className="specimen-sauce-ribbon" d="M67 133C96 126 223 126 253 134L244 151L223 142L201 154L178 141L154 154L131 141L108 153L84 142Z" />
  }

  if (visual.sauceStyle === 'salsa') {
    return (
      <g className="specimen-sauce-group">
        <path className="specimen-sauce-ribbon" d="M68 133L252 132L242 150L215 142L193 154L163 143L136 154L109 142L82 151Z" />
        <circle className="specimen-sauce-chunk" cx="113" cy="137" r="4" />
        <circle className="specimen-sauce-chunk" cx="176" cy="142" r="4" />
        <circle className="specimen-sauce-chunk" cx="224" cy="137" r="4" />
      </g>
    )
  }

  return <path className="specimen-sauce-ribbon" d="M65 136C91 127 225 127 256 138L243 153L219 145L195 157L170 146L143 157L116 146L91 154Z" />
}

function CheeseLayer({ visual }: LayerProps) {
  if (visual.cheeseStyle === 'none') return null

  if (visual.cheeseStyle === 'mozzarella') {
    return (
      <g className="specimen-cheese-group specimen-mozzarella-group">
        <path className="specimen-cheese-fill" d="M72 118C90 104 124 105 139 120C130 137 93 139 72 126Z" />
        <path className="specimen-cheese-fill" d="M126 122C144 102 184 102 198 121C186 140 146 141 126 122Z" />
        <path className="specimen-cheese-fill" d="M190 118C208 104 242 106 254 123C238 139 205 138 190 118Z" />
      </g>
    )
  }

  if (visual.cheeseStyle === 'brie') {
    return (
      <g className="specimen-cheese-group specimen-brie-group">
        <path className="specimen-cheese-fill" d="M66 120L128 106L153 136L91 147Z" />
        <path className="specimen-cheese-fill" d="M145 117L213 105L249 137L179 149Z" />
        <path className="specimen-cheese-rind" d="M77 121L126 111M159 119L209 111" />
      </g>
    )
  }

  if (visual.cheeseStyle === 'swiss') {
    return (
      <g className="specimen-cheese-group specimen-swiss-group">
        <path className="specimen-cheese-fill" d="M63 120H258L237 149L207 134L181 153L151 134L121 151L91 134Z" />
        <circle className="specimen-cheese-hole" cx="111" cy="128" r="6" />
        <circle className="specimen-cheese-hole" cx="164" cy="139" r="7" />
        <circle className="specimen-cheese-hole" cx="218" cy="128" r="6" />
      </g>
    )
  }

  if (visual.cheeseStyle === 'blue') {
    return (
      <g className="specimen-cheese-group specimen-blue-cheese-group">
        <path className="specimen-cheese-fill" d="M65 120L252 117L241 149L211 134L184 152L153 134L121 151L91 136Z" />
        <circle className="specimen-blue-dot" cx="109" cy="129" r="4" />
        <circle className="specimen-blue-dot" cx="151" cy="139" r="4" />
        <circle className="specimen-blue-dot" cx="197" cy="128" r="4" />
        <circle className="specimen-blue-dot" cx="229" cy="138" r="4" />
      </g>
    )
  }

  if (visual.cheeseStyle === 'pimento') {
    return (
      <g className="specimen-cheese-group specimen-pimento-group">
        <circle className="specimen-cheese-fill" cx="91" cy="132" r="17" />
        <circle className="specimen-cheese-fill" cx="128" cy="126" r="20" />
        <circle className="specimen-cheese-fill" cx="171" cy="133" r="21" />
        <circle className="specimen-cheese-fill" cx="215" cy="127" r="19" />
        <circle className="specimen-cheese-fill" cx="246" cy="133" r="15" />
      </g>
    )
  }

  if (visual.cheeseStyle === 'stuffed') {
    return (
      <g className="specimen-cheese-group specimen-stuffed-group">
        <path className="specimen-cheese-fill" d="M119 146C139 132 181 132 202 147L193 163C172 172 146 171 126 161Z" />
        <path className="specimen-light-line" d="M144 149C157 143 172 143 184 149" />
      </g>
    )
  }

  return <path className="specimen-cheese-group specimen-cheese-fill" d="M62 121H258L235 148L209 133L180 153L152 133L121 151L91 133Z" />
}

function FreshLayer({ visual }: LayerProps) {
  switch (visual.freshStyle) {
    case 'pickles':
      return (
        <g className="specimen-fresh-group specimen-pickles-group">
          {[94, 139, 184, 229].map((cx) => (
            <g key={cx}>
              <ellipse className="specimen-greens-fill" cx={cx} cy="112" rx="26" ry="11" />
              <path className="specimen-light-line" d={`M${cx - 10} 112H${cx + 10}`} />
            </g>
          ))}
        </g>
      )
    case 'lotus-kimchi':
      return (
        <g className="specimen-fresh-group specimen-lotus-group">
          <path className="specimen-accent-fill" d="M61 113L88 96L115 112L142 94L170 113L198 95L225 112L253 96L267 121L239 130L211 119L184 132L154 119L126 132L98 118L73 127Z" />
          {[111, 207].map((cx) => (
            <g key={cx}>
              <circle className="specimen-lotus-fill" cx={cx} cy="106" r="20" />
              <circle className="specimen-lotus-hole" cx={cx} cy="106" r="5" />
              <circle className="specimen-lotus-hole" cx={cx - 9} cy="98" r="4" />
              <circle className="specimen-lotus-hole" cx={cx + 9} cy="98" r="4" />
            </g>
          ))}
        </g>
      )
    case 'slaw':
      return (
        <g className="specimen-fresh-group specimen-slaw-group">
          <path className="specimen-greens-fill" d="M56 110L82 93L105 109L129 91L153 111L179 92L203 110L230 92L264 111L250 129L225 119L199 132L174 118L148 131L122 118L96 130L72 120Z" />
          <path className="specimen-light-line" d="M82 111C118 101 203 101 241 112M99 122C136 112 189 113 220 122" />
        </g>
      )
    case 'kimchi':
      return (
        <g className="specimen-fresh-group specimen-kimchi-group">
          <path className="specimen-greens-fill" d="M55 111L80 94L106 109L132 93L158 111L185 93L211 110L239 94L266 113L250 129L224 119L197 132L170 118L143 131L116 118L89 129L66 120Z" />
          <path className="specimen-accent-fill" d="M73 104L95 95L115 111L139 98L161 114L185 98L208 113L234 101L249 118L223 123L198 116L173 126L148 116L122 125L99 115L78 121Z" />
        </g>
      )
    case 'guacamole':
      return (
        <g className="specimen-fresh-group specimen-guacamole-group">
          <circle className="specimen-greens-fill" cx="85" cy="113" r="20" />
          <circle className="specimen-greens-fill" cx="121" cy="106" r="23" />
          <circle className="specimen-greens-fill" cx="160" cy="113" r="24" />
          <circle className="specimen-greens-fill" cx="201" cy="106" r="23" />
          <circle className="specimen-greens-fill" cx="238" cy="114" r="20" />
          <ellipse className="specimen-jalapeno" cx="119" cy="108" rx="13" ry="7" />
          <ellipse className="specimen-jalapeno" cx="204" cy="107" rx="13" ry="7" />
        </g>
      )
    case 'kraut':
      return (
        <g className="specimen-fresh-group specimen-kraut-group">
          <path className="specimen-cheese-line" d="M63 114C78 91 94 130 111 105C128 82 145 131 163 105C180 82 197 130 216 105C232 87 245 112 258 105" />
          <path className="specimen-cheese-line" d="M72 126C89 104 106 138 124 116C143 95 159 139 178 115C197 93 216 135 247 113" />
        </g>
      )
    case 'tomato-basil':
      return (
        <g className="specimen-fresh-group specimen-tomato-group">
          <path className="specimen-accent-fill" d="M67 112C92 93 132 95 151 113C129 132 88 132 67 112ZM157 112C182 93 227 95 252 115C226 133 180 132 157 112Z" />
          <path className="specimen-greens-fill" d="M124 103C136 82 155 82 161 102C148 111 136 112 124 103ZM190 102C203 82 221 85 225 104C211 112 201 111 190 102Z" />
        </g>
      )
    case 'onion':
      return (
        <g className="specimen-fresh-group specimen-onion-group">
          <ellipse className="specimen-onion-ring" cx="106" cy="111" rx="37" ry="16" />
          <ellipse className="specimen-onion-ring" cx="164" cy="107" rx="40" ry="17" />
          <ellipse className="specimen-onion-ring" cx="222" cy="112" rx="34" ry="15" />
        </g>
      )
    case 'onion-herbs':
      return (
        <g className="specimen-fresh-group specimen-herb-group">
          <ellipse className="specimen-onion-ring" cx="105" cy="112" rx="35" ry="15" />
          <ellipse className="specimen-onion-ring" cx="202" cy="112" rx="35" ry="15" />
          <path className="specimen-greens-fill" d="M132 122C128 96 142 84 159 103C175 83 192 96 185 122L160 132Z" />
        </g>
      )
    case 'herbs-pickles':
      return (
        <g className="specimen-fresh-group specimen-herb-group">
          <path className="specimen-greens-fill" d="M62 117C76 90 96 88 105 112C116 89 139 91 146 116C159 87 185 91 190 117C205 91 230 93 258 116L244 131L215 121L188 133L160 119L131 132L103 120L78 130Z" />
          <path className="specimen-pickle-block" d="M86 101L119 96L123 111L90 116ZM193 98L228 102L225 117L190 112Z" />
        </g>
      )
    case 'lettuce':
      return <path className="specimen-fresh-group specimen-greens-fill" d="M55 112L82 92L109 111L136 92L163 113L191 91L218 111L245 94L267 114L250 131L222 120L195 133L166 119L138 132L110 119L83 131L63 121Z" />
    case 'papaya':
      return (
        <g className="specimen-fresh-group specimen-papaya-group">
          <path className="specimen-greens-line" d="M67 117L112 96M91 125L139 96M121 126L168 94M153 126L201 95M185 127L231 98M215 126L253 105" />
          <path className="specimen-accent-line" d="M73 104L115 124M105 99L145 125M140 97L180 126M174 97L214 124M207 99L246 119" />
        </g>
      )
    case 'classic':
      return (
        <g className="specimen-fresh-group specimen-classic-group">
          <path className="specimen-greens-fill" d="M55 118L80 98L106 115L132 98L158 117L185 97L211 116L239 99L267 118L250 132L222 123L195 134L167 122L139 134L111 122L84 133L63 125Z" />
          <path className="specimen-accent-fill" d="M70 104C95 88 132 90 150 106C129 121 90 121 70 104ZM160 105C185 89 228 91 250 108C226 122 182 121 160 105Z" />
        </g>
      )
    case 'beetroot-pineapple':
      return (
        <g className="specimen-fresh-group specimen-beet-group">
          <ellipse className="specimen-accent-fill" cx="104" cy="109" rx="34" ry="16" />
          <ellipse className="specimen-accent-fill" cx="216" cy="109" rx="34" ry="16" />
          <ellipse className="specimen-cheese-fill" cx="160" cy="108" rx="35" ry="17" />
          <ellipse className="specimen-pineapple-hole" cx="160" cy="108" rx="13" ry="7" />
        </g>
      )
    case 'chili-slaw':
      return (
        <g className="specimen-fresh-group specimen-chili-slaw-group">
          <path className="specimen-greens-fill" d="M56 114L81 96L106 113L132 95L158 115L184 96L211 114L238 97L265 116L248 131L222 122L196 133L169 121L142 133L115 121L88 131L65 123Z" />
          <path className="specimen-accent-line" d="M77 108C106 94 132 125 161 108C188 92 213 124 244 106" />
        </g>
      )
    case 'olive':
      return (
        <g className="specimen-fresh-group specimen-olive-group">
          {[88, 124, 160, 196, 232].map((cx, index) => (
            <g key={cx}>
              <ellipse className="specimen-greens-fill" cx={cx} cy={index % 2 === 0 ? 110 : 103} rx="18" ry="12" />
              <ellipse className="specimen-olive-hole" cx={cx} cy={index % 2 === 0 ? 110 : 103} rx="6" ry="4" />
            </g>
          ))}
        </g>
      )
    case 'fries':
      return (
        <g className="specimen-fresh-group specimen-fries-group">
          <path className="specimen-cheese-fill" d="M75 127L84 89L98 92L96 129ZM107 128L119 84L132 88L128 130ZM143 130L151 87L165 88L164 131ZM178 130L188 84L202 87L197 130ZM213 130L225 91L238 94L231 131Z" />
        </g>
      )
    case 'red-cabbage':
      return (
        <g className="specimen-fresh-group specimen-red-cabbage-group">
          <path className="specimen-accent-fill" d="M57 111L80 95L106 111L131 94L158 113L184 94L211 112L238 95L265 114L249 130L222 120L196 132L169 119L142 132L115 119L89 130L65 121Z" />
          <path className="specimen-light-line" d="M82 112C116 101 203 101 239 112M101 123C136 113 188 113 219 123" />
        </g>
      )
    case 'green-chile':
      return (
        <g className="specimen-fresh-group specimen-green-chile-group">
          <path className="specimen-greens-fill" d="M70 117C91 90 126 91 145 110C127 123 96 128 70 117ZM144 111C166 88 204 90 224 108C206 124 170 127 144 111ZM211 110C230 94 251 99 260 116C245 125 226 122 211 110Z" />
          <path className="specimen-light-line" d="M86 113L126 105M163 110L205 104M228 112L249 110" />
        </g>
      )
  }
}

function BunTop({ visual }: LayerProps) {
  switch (visual.bunStyle) {
    case 'pretzel':
      return (
        <g className="specimen-bun-top-group specimen-bun-pretzel">
          <path className="specimen-bun-shade-fill" d="M54 91C64 34 252 27 267 92C219 106 101 106 54 91Z" />
          <path className="specimen-light-line" d="M83 74C124 49 200 48 241 73M115 47L130 66M166 37L173 59M218 48L204 67" />
        </g>
      )
    case 'ciabatta':
      return (
        <g className="specimen-bun-top-group specimen-bun-ciabatta">
          <path className="specimen-bun-fill" d="M48 87L64 48L87 36L236 38L260 51L272 88C222 104 96 103 48 87Z" />
          <path className="specimen-flour-patch" d="M83 64L122 54M144 54L180 47M204 62L238 54" />
        </g>
      )
    case 'brioche':
      return (
        <g className="specimen-bun-top-group specimen-bun-brioche">
          <path className="specimen-bun-fill" d="M54 91C56 60 74 40 104 41C120 22 148 25 161 40C177 22 207 27 218 44C246 43 263 62 267 92C222 105 100 106 54 91Z" />
          <path className="specimen-bun-shade-line" d="M107 47L115 82M161 42L161 83M216 49L206 83" />
          <path className="specimen-light-line" d="M85 63C93 54 101 51 110 52" />
        </g>
      )
    case 'pita':
      return (
        <g className="specimen-bun-top-group specimen-bun-pita">
          <path className="specimen-bun-fill" d="M48 92C58 40 252 35 271 93C218 105 101 106 48 92Z" />
          <path className="specimen-bun-shade-line" d="M72 78C120 91 207 91 251 77" />
          <circle className="specimen-pita-dot" cx="104" cy="62" r="3" />
          <circle className="specimen-pita-dot" cx="177" cy="54" r="3" />
          <circle className="specimen-pita-dot" cx="225" cy="67" r="3" />
        </g>
      )
    case 'corn':
      return (
        <g className="specimen-bun-top-group specimen-bun-corn">
          <path className="specimen-bun-fill" d="M56 92C69 36 246 31 265 92C220 105 104 106 56 92Z" />
          <path className="specimen-bun-shade-line" d="M102 51L109 82M151 42L155 82M201 47L198 83" />
          <g className="specimen-corn-dots">
            <circle cx="90" cy="66" r="4" />
            <circle cx="132" cy="55" r="4" />
            <circle cx="181" cy="55" r="4" />
            <circle cx="224" cy="69" r="4" />
          </g>
        </g>
      )
    case 'coconut':
      return (
        <g className="specimen-bun-top-group specimen-bun-coconut">
          <path className="specimen-bun-fill" d="M57 92C71 39 239 31 263 91C223 105 101 107 57 92Z" />
          <path className="specimen-light-line" d="M92 67L111 54M131 57L143 44M178 49L190 39M215 63L231 52" />
          <path className="specimen-coconut-line" d="M82 82C124 68 201 68 242 81" />
        </g>
      )
    case 'soft':
      return (
        <g className="specimen-bun-top-group specimen-bun-soft">
          <path className="specimen-bun-fill" d="M55 92C66 45 244 38 265 92C222 104 101 105 55 92Z" />
          <path className="specimen-light-line" d="M91 67C112 52 135 48 153 49M190 51C207 53 224 59 236 68" />
        </g>
      )
    case 'toast':
      return (
        <g className="specimen-bun-top-group specimen-bun-toast">
          <path className="specimen-bun-fill" d="M56 91L61 40C94 29 226 29 259 41L265 91C216 103 103 104 56 91Z" />
          <path className="specimen-bun-shade-line" d="M75 76L244 76" />
        </g>
      )
    case 'rice':
      return (
        <g className="specimen-bun-top-group specimen-bun-rice">
          <path className="specimen-bun-fill" d="M55 91C68 43 247 40 265 92C221 105 101 105 55 91Z" />
          <g className="specimen-rice-grains">
            <path d="M91 66L103 61M124 53L137 56M160 48L171 53M197 54L209 49M229 67L241 63" />
          </g>
        </g>
      )
    case 'donut':
      return (
        <g className="specimen-bun-top-group specimen-bun-donut">
          <path className="specimen-bun-fill" d="M55 91C67 34 248 29 266 92C219 105 102 105 55 91Z" />
          <path className="specimen-donut-glaze" d="M62 73C84 31 235 29 258 73L239 81L216 70L190 82L163 69L135 82L108 70L82 81Z" />
          <g className="specimen-donut-sprinkles">
            <path d="M96 57L106 50M133 48L142 56M176 47L185 54M216 52L226 47" />
          </g>
        </g>
      )
    case 'wrap':
      return (
        <g className="specimen-bun-top-group specimen-bun-wrap">
          <path className="specimen-bun-fill" d="M49 91L73 45L119 32L160 58L204 32L249 46L272 92C221 104 100 105 49 91Z" />
          <path className="specimen-bun-shade-line" d="M74 52L160 84L247 52" />
        </g>
      )
    case 'slider':
      return (
        <g className="specimen-bun-top-group specimen-slider-layer">
          <path className="specimen-bun-fill" d="M81 91C91 43 224 39 239 92C204 102 116 103 81 91Z" />
          <path className="specimen-light-line" d="M119 61L131 55M164 50L174 56M204 63L216 58" />
        </g>
      )
    case 'baguette':
      return (
        <g className="specimen-bun-top-group specimen-bun-baguette">
          <path className="specimen-bun-fill" d="M42 90L56 49L80 36L242 37L265 49L278 91C221 103 97 103 42 90Z" />
          <path className="specimen-light-line" d="M88 64L111 48M139 59L160 43M190 59L212 44M231 65L247 54" />
        </g>
      )
    case 'noodle':
      return (
        <g className="specimen-bun-top-group specimen-bun-noodle">
          <path className="specimen-bun-fill" d="M55 91C68 42 247 39 265 92C221 104 101 105 55 91Z" />
          <path className="specimen-noodle-line" d="M78 72C94 51 111 79 128 58C145 39 161 77 180 56C198 38 214 76 239 56M81 83C105 65 125 91 151 71C174 54 194 88 237 70" />
        </g>
      )
    default:
      return (
        <g className="specimen-bun-top-group">
          <path className="specimen-bun-fill" d="M55 89C66 27 249 21 266 90C221 105 103 106 55 89Z" />
          {visual.bunStyle === 'sesame' && (
            <g className="specimen-sesame" aria-hidden="true">
              <path d="M105 62L118 55" />
              <path d="M151 45L162 54" />
              <path d="M199 51L211 44" />
              <path d="M231 69L243 64" />
            </g>
          )}
        </g>
      )
  }
}

const biteMarks = [
  [
    { cx: 282, cy: 39, r: 27 },
    { cx: 294, cy: 68, r: 25 },
    { cx: 267, cy: 67, r: 23 },
  ],
  [
    { cx: 36, cy: 105, r: 27 },
    { cx: 27, cy: 137, r: 25 },
    { cx: 54, cy: 132, r: 23 },
  ],
  [
    { cx: 281, cy: 178, r: 29 },
    { cx: 259, cy: 203, r: 27 },
    { cx: 295, cy: 211, r: 25 },
  ],
  [
    { cx: 68, cy: 37, r: 28 },
    { cx: 98, cy: 32, r: 25 },
    { cx: 83, cy: 64, r: 24 },
  ],
  [
    { cx: 67, cy: 188, r: 30 },
    { cx: 96, cy: 207, r: 28 },
    { cx: 48, cy: 216, r: 25 },
  ],
  [
    { cx: 145, cy: 105, r: 43 },
    { cx: 184, cy: 119, r: 45 },
    { cx: 154, cy: 154, r: 42 },
  ],
]

export default function BurgerSpecimen({ burger, large = false, biteStage = 0 }: BurgerSpecimenProps) {
  const style = {
    '--specimen-bun': burger.visual.bun,
    '--specimen-bun-shade': burger.visual.bunShade,
    '--specimen-main': burger.visual.main,
    '--specimen-cheese': burger.visual.cheese,
    '--specimen-greens': burger.visual.greens,
    '--specimen-sauce': burger.visual.sauce,
    '--specimen-accent': burger.visual.accent,
  } as CSSProperties
  const visibleBites = biteMarks.slice(0, Math.max(0, biteStage)).flat()
  const biteMaskId = `burger-bite-${burger.slug.replace(/[^a-z0-9-]/g, '')}`

  return (
    <div
      className={`burger-specimen ${large ? 'burger-specimen-large' : ''}`}
      data-bun={burger.visual.bunStyle}
      data-fresh={burger.visual.freshStyle}
      data-main={burger.visual.mainStyle}
      data-sauce={burger.visual.sauceStyle}
      style={style}
      aria-label={`${burger.name} 硬蜡笔分层图`}
    >
      <svg viewBox="0 0 320 236" role="img">
        <title>{burger.name}</title>
        {visibleBites.length > 0 && (
          <defs>
            <mask id={biteMaskId}>
              <rect width="320" height="236" fill="white" />
              {visibleBites.map((bite) => (
                <circle key={`${bite.cx}-${bite.cy}`} cx={bite.cx} cy={bite.cy} r={bite.r} fill="black" />
              ))}
            </mask>
          </defs>
        )}
        <g mask={visibleBites.length > 0 ? `url(#${biteMaskId})` : undefined}>
          <ellipse className="specimen-shadow" cx="160" cy="211" rx="105" ry="13" />
          <g className="specimen-stack">
            <BunBottom visual={burger.visual} />
            <MainLayer visual={burger.visual} />
            <SauceLayer visual={burger.visual} />
            <CheeseLayer visual={burger.visual} />
            <FreshLayer visual={burger.visual} />
            <BunTop visual={burger.visual} />
          </g>
        </g>
      </svg>
      <span className="specimen-pin">{burger.countryCode}</span>
    </div>
  )
}
