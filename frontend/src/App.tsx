import { useEffect, useState } from 'react'
import { getMe, logout } from './api'
import { AuthPage } from './auth'
import { Cart } from './cart'
import { OrderHistory } from './orders'
import { ProductList } from './products'
import type { CartItem, Product, User } from './types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (product: Product) =>
    setCart((cart) =>
      cart.some((item) => item.product.id === product.id)
        ? cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...cart, { product, quantity: 1 }],
    )

  // A quantity of 0 removes the item entirely
  const setQuantity = (productId: number, quantity: number) =>
    setCart((cart) =>
      quantity <= 0
        ? cart.filter((item) => item.product.id !== productId)
        : cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    )

  // Restore an existing session on load; a rejection just means not logged in
  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    setCart([])
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Fullstack Interview</h1>
        {user && (
          <Cart items={cart} onSetQuantity={setQuantity} onOrderPlaced={() => setCart([])} />
        )}
      </header>
      {loading ? null : user ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <p>Logged in as {user.email}</p>
            <OrderHistory />
            <button onClick={handleLogout} className="text-sm underline">
              Log out
            </button>
          </div>
          <ProductList onAddToCart={addToCart} />
        </div>
      ) : (
        <AuthPage onAuthenticated={setUser} />
      )}
    </main>
  )
}

export default App
