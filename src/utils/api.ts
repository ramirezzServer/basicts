export type Coin = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

// sekarang range punya 6 bulan (180 hari)
export type TimeRange = 1 | 7 | 30 | 90 | 180

const API_BASE = 'https://api.coingecko.com/api/v3'

export async function fetchCoins(): Promise<Coin[]> {
  const res = await fetch(
    `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
  )

  if (!res.ok) {
    throw new Error('Gagal mengambil data coin')
  }

  return res.json() as Promise<Coin[]>
}

// grafik harga
export async function fetchCoinHistory(
  coinId: string,
  days: TimeRange
): Promise<{ labels: string[]; points: number[] }> {
  // HAPUS interval biar pake default dari CoinGecko (lebih aman)
  const res = await fetch(
    `${API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  )

  if (!res.ok) {
    throw new Error('Gagal mengambil data chart')
  }

  const data = (await res.json()) as { prices: [number, number][] }

  const labels: string[] = []
  const points: number[] = []

  for (const [timestamp, price] of data.prices) {
    const d = new Date(timestamp)

    // 1 hari pakai jam, selain itu pakai tanggal
    const label =
      days === 1
        ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })

    labels.push(label)
    points.push(Number(price.toFixed(2)))
  }

  return { labels, points }
}
