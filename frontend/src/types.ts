export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

export type User = {
  id: string
  email: string
}

// Shape returned by fakestoreapi.com/products
export type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: { rate: number; count: number }
}

export type CartItem = {
  product: Product
  quantity: number
}

export type OrderStatus ='PLACED' | 'FULFILLED' | 'CANCELLED'

export type Order = {
  id: string
  status: OrderStatus
  // Current orders store CartItems; early orders stored one Product per unit
  contents: (CartItem | Product)[]
  created_at: string
}

export type Me = User & {
  orders: Order[]
}
