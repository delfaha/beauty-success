import { memo, useId, type CSSProperties, type ReactNode } from 'react'
import { fallbackArt, productArt } from '@/data/productArt'
import { productIndex } from '@/data/products'
import type { ArtSpec, ArtView, BottleArt, BoxArt, CapFinish } from '@/types/art'
import type { ProductCategory } from '@/types/product'
import { cn } from '@/utils/cn'
import { wrapWords } from '@/utils/text'
import { isDark, mix, shade } from './color'
import { bottleGeometry, FLOOR, VIEW_H, VIEW_W, type BottleGeometry, type Rect } from './geometry'
import { hashString, seededRandom, tornStripPath } from './random'

/**
 * Générateur de visuels produits « photo de studio » en SVG.
 * Quatre vues par produit : studio clair (front), fond noir dramatique (noir),
 * gros plan sur l'étiquette (detail) et flacon + étui (pack).
 * Les éléments .art-cap / .art-sweep / .art-mist sont animés au survol (index.css).
 */

const NOIR = '#0e0c0b'

type Stop = [offset: number, color: string, opacity?: number]

const CAP_COLORS: Record<CapFinish, string[]> = {
  gold: ['#6f5226', '#b99553', '#f1dfae', '#caa662', '#8a6831', '#5f4520'],
  silver: ['#606060', '#b3b3b1', '#f3f3f1', '#c4c4c2', '#858583', '#555553'],
  black: ['#030303', '#1e1d1c', '#3d3b39', '#1a1918', '#0b0b0a', '#020202'],
  wood: ['#4d321c', '#7e5737', '#a67c54', '#8a6040', '#6a4529', '#442c18'],
  ivory: ['#bdb3a4', '#e2dace', '#faf7f1', '#e9e2d7', '#d0c7b9', '#b1a696'],
}

const COLLAR_FINISH: Record<CapFinish, CapFinish> = {
  gold: 'gold',
  wood: 'gold',
  ivory: 'gold',
  silver: 'silver',
  black: 'silver',
}

const KIND_LABEL: Record<ProductCategory, string> = {
  'eau-de-parfum': 'eau de parfum',
  'eau-de-toilette': 'eau de toilette',
  parfum: 'parfum — extrait',
  coffret: 'eau de parfum',
  brume: 'brume parfumée',
}

const BOX_INK: Record<BoxArt['accent'], string> = {
  gold: '#cfae6b',
  cream: '#f2e9de',
  black: '#0b0b0b',
}

interface Texts {
  name: string
  kind: string
  brand: string
  volume: string
}

type Ids = Record<
  | 'floor'
  | 'glow'
  | 'shadow'
  | 'spot'
  | 'pool'
  | 'glass'
  | 'liquid'
  | 'cap'
  | 'capSphere'
  | 'collar'
  | 'sweep'
  | 'fade'
  | 'mask'
  | 'body'
  | 'inner'
  | 'boxShade'
  | 'mist'
  | 'obj',
  string
>

const url = (id: string) => `url(#${id})`

function makeIds(prefix: string): Ids {
  const keys = [
    'floor', 'glow', 'shadow', 'spot', 'pool', 'glass', 'liquid', 'cap', 'capSphere', 'collar',
    'sweep', 'fade', 'mask', 'body', 'inner', 'boxShade', 'mist', 'obj',
  ] as const
  return Object.fromEntries(keys.map((key) => [key, `${prefix}-${key}`])) as Ids
}

function renderStops(stops: Stop[]) {
  return stops.map(([offset, color, opacity = 1], index) => (
    <stop key={index} offset={offset} stopColor={color} stopOpacity={opacity} />
  ))
}

const evenStops = (colors: string[]): Stop[] => colors.map((color, i) => [i / (colors.length - 1), color])

/** Place un objet dessiné pour la scène standard (centre 200, sol 440) à `cx` avec l'échelle `scale`. */
const place = (cx: number, scale: number) =>
  `translate(${(cx - 200 * scale).toFixed(2)} ${(FLOOR - FLOOR * scale).toFixed(2)}) scale(${scale})`

function labelName(name: string): string {
  return name.replace(/^(coffret|brume)\s+/i, '').toLowerCase()
}

