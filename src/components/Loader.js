import React from "react";
import './Loader.css'

const Loader = () => {
   return (
      <div className={'loader'}>
         <h2>Загрузка...</h2>
         <div className="lds-ripple">
            <div/>
            <div/>
         </div>
      </div>
   )
}

export default Loader