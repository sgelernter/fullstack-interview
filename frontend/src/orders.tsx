import { useState } from 'react'
import { cancelOrder, getMe } from './api'
import { Modal } from './modal'
import type { CartItem, Order } from './types'

// Group like products into CartItems, accepting both stored order formats
const groupItems = (contents: Order['contents']): CartItem[] => {
  const grouped = new Map<number, CartItem>()
  for (const entry of contents) {
    const { product, quantity } = 'product' in entry ? entry : { product: entry, quantity: 1 }
    const existing = grouped.get(product.id)
    grouped.set(product.id, { product, quantity: (existing?.quantity ?? 0) + quantity })
  }
  return [...grouped.values()]
}

const totalOf = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [selected, setSelected] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch on open so orders placed this session are included
  const open = async () => {
    setError(null)
    setOrders([])
    try {
      const me = await getMe()
      setOrders(me.orders.toSorted((a, b) => b.created_at.localeCompare(a.created_at)))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const cancel = async (orderId: string) => {
    setError(null)
    try {
      await cancelOrder(orderId)
      setOrders((orders) => orders?.filter((order) => order.id !== orderId) ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  const close = () => {
    setOrders(null)
    setSelected(null)
  }

  const selectedItems = selected ? groupItems(selected.contents) : []

  return (
    <>
      <button onClick={open} className="text-sm underline">
        View order history
      </button>

      {orders && (
        <Modal title={selected ? 'Order details' : 'Order history'} onClose={close}>
          {error && <p className="text-red-600">{error}</p>}

          {selected ? (
            <>
              <p className="font-mono text-xs text-gray-600">{selected.id}</p>
              <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {selectedItems.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3">
                    <span className="flex-1">{product.title}</span>
                    <span className="w-8 text-center">×{quantity}</span>
                    <span className="w-20 text-right">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-right">
                Total: ${totalOf(selectedItems).toFixed(2)}
              </p>
              <div className="flex justify-end">
                <button onClick={() => setSelected(null)} className="px-3 py-2">
                  Back
                </button>
              </div>
            </>
          ) : orders.length === 0 && !error ? (
            <p>No orders yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {orders.map((order) => (
                <li
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="flex items-center gap-3 border rounded p-2 cursor-pointer transition-shadow hover:shadow-md"
                >
                  <span className="flex-1 font-mono text-xs truncate">{order.id}</span>
                  <span className="text-sm">{order.status}</span>
                  <span className="w-20 text-right">
                    ${totalOf(groupItems(order.contents)).toFixed(2)}
                  </span>
                  {order.status === 'PLACED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation() // don't open the order's details
                        cancel(order.id)
                      }}
                      className="text-sm text-red-600 underline"
                    >
                      Cancel order
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      )}
    </>
  )
}