/* ------------------------------------------------------------------ Defs -- */
function Defs({ ids, spec, noir, geometry }: { ids: Ids; spec: ArtSpec; noir: boolean; geometry: BottleGeometry }) {
  const { bottle, backdrop } = spec
  const glass = bottle.liquid
  const liquid = noir ? mix(bottle.liquid, NOIR, 0.28) : bottle.liquid

  const glassStops: Stop[] = bottle.opaque
    ? noir
      ? [[0, '#57504a'], [0.05, shade(glass, -0.3)], [0.2, shade(glass, 0.24)], [0.5, glass], [0.9, shade(glass, -0.3)], [1, '#57504a']]
      : [[0, shade(glass, -0.35)], [0.18, shade(glass, 0.22)], [0.32, shade(glass, 0.07)], [0.6, glass], [0.88, shade(glass, -0.22)], [1, shade(glass, -0.45)]]
    : noir
      ? [[0, '#5a534c'], [0.08, '#1f1c1a'], [0.5, '#131110'], [0.92, '#1f1c1a'], [1, '#5a534c']]
      : [[0, shade(backdrop, -0.2)], [0.12, shade(backdrop, 0.18)], [0.45, shade(backdrop, 0.07)], [0.85, shade(backdrop, 0.12)], [1, shade(backdrop, -0.24)]]

  const capColors = CAP_COLORS[bottle.cap]

  return (
    <defs>
      <linearGradient id={ids.floor} x1="0" y1="370" x2="0" y2="500" gradientUnits="userSpaceOnUse">
        {renderStops([[0, shade(backdrop, -0.08), 0], [1, shade(backdrop, -0.08), 1]])}
      </linearGradient>
      <radialGradient id={ids.glow}>{renderStops([[0, '#ffffff', 0.5], [1, '#ffffff', 0]])}</radialGradient>
      <radialGradient id={ids.shadow}>
        {renderStops([[0, '#000000', noir ? 0.8 : 0.34], [1, '#000000', 0]])}
      </radialGradient>
      <radialGradient id={ids.spot}>
        {renderStops([[0, '#5d5249', 0.62], [0.5, '#2c2622', 0.4], [1, NOIR, 0]])}
      </radialGradient>
      <radialGradient id={ids.pool}>{renderStops([[0, '#51463e', 0.75], [1, NOIR, 0]])}</radialGradient>
      <linearGradient id={ids.glass} x1="0" x2="1" y1="0" y2="0">
        {renderStops(glassStops)}
      </linearGradient>
      <linearGradient id={ids.liquid} x1="0" x2="1" y1="0" y2="0">
        {renderStops([[0, shade(liquid, 0.25)], [0.3, liquid], [0.75, shade(liquid, -0.1)], [1, shade(liquid, -0.3)]])}
      </linearGradient>
      <linearGradient id={ids.cap} x1="0" x2="1" y1="0" y2="0">
        {renderStops(evenStops(capColors))}
      </linearGradient>
      <radialGradient id={ids.capSphere} cx="0.36" cy="0.3" r="0.8">
        {renderStops([[0, capColors[2]], [0.4, capColors[1]], [1, capColors[5]]])}
      </radialGradient>
      <linearGradient id={ids.collar} x1="0" x2="1" y1="0" y2="0">
        {renderStops(evenStops(CAP_COLORS[COLLAR_FINISH[bottle.cap]]))}
      </linearGradient>
      <linearGradient id={ids.sweep} x1="0" x2="1" y1="0" y2="0">
        {renderStops([[0, '#ffffff', 0], [0.5, '#ffffff', noir ? 0.35 : 0.6], [1, '#ffffff', 0]])}
      </linearGradient>
      <linearGradient id={ids.fade} x1="0" y1={FLOOR} x2="0" y2={FLOOR + 90} gradientUnits="userSpaceOnUse">
        {renderStops([[0, '#ffffff', 1], [1, '#ffffff', 0]])}
      </linearGradient>
      <mask id={ids.mask} maskUnits="userSpaceOnUse" x="-400" y={FLOOR - 2} width="1200" height="400">
        <rect x="-400" y={FLOOR} width="1200" height="400" fill={url(ids.fade)} />
      </mask>
      <linearGradient id={ids.boxShade} x1="0" y1="0" x2="1" y2="1">
        {renderStops([[0, '#ffffff', 0.12], [0.5, '#ffffff', 0], [1, '#000000', 0.16]])}
      </linearGradient>
      <radialGradient id={ids.mist}>{renderStops([[0, '#ffffff', 0.9], [1, '#ffffff', 0]])}</radialGradient>
      <clipPath id={ids.body}>
        <path d={geometry.body} />
      </clipPath>
      <clipPath id={ids.inner}>
        <path d={geometry.inner} />
      </clipPath>
    </defs>
  )
}

