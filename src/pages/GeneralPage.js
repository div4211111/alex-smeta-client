import React from "react";
import {NavLink} from "react-router-dom";

const GeneralPage = () => {
   return (
      <div className={'d-flex flex-column justify-content-center'} style={{marginTop: '150px'}}>
         <h1 style={{color: '#2C4767'}}>Alex Smeta</h1>
         <p className={'fs-3'} style={{color: '#2C4767'}}>
            Это простое решение для расчёта
            предстоящих расходов вашего бизнеса
         </p>
         <NavLink to="/auth" className="btn" style={{background: '#2390b6', color: 'white', alignSelf: 'flex-start'}}>Авторизация</NavLink>
      </div>
   )
}

export default GeneralPage