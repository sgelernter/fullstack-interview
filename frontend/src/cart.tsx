import { useState } from 'react'
import { placeOrder } from './api'
import { Modal } from './modal'
import type { CartItem } from './types'

type CartProps = {
  items: CartItem[]
  onSetQuantity: (productId: number, quantity: number) => void
  onOrderPlaced: () => void
}

export function Cart({ items, onSetQuantity, onOrderPlaced }: CartProps) {
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handlePlaceOrder = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await placeOrder(items)
      onOrderPlaced()
      setOpen(false)
      setConfirmed(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Cart (${count} items)`}
        className="relative p-2"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {open && (
        <Modal title="Your cart" onClose={() => setOpen(false)}>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3">
                    <span className="flex-1">{product.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSetQuantity(product.id, quantity - 1)}
                        aria-label={`Decrease quantity of ${product.title}`}
                        className="border rounded w-6 h-6"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{quantity}</span>
                      <button
                        onClick={() => onSetQuantity(product.id, quantity + 1)}
                        aria-label={`Increase quantity of ${product.title}`}
                        className="border rounded w-6 h-6"
                      >
                        +
                      </button>
                    </div>
                    <span className="w-20 text-right">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onSetQuantity(product.id, 0)}
                      aria-label={`Remove ${product.title}`}
                      className="text-gray-500 hover:text-black"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-right">Total: ${total.toFixed(2)}</p>
            </>
          )}
          {error && <p className="text-red-600 whitespace-pre-line">{error}</p>}
          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)} className="px-3 py-2">
              Close
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={items.length === 0 || submitting}
              className="bg-black text-white rounded px-3 py-2 disabled:opacity-50"
            >
              Place order
            </button>
          </div>
        </Modal>
      )}

      {confirmed && (
        <Modal title="Order placed" onClose={() => setConfirmed(false)}>
          <p>Thanks! Your order has been placed.</p>
          <div className="flex justify-end">
            <button
              onClick={() => setConfirmed(false)}
              className="bg-black text-white rounded px-3 py-2"
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