/* -------------------------------------------------------------- Éclairage -- */
function StudioLight({ ids }: { ids: Ids }) {
  return (
    <>
      <ellipse cx={200} cy={230} rx={240} ry={220} fill={url(ids.glow)} />
      <rect x={-2000} y={370} width={4400} height={2400} fill={url(ids.floor)} />
    </>
  )
}

function NoirLight({ ids }: { ids: Ids }) {
  return (
    <>
      <ellipse cx={200} cy={250} rx={260} ry={240} fill={url(ids.spot)} />
      <rect x={-2000} y={FLOOR} width={4400} height={2000} fill="#000000" opacity={0.3} />
      <ellipse cx={200} cy={FLOOR + 6} rx={230} ry={34} fill={url(ids.pool)} />
    </>
  )
}

function TornPaper({ random, color, noir }: { random: () => number; color: string; noir: boolean }) {
  const top = 136 + random() * 26
  const bottom = 316 + random() * 28
  const angle = -5 + random() * 4
  const d = tornStripPath(random, -80, 480, top, bottom, 7)
  const fiber = noir ? shade(color, 0.12) : mix(color, '#ffffff', 0.6)
  return (
    <g transform={`rotate(${angle.toFixed(2)} 200 250)`}>
      <path d={d} fill={fiber} transform="translate(0 -3)" />
      <path d={d} fill={fiber} transform="translate(0 3.5)" />
      <path d={d} fill={color} />
    </g>
  )
}

function FloorShadow({ cx, width, ids, noir }: { cx: number; width: number; ids: Ids; noir: boolean }) {
  return (
    <>
      <ellipse cx={cx} cy={FLOOR + 2} rx={width / 2 + 30} ry={noir ? 8 : 11} fill={url(ids.shadow)} />
      <ellipse cx={cx} cy={FLOOR} rx={Math.max(8, width / 2 - 4)} ry={2.2} fill="#000000" opacity={noir ? 0.85 : 0.3} />
    </>
  )
}

/* ---------------------------------------------------------------- Flacon -- */
function Label({ rect, tone, texts, bare }: { rect: Rect; tone: 'cream' | 'black'; texts: Texts; bare?: boolean }) {
  const background = tone === 'black' ? '#161311' : '#f3ebe0'
  const ink = tone === 'black' ? '#f2e9de' : '#0b0b0b'
  const pad = rect.w * 0.1

  if (bare) {
    return (
      <g>
        <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill={background} />
        <rect x={rect.x + pad} y={rect.y + pad} width={rect.w * 0.6} height={rect.h * 0.14} fill={ink} />
        <rect x={rect.x + pad} y={rect.y + rect.h - pad - 4} width={rect.w * 0.8} height={2} fill={ink} opacity={0.6} />
      </g>
    )
  }

  const narrow = rect.w < 90
  const inner = rect.w - pad * 2
  const lines = wrapWords(texts.name, narrow ? 8 : 10).slice(0, 3)
  const longest = Math.max(...lines.map((line) => line.length))
  const size = Math.min(rect.w * 0.19, inner / (longest * 0.56), (rect.h * 0.46) / (lines.length * 0.95))
  const small = Math.max(5.2, rect.w * 0.064)
  const first = rect.y + pad + size * 0.78
  const kindY = first + (lines.length - 1) * size * 0.95 + small * 2
  const bottom = rect.y + rect.h - pad * 0.9
  const brand = texts.brand.toLowerCase()

  return (
    <g>
      <rect x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill={background} />
      <text fill={ink} fontSize={size} fontWeight={800} letterSpacing={-size * 0.045}>
        {lines.map((line, index) => (
          <tspan key={index} x={rect.x + pad} y={first + index * size * 0.95}>
            {line}
          </tspan>
        ))}
      </text>
      <text x={rect.x + pad} y={kindY} fill={ink} fontSize={small} fontWeight={500} opacity={0.85}>
        {texts.kind}
      </text>
      <line
        x1={rect.x + pad}
        x2={rect.x + rect.w - pad}
        y1={bottom - small * (narrow ? 2.7 : 1.7)}
        y2={bottom - small * (narrow ? 2.7 : 1.7)}
        stroke={ink}
        strokeWidth={0.5}
        opacity={0.6}
      />
      {narrow ? (
        <>
          <text x={rect.x + pad} y={bottom - small * 1.15} fill={ink} fontSize={small * 0.92} fontWeight={600}>
            {brand}
          </text>
          <text x={rect.x + pad} y={bottom} fill={ink} fontSize={small * 0.92}>
            {texts.volume}
          </text>
        </>
      ) : (
        <>
          <text x={rect.x + pad} y={bottom} fill={ink} fontSize={small * 0.95} fontWeight={600}>
            {brand}
          </text>
          <text x={rect.x + rect.w - pad} y={bottom} fill={ink} fontSize={small * 0.95} textAnchor="end">
            {texts.volume}
          </text>
        </>
      )}
    </g>
  )
}

