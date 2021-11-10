import React, {useContext} from "react";
import {NavLink, useHistory} from "react-router-dom";
import logo from '../files/logo_transparent.png'
import {AuthContext} from "../context/auth.context";

const NavBar = () => {
   const history = useHistory()
   const auth = useContext(AuthContext)
   const logautHandler = event => {
      auth.logout()
      history.push('/')
   }
   return (
      <nav className="navbar navbar-expand-lg navbar-light mb-4" style={{background: '#efdeb4'}}>
         <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">
               <img src={logo} alt="" style={{width: 'auto', height: '56px'}}/>
            </NavLink>
            <div id="navbarNav" style={{flexGrow: '0'}}>
               <ul className="navbar-nav">
                  {auth.token ?
                     <button onClick={() => logautHandler()} className="btn btn-lg btn-outline-primary">Выйти</button> :
                     <NavLink to="/auth" className="btn btn-lg btn-outline-primary">Войти</NavLink>
                  }

               </ul>
            </div>
         </div>
      </nav>
   )
}

export default NavBar