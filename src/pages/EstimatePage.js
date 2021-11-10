import React, {useCallback, useContext, useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import Loader from "../components/Loader";
import EstimateCard from "../components/EstimateCard";

const EstimatePage = () => {
   const {token} = useContext(AuthContext)
   const {request, loading} = useHttp()
   const [estimate, setEstimate] = useState(null)
   const estimateId = useParams().id
   const getEstimate = useCallback(async () => {
      try {
         const fetched = await request(`https://vast-lowlands-22096.herokuapp.com/api/estimate/${estimateId}`, 'GET', null, {
            Authorization: `Bearer ${token}`
         })
         setEstimate(fetched)
      }catch (e) {

      }
   }, [token, estimateId, request])

   useEffect(() => {
      getEstimate()
   }, [getEstimate])

   if (loading) {
      return <Loader/>
   }

   return (
      <div>
         {!loading && estimate && <EstimateCard estimate={estimate}/>}
      </div>
   )
}

export default EstimatePage