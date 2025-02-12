type GradientPalette = {
  from: string;
  via?: string;
  to: string;
}

const palettes: GradientPalette[] = [
  { from: 'from-blue-500/90', via: 'via-indigo-500/80', to: 'to-cyan-400/90' },
  { from: 'from-purple-500/90', via: 'via-pink-500/80', to: 'to-indigo-400/90' },
  { from: 'from-emerald-500/90', via: 'via-green-500/80', to: 'to-teal-400/90' },
  { from: 'from-orange-500/90', via: 'via-amber-500/80', to: 'to-yellow-400/90' },
  { from: 'from-pink-500/90', via: 'via-rose-500/80', to: 'to-fuchsia-400/90' },
  { from: 'from-cyan-500/90', via: 'via-sky-500/80', to: 'to-blue-400/90' },
  { from: 'from-violet-500/90', via: 'via-purple-500/80', to: 'to-indigo-400/90' },
  { from: 'from-teal-500/90', via: 'via-cyan-500/80', to: 'to-emerald-400/90' }
]

export function getRandomGradient(): string {
  const palette = palettes[Math.floor(Math.random() * palettes.length)]
  return `${palette.from} ${palette.via} ${palette.to}`
}

export function getGradientFromString(str: string): string {
  const index = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `${palettes[index % palettes.length].from} ${palettes[index % palettes.length].via} ${palettes[index % palettes.length].to}`
}