function Engraving({ at, texts, light, width }: { at: { x: number; y: number }; texts: Texts; light: boolean; width: number }) {
  const lines = wrapWords(texts.name, 12).slice(0, 2)
  const longest = Math.max(...lines.map((line) => line.length))
  const size = Math.min(22, (width * 0.6) / (longest * 0.56))
  const color = light ? '#f7f2ea' : '#111111'
  const startY = at.y - ((lines.length - 1) * size * 0.95) / 2
  return (
    <g opacity={0.88}>
      <text textAnchor="middle" fill={color} fontSize={size} fontWeight={800} letterSpacing={-size * 0.04}>
        {lines.map((line, index) => (
          <tspan key={index} x={at.x} y={startY + index * size * 0.95}>
            {line}
          </tspan>
        ))}
      </text>
      <text
        x={at.x}
        y={startY + (lines.length - 1) * size * 0.95 + 14}
        textAnchor="middle"
        fill={color}
        fontSize={6.5}
        letterSpacing={1.3}
        opacity={0.8}
      >
        {texts.brand.toUpperCase()}
      </text>
    </g>
  )
}

function Cap({ geometry, ids, finish }: { geometry: BottleGeometry; ids: Ids; finish: CapFinish }) {
  const { x, y, w, h } = geometry.cap
  const fill = url(ids.cap)

  if (geometry.capShape === 'pump') {
    return (
      <g className="art-pump">
        <rect x={x + w * 0.3} y={y + h * 0.55} width={w * 0.4} height={h * 0.5} fill={fill} />
        <rect x={x} y={y} width={w} height={h * 0.62} rx={3} fill={fill} />
        <rect x={x + w} y={y + h * 0.16} width={11} height={6} rx={1.5} fill={fill} />
        <rect x={x} y={y} width={w} height={2.5} fill="#ffffff" opacity={0.3} />
      </g>
    )
  }

  if (geometry.capShape === 'sphere') {
    return (
      <g className="art-cap">
        <circle cx={x + w / 2} cy={y + h / 2} r={w / 2} fill={url(ids.capSphere)} />
      </g>
    )
  }

  const shapePath =
    geometry.capShape === 'dome'
      ? `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`
      : null

  return (
    <g className="art-cap">
      {shapePath ? (
        <path d={shapePath} fill={fill} />
      ) : (
        <rect x={x} y={y} width={w} height={h} rx={geometry.capShape === 'block' ? 2.5 : 4} fill={fill} />
      )}
      {!shapePath && <rect x={x + 2} y={y} width={w - 4} height={3} fill="#ffffff" opacity={0.24} />}
      {finish === 'wood' &&
        [0.28, 0.46, 0.7].map((t) => (
          <path
            key={t}
            d={`M${x + 6} ${y + h * t}Q${x + w / 2} ${y + h * t - 5} ${x + w - 6} ${y + h * t + 2}`}
            stroke="#3a2412"
            strokeWidth={1}
            fill="none"
            opacity={0.35}
          />
        ))}
      <rect x={x} y={y + h - 2.5} width={w} height={2.5} fill="#000000" opacity={0.22} />
    </g>
  )
}

