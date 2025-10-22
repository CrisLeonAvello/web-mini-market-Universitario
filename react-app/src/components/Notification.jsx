import React, {useEffect, useState} from 'react'

let notifyFn = null
export function notify(message, type='success'){
  if(notifyFn) notifyFn(message,type)
}

export default function Notification(){
  const [items, setItems] = useState([])
  useEffect(()=>{ notifyFn = (m,t)=>{
      const id = Date.now()
      setItems(prev=> [...prev,{id,message:m,type:t}])
      setTimeout(()=> setItems(prev=> prev.filter(i=> i.id!==id)),3500)
    }
  },[])

  return (
    <div className="notification-container">
      {items.map(i=> (
        <div key={i.id} className={`notification ${i.type}`} style={{marginBottom:8}}>
          <div className="notification-text">{i.message}</div>
        </div>
      ))}
    </div>
  )
}
