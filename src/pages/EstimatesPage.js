import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHistory} from 'react-router-dom'
import CreateEstimate from "../components/CreateEstimate";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import Loader from "../components/Loader";
import './EstimatePage.css'
import {ReactComponent as ReactPlus} from "../files/plus.svg";
const EstimatesPage = () => {
   const history = useHistory()
   const [estimates, setEstimates] = useState([])
   const [isOpenModal, setIsOpenEstimate] = useState(false)
   const {loading, request} = useHttp()
   const {token} = useContext(AuthContext)

   const fetchEstimates = useCallback(async () => {
      try {
         const fetched = await request('https://vast-lowlands-22096.herokuapp.com/api/estimate', 'GET', null, {
            Authorization: `Bearer ${token}`
         })
         setEstimates(fetched)
      }catch (e) {}
   }, [token, request])

   const linkHandler = id => {
      history.push(`/estimate/${id}`)
   }

   useEffect(() => {
      fetchEstimates()
   }, [fetchEstimates])

   if (loading) {
      return <Loader/>
   }


   return (
      <div>
         <CreateEstimate isOpen={isOpenModal} setIsOpen={setIsOpenEstimate}/>
         <div className="row mt-2">
            <div className="col">
               <div className={'fs-2'}>Мои сметы</div>
            </div>
            <div className="col d-flex justify-content-end">
               <button
                  type="button"
                  className="btn btn-outline-success btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#createEstimateModal"
                  onClick={() => setIsOpenEstimate(true)}
               >
                  <ReactPlus/>
               </button>
            </div>
         </div>
         <hr/>
         {!estimates.length ? <p className={'fs-3'}>У ван нет ни одной сметы</p> :
            <div className="table-responsive">
               <table className="table table-bordered border-dark align-middle">
                  <thead className={'table-dark'}>
                  <tr>
                     <th scope="col">№</th>
                     <th scope="col">Объект</th>
                     <th scope="col">Заказчик</th>
                     <th scope="col">Итого ₽</th>
                  </tr>
                  </thead>
                  <tbody>
                  {estimates.map((el, i) => {
                     return (
                           <tr key={el._id} onClick={() => linkHandler(el._id)} className={'tr'}>
                              <th scope="row">{i + 1}</th>
                              <td >{el.object ? el.object : '-'}</td>
                              <td>{el.customer ? el.customer : '-'}</td>
                              <td>{el.totalPrice.toFixed(2)}</td>
                           </tr>
                     )
                  })}
                  </tbody>
               </table>
            </div>
         }
      </div>
   )
}

export default EstimatesPage