function Bottle({
  spec,
  geometry,
  ids,
  noir,
  texts,
  bare = false,
}: {
  spec: BottleArt
  geometry: BottleGeometry
  ids: Ids
  noir: boolean
  texts: Texts
  bare?: boolean
}) {
  const g = geometry
  const transparent = !spec.opaque
  const midY = g.bounds.y + g.bounds.h / 2
  const sweepStart = g.bounds.x - 60 + Math.tan((18 * Math.PI) / 180) * midY
  const showLabel = g.label && spec.label !== 'none'

  return (
    <g>
      <path d={g.body} fill={url(ids.glass)} />
      {transparent && (
        <g clipPath={url(ids.inner)}>
          <rect x={g.bounds.x} y={g.liquidTop} width={g.bounds.w} height={g.baseTop - g.liquidTop + 4} fill={url(ids.liquid)} />
          <rect x={g.bounds.x} y={g.liquidTop} width={g.bounds.w} height={2.2} fill="#ffffff" opacity={0.45} />
        </g>
      )}
      {transparent && (
        <g clipPath={url(ids.body)}>
          <rect x={g.bounds.x} y={g.baseTop} width={g.bounds.w} height={FLOOR - g.baseTop} fill="#ffffff" opacity={noir ? 0.08 : 0.24} />
        </g>
      )}
      <path d={g.body} fill="none" stroke={noir ? '#ffffff' : '#000000'} strokeOpacity={noir ? 0.3 : 0.22} strokeWidth={1.1} />
      {showLabel && g.label && (
        <Label rect={g.label} tone={spec.label === 'black' ? 'black' : 'cream'} texts={texts} bare={bare} />
      )}
      {!showLabel && g.engrave && !bare && (
        <Engraving at={g.engrave} texts={texts} light={noir || isDark(spec.liquid)} width={g.bounds.w} />
      )}
      <path
        d={g.highlight.d}
        fill={g.highlight.stroke ? 'none' : '#ffffff'}
        stroke={g.highlight.stroke ? '#ffffff' : 'none'}
        strokeWidth={g.highlight.width}
        strokeLinecap="round"
        opacity={spec.opaque ? 0.16 : 0.5}
      />
      <g clipPath={url(ids.body)}>
        <g transform="skewX(-18)">
          <rect
            className="art-sweep"
            x={sweepStart}
            y={g.bounds.y - 40}
            width={40}
            height={g.bounds.h + 80}
            fill={url(ids.sweep)}
            style={{ '--sweep': `${g.bounds.w + 170}px` } as CSSProperties}
          />
        </g>
      </g>
      {g.neck && <rect x={g.neck.x} y={g.neck.y} width={g.neck.w} height={g.neck.h} fill={url(ids.collar)} />}
      <Cap geometry={g} ids={ids} finish={spec.cap} />
    </g>
  )
}

/* ------------------------------------------------------ Coffrets & étuis -- */
function Box({
  rect,
  depth,
  box,
  ids,
  children,
}: {
  rect: Rect
  depth: number
  box: BoxArt
  ids: Ids
  children?: ReactNode
}) {
  const { x, y, w, h } = rect
  const dx = depth
  const dy = -depth * 0.75
  const top = `M${x} ${y}L${x + dx} ${y + dy}L${x + w + dx} ${y + dy}L${x + w} ${y}Z`
  const side = `M${x + w} ${y}L${x + w + dx} ${y + dy}L${x + w + dx} ${y + h + dy}L${x + w} ${y + h}Z`
  const seam = y + h * 0.17
  return (
    <g>
      <path d={side} fill={shade(box.color, -0.28)} />
      <path d={top} fill={shade(box.color, 0.14)} />
      <rect x={x} y={y} width={w} height={h} fill={box.color} />
      <rect x={x} y={y} width={w} height={h} fill={url(ids.boxShade)} />
      <line x1={x} x2={x + w} y1={seam} y2={seam} stroke="#000000" strokeOpacity={0.28} strokeWidth={0.8} />
      <line x1={x + w} x2={x + w + dx} y1={seam} y2={seam + dy} stroke="#000000" strokeOpacity={0.3} strokeWidth={0.8} />
      {children}
    </g>
  )
}

