import React from "react";
import {Switch, Route, Redirect} from 'react-router-dom'
import EstimatesPage from "./pages/EstimatesPage";
import EstimatePage from "./pages/EstimatePage";
import AuthPage from "./pages/AuthPage";
import GeneralPage from "./pages/GeneralPage";
export const useRoutes = isAuthenticated => {
   if (isAuthenticated) {
      return (
         <Switch>
            <Route path="/estimates" exact>
               <EstimatesPage/>
            </Route>
            <Route path="/estimate/:id">
               <EstimatePage/>
            </Route>
            <Redirect to="/estimates" />
         </Switch>
      )
   }

   return (
      <Switch>
         <Route path="/" exact>
            <GeneralPage/>
         </Route>
         <Route path="/auth">
            <AuthPage/>
         </Route>

         <Redirect to="/"/>
      </Switch>
   )
}