type GradientPalette = {
  from: string;
  via?: string;
  to: string;
}

const palettes: GradientPalette[] = [
  // Azules modernos
  { from: 'from-blue-500/90', via: 'via-indigo-500/80', to: 'to-cyan-400/90' },
  // Morados elegantes
  { from: 'from-purple-500/90', via: 'via-pink-500/80', to: 'to-indigo-400/90' },
  // Verdes naturales
  { from: 'from-emerald-500/90', via: 'via-green-500/80', to: 'to-teal-400/90' },
  // Naranjas cálidos
  { from: 'from-orange-500/90', via: 'via-amber-500/80', to: 'to-yellow-400/90' },
  // Rosa suave
  { from: 'from-pink-500/90', via: 'via-rose-500/80', to: 'to-fuchsia-400/90' },
  // Cian fresco
  { from: 'from-cyan-500/90', via: 'via-sky-500/80', to: 'to-blue-400/90' },
  // Violeta profundo
  { from: 'from-violet-500/90', via: 'via-purple-500/80', to: 'to-indigo-400/90' },
  // Verde azulado
  { from: 'from-teal-500/90', via: 'via-cyan-500/80', to: 'to-emerald-400/90' }
]

export function getRandomGradient(): string {
  const palette = palettes[Math.floor(Math.random() * palettes.length)]
  return `${palette.from} ${palette.via} ${palette.to}`
}

export function getGradientFromString(str: string): string {
  // Genera un índice basado en el string para obtener un gradiente consistente
  const index = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `${palettes[index % palettes.length].from} ${palettes[index % palettes.length].via} ${palettes[index % palettes.length].to}`
}