function Ribbon({ rect, depth, box }: { rect: Rect; depth: number; box: BoxArt }) {
  const color = box.accent === 'gold' ? '#b8954f' : box.accent === 'black' ? '#141414' : shade(box.color, 0.4)
  const rx = rect.x + rect.w * 0.8
  const width = 12
  const dy = -depth * 0.75
  return (
    <g>
      <rect x={rx} y={rect.y} width={width} height={rect.h} fill={color} />
      <path d={`M${rx} ${rect.y}L${rx + depth} ${rect.y + dy}L${rx + depth + width} ${rect.y + dy}L${rx + width} ${rect.y}Z`} fill={shade(color, 0.15)} />
    </g>
  )
}

function BoxText({ area, box, texts, caption }: { area: Omit<Rect, 'h'>; box: BoxArt; texts: Texts; caption: string }) {
  const ink = BOX_INK[box.accent]
  const lines = wrapWords(texts.name, 10).slice(0, 3)
  const longest = Math.max(...lines.map((line) => line.length))
  const size = Math.min(22, area.w / (longest * 0.56))
  const brandSize = Math.max(5.6, area.w * 0.052)
  const nameY = area.y + brandSize * 3.2 + size * 0.8
  return (
    <g fill={ink}>
      <text x={area.x} y={area.y + brandSize} fontSize={brandSize} fontWeight={600} letterSpacing={brandSize * 0.22}>
        {texts.brand.toUpperCase()}
      </text>
      <line x1={area.x} x2={area.x + area.w} y1={area.y + brandSize * 1.9} y2={area.y + brandSize * 1.9} stroke={ink} strokeWidth={0.6} opacity={0.7} />
      <text fontSize={size} fontWeight={800} letterSpacing={-size * 0.045}>
        {lines.map((line, index) => (
          <tspan key={index} x={area.x} y={nameY + index * size * 0.95}>
            {line}
          </tspan>
        ))}
      </text>
      <text x={area.x} y={nameY + (lines.length - 1) * size * 0.95 + brandSize * 2.6} fontSize={brandSize} opacity={0.85}>
        {caption}
      </text>
    </g>
  )
}

function VerticalBoxText({ rect, box, texts }: { rect: Rect; box: BoxArt; texts: Texts }) {
  const ink = BOX_INK[box.accent]
  const size = Math.min(rect.w * 0.3, (rect.h - 44) / (texts.name.length * 0.56))
  return (
    <g fill={ink}>
      <text
        transform={`translate(${rect.x + rect.w * 0.6} ${rect.y + rect.h - 20}) rotate(-90)`}
        fontSize={size}
        fontWeight={800}
        letterSpacing={-size * 0.045}
      >
        {texts.name}
      </text>
      <text
        transform={`translate(${rect.x + rect.w * 0.84} ${rect.y + rect.h - 20}) rotate(-90)`}
        fontSize={7}
        letterSpacing={1.6}
        fontWeight={600}
      >
        {`${texts.brand.toUpperCase()} — ${texts.volume}`}
      </text>
    </g>
  )
}

/** Soin parfumé en tube (contenu des coffrets). */
function Tube({ x, color, ink, texts }: { x: number; color: string; ink: string; texts: Texts }) {
  const w = 58
  const top = 250
  const capTop = FLOOR - 34
  return (
    <g>
      <path
        d={`M${x} ${top}H${x + w}L${x + w - 4} ${capTop}H${x + 4}Z`}
        fill={color}
        stroke="#000000"
        strokeOpacity={0.15}
        strokeWidth={0.8}
      />
      <rect x={x - 1} y={top - 5} width={w + 2} height={7} fill={shade(color, -0.08)} />
      <rect x={x + 3} y={capTop} width={w - 6} height={34} rx={2} fill={shade(color, -0.35)} />
      <rect x={x + 8} y={top + 12} width={5} height={capTop - top - 24} fill="#ffffff" opacity={0.35} />
      <text
        transform={`translate(${x + w * 0.62} ${capTop - 14}) rotate(-90)`}
        fill={ink}
        fontSize={15}
        fontWeight={800}
        letterSpacing={-0.6}
      >
        {texts.name}
      </text>
      <text transform={`translate(${x + w * 0.84} ${capTop - 14}) rotate(-90)`} fill={ink} fontSize={5.5} letterSpacing={1.2}>
        SOIN PARFUMÉ
      </text>
    </g>
  )
}

