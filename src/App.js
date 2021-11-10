import React from "react";
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";
import NavBar from "./components/NavBar";
import Loader from "./components/Loader";
function App() {
   const {token, login, logout, userId, ready} = useAuth()
   const isAuthenticated = !!token
   const routes = useRoutes(isAuthenticated)

   if (!ready) {
      return <Loader/>
   }
  return (
     <AuthContext.Provider value={{
     token, login, logout, userId, isAuthenticated
     }}>
        <Router>
           <div className="container" style={{height: '100vh'}}>
              <NavBar/>
              {routes}
           </div>
        </Router>
     </AuthContext.Provider>
  )
}

export default App
