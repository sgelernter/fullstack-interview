import { useEffect, useState } from 'react'
import { getProducts } from './api'
import { Modal } from './modal'
import type { Product } from './types'

const PAGE_SIZE = 25

type ProductListProps = {
  onAddToCart: (product: Product) => void
}

export function ProductList({ onAddToCart }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading products…</p>
  if (error) return <p className="text-red-600">{error}</p>

  const pageCount = Math.ceil(products.length / PAGE_SIZE)
  const visible = products.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Products</h2>

      <ul className="flex flex-col gap-3">
        {visible.map((product) => (
          <li
            key={product.id}
            onClick={() => setSelected(product)}
            className="flex items-center gap-4 border rounded p-3 cursor-pointer transition-shadow hover:shadow-md"
          >
            <img src={product.image} alt={product.title} className="w-16 h-16 object-contain" />
            <div className="flex-1">
              <p className="font-medium">{product.title}</p>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
            <p className="font-semibold">${product.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>

      {pageCount > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="underline disabled:opacity-50 disabled:no-underline"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page + 1} of {pageCount}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= pageCount - 1}
            className="underline disabled:opacity-50 disabled:no-underline"
          >
            Next
          </button>
        </div>
      )}

      {selected && (
        <Modal title="Add to cart?" onClose={() => setSelected(null)}>
          <p>
            {selected.title} — ${selected.price.toFixed(2)}
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setSelected(null)} className="px-3 py-2">
              Cancel
            </button>
            <button
              onClick={() => {
                onAddToCart(selected)
                setSelected(null)
              }}
              className="bg-black text-white rounded px-3 py-2"
            >
              Add to cart
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}