function Mist({ x, y, random, ids }: { x: number; y: number; random: () => number; ids: Ids }) {
  const particles = Array.from({ length: 7 }, (_, index) => ({
    cx: x + (random() - 0.5) * 14,
    cy: y - random() * 6,
    r: 7 + random() * 10,
    delay: (index * 0.46).toFixed(2),
    dx: ((random() - 0.5) * 70).toFixed(0),
    opacity: (0.3 + random() * 0.3).toFixed(2),
  }))
  return (
    <g className="art-mist">
      {particles.map((particle, index) => (
        <circle
          key={index}
          cx={particle.cx}
          cy={particle.cy}
          r={particle.r}
          fill={url(ids.mist)}
          style={{ '--d': `${particle.delay}s`, '--dx': `${particle.dx}px`, '--o': particle.opacity } as CSSProperties}
        />
      ))}
    </g>
  )
}

/* ---------------------------------------------------------------- Scènes -- */
function detailViewBox(spec: ArtSpec, geometry: BottleGeometry): string {
  if (spec.kind === 'coffret') {
    const cx = spec.minis ? 218 : 236
    const cy = spec.minis ? 262 : 292
    return `${cx - 105} ${cy - 131} 210 262`
  }
  const target = geometry.label ?? { x: 130, y: 330, w: 140, h: 70 }
  const cx = target.x + target.w / 2
  const cy = target.y + target.h / 2
  const width = Math.max(target.w, target.h * 0.8) * 1.5
  const height = width * 1.25
  return `${(cx - width / 2).toFixed(1)} ${(cy - height / 2).toFixed(1)} ${width.toFixed(1)} ${height.toFixed(1)}`
}

export interface PerfumeArtProps {
  id: string
  view: ArtView
  title: string
  className?: string
  /** Animations en continu (visuels héros). */
  live?: boolean
}

