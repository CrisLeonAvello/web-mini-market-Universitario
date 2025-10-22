import React, {createContext, useContext, useEffect, useState} from 'react'

const CartContext = createContext()

export function useCart(){ return useContext(CartContext) }

export function CartProvider({children}){
  const [cart, setCart] = useState([])

  useEffect(()=>{
    try{
      const stored = JSON.parse(localStorage.getItem('cart')||'[]')
      setCart(Array.isArray(stored)?stored:[])
    }catch(e){ setCart([]) }
  },[])

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart))
  },[cart])

  function addToCart(id){
    setCart(prev=>{
      const found = prev.find(i=> i.id===id)
      if(found) return prev.map(i=> i.id===id?{...i,quantity:i.quantity+1}:i)
      return [...prev,{id,quantity:1}]
    })
  }

  function removeFromCart(id){ setCart(prev=> prev.filter(i=> i.id!==id)) }
  function updateQuantity(id,qty){ setCart(prev=> prev.map(i=> i.id===id?{...i,quantity:qty}:i)) }
  function clearCart(){ setCart([]) }

  return <CartContext.Provider value={{cart, addToCart, removeFromCart, updateQuantity, clearCart}}>{children}</CartContext.Provider>
}
