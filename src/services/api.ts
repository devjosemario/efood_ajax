import type { Restaurant } from '../models/Restaurant'

export async function getRestaurants(): Promise<Restaurant[]> {
  const res = await fetch('https://api-ebac.vercel.app/api/efood/restaurantes')
  if (!res.ok) throw new Error(`Erro ao buscar restaurantes (HTTP ${res.status})`)
  return res.json()
}