export const PerfumeArt = memo(function PerfumeArt({ id, view, title, className, live = false }: PerfumeArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const ids = makeIds(`art${uid}`)
  const spec = productArt[id] ?? fallbackArt
  const product = productIndex.get(id)
  const texts: Texts = {
    name: labelName(product?.name ?? 'beauty success'),
    kind: product ? KIND_LABEL[product.category] : 'eau de parfum',
    brand: product?.brand ?? 'Beauty Success',
    volume: (product?.volume ?? '50 ml').split('+')[0].trim(),
  }
  const noir = view === 'noir'
  const geometry = bottleGeometry(spec.bottle.shape)
  const random = seededRandom(hashString(id))
  const viewBox = view === 'detail' ? detailViewBox(spec, geometry) : `0 0 ${VIEW_W} ${VIEW_H}`
  const bottleProps = { spec: spec.bottle, geometry, ids, noir, texts }

  let shadows: ReactNode
  let objects: ReactNode
  let mistOrigin: { x: number; y: number } | null = null

  if (spec.kind === 'coffret' && view === 'pack') {
    // Vue « contenu » : les produits sortis du coffret.
    const box = spec.box ?? { color: '#171412', accent: 'gold' as const }
    if (spec.minis) {
      const centers = Array.from({ length: spec.minis }, (_, i) => 104 + i * 64)
      shadows = centers.map((cx) => <FloorShadow key={cx} cx={cx} width={64} ids={ids} noir={noir} />)
      objects = centers.map((cx) => (
        <g key={cx} transform={place(cx, 0.5)}>
          <Bottle {...bottleProps} />
        </g>
      ))
    } else {
      const tubeColor = isDark(box.color) ? '#efe6da' : mix(box.color, '#ffffff', 0.35)
      shadows = (
        <>
          <FloorShadow cx={150} width={geometry.bounds.w * 0.88} ids={ids} noir={noir} />
          <FloorShadow cx={277} width={58} ids={ids} noir={noir} />
        </>
      )
      objects = (
        <>
          <Tube x={248} color={tubeColor} ink="#0b0b0b" texts={texts} />
          <g transform={place(150, 0.88)}>
            <Bottle {...bottleProps} />
          </g>
        </>
      )
    }
  } else if (spec.kind === 'coffret') {
    const box = spec.box ?? { color: '#171412', accent: 'gold' as const }
    if (spec.minis) {
      const rect = { x: 106, y: 196, w: 224, h: 244 }
      const centers = Array.from({ length: spec.minis }, (_, i) => 134 + i * 48)
      shadows = (
        <>
          <FloorShadow cx={rect.x + rect.w / 2 + 8} width={rect.w} ids={ids} noir={noir} />
          {centers.map((cx) => (
            <FloorShadow key={cx} cx={cx} width={44} ids={ids} noir={noir} />
          ))}
        </>
      )
      objects = (
        <>
          <Box rect={rect} depth={20} box={box} ids={ids}>
            <BoxText area={{ x: rect.x + 22, y: rect.y + 28, w: rect.w - 70 }} box={box} texts={texts} caption="coffret — 4 × 10 ml" />
          </Box>
          {centers.map((cx) => (
            <g key={cx} transform={place(cx, 0.36)}>
              <Bottle {...bottleProps} bare />
            </g>
          ))}
        </>
      )
    } else {
      const rect = { x: 150, y: 206, w: 182, h: 234 }
      shadows = (
        <>
          <FloorShadow cx={rect.x + rect.w / 2 + 10} width={rect.w} ids={ids} noir={noir} />
          <FloorShadow cx={122} width={geometry.bounds.w * 0.64} ids={ids} noir={noir} />
        </>
      )
      objects = (
        <>
          <Box rect={rect} depth={20} box={box} ids={ids}>
            <BoxText area={{ x: rect.x + 28, y: rect.y + 52, w: rect.w * 0.8 - 36 }} box={box} texts={texts} caption="coffret cadeau" />
            <Ribbon rect={rect} depth={20} box={box} />
          </Box>
          <g transform={place(122, 0.64)}>
            <Bottle {...bottleProps} />
          </g>
        </>
      )
    }
  } else if (view === 'pack') {
    const rect = { x: 202, y: 150, w: 126, h: 290 }
    const box: BoxArt =
      spec.box ??
      (spec.bottle.opaque
        ? { color: '#171412', accent: spec.bottle.cap === 'gold' ? 'gold' : 'cream' }
        : { color: '#efe7dc', accent: 'black' })
    shadows = (
      <>
        <FloorShadow cx={rect.x + rect.w / 2 + 8} width={rect.w} ids={ids} noir={noir} />
        <FloorShadow cx={150} width={geometry.bounds.w * 0.78} ids={ids} noir={noir} />
      </>
    )
    objects = (
      <>
        <Box rect={rect} depth={16} box={box} ids={ids}>
          <VerticalBoxText rect={rect} box={box} texts={texts} />
        </Box>
        <g transform={place(150, 0.78)}>
          <Bottle {...bottleProps} />
        </g>
      </>
    )
  } else {
    const cap = geometry.cap
    mistOrigin =
      geometry.capShape === 'pump' ? { x: cap.x + cap.w + 14, y: cap.y + 9 } : { x: cap.x + cap.w / 2, y: cap.y - 4 }
    shadows = <FloorShadow cx={200} width={geometry.bounds.w} ids={ids} noir={noir} />
    objects = <Bottle {...bottleProps} />
  }

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      focusable="false"
      className={cn('art', live && 'art-live', className)}
    >
      <Defs ids={ids} spec={spec} noir={noir} geometry={geometry} />
      <rect x={-2000} y={-2000} width={4400} height={4500} fill={noir ? NOIR : spec.backdrop} />
      {noir ? <NoirLight ids={ids} /> : <StudioLight ids={ids} />}
      {spec.paper && <TornPaper random={random} color={noir ? shade(spec.paper, -0.55) : spec.paper} noir={noir} />}
      {shadows}
      <g id={ids.obj} className="art-object">
        {objects}
      </g>
      {noir && (
        <g mask={url(ids.mask)} opacity={0.2}>
          <use href={`#${ids.obj}`} transform={`matrix(1 0 0 -1 0 ${FLOOR * 2})`} />
        </g>
      )}
      {noir && mistOrigin && <Mist x={mistOrigin.x} y={mistOrigin.y} random={random} ids={ids} />}
    </svg>
  )
})
