import { createContext, useContext, useState } from 'react'
import { MOCK_PRODUCTS } from '../data/mockData'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(MOCK_PRODUCTS)

  const toggleTrack = (id) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, isTracked: !p.isTracked } : p
    ))
  }

  const addProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev])
  }

  return (
    <ProductContext.Provider value={{ products, toggleTrack, addProduct }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) throw new Error("useProducts must be used within ProductProvider")
  return context
}
