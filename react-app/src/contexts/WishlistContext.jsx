import React, {createContext, useContext, useEffect, useState} from 'react'

const WishlistContext = createContext()
export function useWishlist(){ return useContext(WishlistContext) }

export function WishlistProvider({children}){
  const [items, setItems] = useState([])
  useEffect(()=>{
    try{ const s = JSON.parse(localStorage.getItem('wishlist')||'[]'); setItems(Array.isArray(s)?s:[]) }catch(e){ setItems([]) }
  },[])
  useEffect(()=> localStorage.setItem('wishlist', JSON.stringify(items)),[items])
  function toggle(id){ setItems(prev=> prev.includes(id)? prev.filter(x=>x!==id): [...prev,id]) }
  function clear(){ setItems([]) }
  return <WishlistContext.Provider value={{items,toggle,clear}}>{children}</WishlistContext.Provider>
}
