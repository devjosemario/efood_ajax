import { useEffect, useMemo, useRef, useState } from 'react'
import { getRestaurants } from '../services/api'
import type { CartItem, Product, Restaurant } from '../models/Restaurant'
import RestaurantList from '../components/RestaurantList'
import ProductModal from '../components/ProductModal'
import CheckoutDrawer from '../components/CheckoutDrawer'

type Step = 'cart' | 'delivery' | 'payment' | 'confirm'

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cart, setCart] = useState<CartItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [step, setStep] = useState<Step>('cart')

  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setLoading(true)
    getRestaurants()
      .then((data) => {
        setRestaurants(data)
        setSelectedRestaurantId(data[0]?.id ?? null)
        setError(null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Erro desconhecido'))
      .finally(() => setLoading(false))
  }, [])

  const selectedRestaurant = useMemo(() => {
    if (selectedRestaurantId === null) return null
    return restaurants.find((r) => r.id === selectedRestaurantId) ?? null
  }, [restaurants, selectedRestaurantId])

  useEffect(() => {
    if (selectedRestaurant && menuRef.current) {
      menuRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedRestaurant])

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart])

  function addToCart(product: Product) {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 }
        return copy
      }
      return [...prev, { product, quantity: 1 }]
    })
    setStep('cart')
    setDrawerOpen(true)
  }

  function removeItem(productId: number) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId))
  }

  function clearCart() {
    setCart([])
  }

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="brand">eFood</div>

          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={() => {
                setStep('cart')
                setDrawerOpen(true)
              }}
              aria-label="Abrir carrinho"
            >
              🛒 <strong>{cartCount}</strong>
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {loading && <p>Carregando...</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        {!loading && !error && (
          <>
            <h2 className="section-title">Restaurantes</h2>
            <RestaurantList
              restaurants={restaurants}
              selectedRestaurantId={selectedRestaurantId}
              onSelectRestaurant={setSelectedRestaurantId}
            />

            {selectedRestaurant && (
              <div ref={menuRef}>
                <h2 className="section-title">Cardápio</h2>
                <p className="section-meta muted">
                  {selectedRestaurant.titulo} • {selectedRestaurant.tipo} • Nota {selectedRestaurant.avaliacao}
                </p>

                <div className="grid">
                  {selectedRestaurant.cardapio.map((p) => (
                    <article className="product" key={p.id}>
                      <img className="product-img" src={p.foto} alt={p.nome} />
                      <div className="product-body">
                        <h4>{p.nome}</h4>
                        <p className="muted">{p.descricao}</p>
                        <button className="btn" onClick={() => setSelectedProduct(p)}>
                          Comprar o produto
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
          />
        )}
      </main>

      <CheckoutDrawer
        isOpen={drawerOpen}
        step={step}
        cart={cart}
        onClose={() => setDrawerOpen(false)}
        onRemoveItem={removeItem}
        onSetStep={setStep}
        onClearCart={clearCart}
      />
    </>
  )
}
