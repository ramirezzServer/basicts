import React, { useEffect, useState } from 'react'
import Chart from './components/Chart'
import Controls from './components/Controls'
import Toast from './components/Toast'
import { fetchCoins, fetchCoinHistory, Coin, TimeRange } from './utils/api'

const App: React.FC = () => {
const [coins, setCoins] = useState<Coin[]>([])
const [selectedId, setSelectedId] = useState<string | null>(null)
const [timeRange, setTimeRange] = useState<TimeRange>(180)
const [labels, setLabels] = useState<string[]>([])
const [points, setPoints] = useState<number[]>([])
const [loadingCoins, setLoadingCoins] = useState<boolean>(true)
const [loadingChart, setLoadingChart] = useState<boolean>(false)
const [error, setError] = useState<string | null>(null)

  // Load coins awal
useEffect(() => {
    ;(async () => {
    try {
        setLoadingCoins(true)
        setError(null)
        const data = await fetchCoins()
        setCoins(data)
        if (data.length > 0) setSelectedId(data[0].id)
    } catch (err) {
        console.error(err)
        setError('Gagal memuat daftar coin')
    } finally {
        setLoadingCoins(false)
    }
    })()
}, [])

  // Load chart tiap coin / timeRange berubah
useEffect(() => {
    if (!selectedId) return

    ;(async () => {
    try {
        setLoadingChart(true)
        setError(null)
        const { labels, points } = await fetchCoinHistory(selectedId, timeRange)
        setLabels(labels)
        setPoints(points)
    } catch (err) {
        console.error(err)
        setError('Gagal memuat data chart')
    } finally {
        setLoadingChart(false)
    }
    })()
}, [selectedId, timeRange])

const selectedCoin = coins.find((c) => c.id === selectedId) ?? null

return (
    <div className="app">
    <header className="app-header">
        <h1>Crypto Tracker</h1>
        <p>Lihat harga & chart top crypto (data dari CoinGecko API)</p>
    </header>

    <Toast message={error} onClose={() => setError(null)} />

    <div className="layout">
        <aside className="sidebar">
        <h2>Top 10 Coins</h2>
        {loadingCoins ? (
            <p>Loading coins...</p>
        ) : (
            <ul className="coin-list">
            {coins.map((coin) => (
                <li
                key={coin.id}
                className={`coin-item ${coin.id === selectedId ? 'active' : ''}`}
                onClick={() => setSelectedId(coin.id)}
                >
                <img src={coin.image} alt={coin.name} />
                <div className="coin-text">
                    <span className="coin-name">{coin.name}</span>
                    <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                </div>
                <div className="coin-price">
                    <span>${coin.current_price.toLocaleString()}</span>
                    <span
                    className={`coin-change ${
                        coin.price_change_percentage_24h >= 0 ? 'up' : 'down'
                    }`}
                    >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </div>
                </li>
            ))}
            </ul>
        )}
        </aside>

        <main className="main">
        <Controls timeRange={timeRange} onTimeRangeChange={setTimeRange} />

        <section className="card chart-card">
            {loadingChart || !selectedCoin ? (
            <p>Loading chart...</p>
            ) : (
            <>
                <div className="card-header">
                <div>
                    <h2>{selectedCoin.name}</h2>
                    <p>{selectedCoin.symbol.toUpperCase()}</p>
                </div>
                <div className="price-big">
                    <span>${selectedCoin.current_price.toLocaleString()}</span>
                    <span
                    className={`coin-change ${
                        selectedCoin.price_change_percentage_24h >= 0 ? 'up' : 'down'
                    }`}
                    >
                    {selectedCoin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </div>
                </div>

                <Chart
                labels={labels}
                data={points}
                coinName={selectedCoin.name}
                />
            </>
            )}
        </section>
        </main>
    </div>
    </div>
)
}

export default App
