import React, {useContext, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import {useHistory, useParams} from 'react-router-dom'

const DeleteEstimate = () => {
   const estimateId = useParams().id
   const history = useHistory()
   const auth = useContext(AuthContext)
   const {loading, request} = useHttp()
   const [message, setMessage] = useState('')



   const submitHandler = async () => {
      try {
         await request('https://vast-lowlands-22096.herokuapp.com/api/estimate/delete', 'POST', {id: estimateId}, {
            authorization: `Bearer ${auth.token}`
         })

         await request('https://vast-lowlands-22096.herokuapp.com/api/lines/delete-all-of-estimate', 'POST', {id: estimateId}, {
            authorization: `Bearer ${auth.token}`
         })
         setMessage('Смета успешно удалена')
         setTimeout(() => {
            setMessage('')
            history.goBack()
         }, 500)
      }catch (e) {

      }
   }
   return (
      <div className="modal fade" id="deleteEstimate" tabIndex="-1" aria-labelledby="deleteEstimateLabel"
           aria-hidden="true">
         <div className="modal-dialog">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Удаление сметы</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
               </div>
               <div className="modal-body">
                  <div className={'fs-4'}>Вы уверены что хотите удалить смету?</div>
                  {message && <div style={{color: 'green'}}>{message}</div>}
               </div>
               <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={loading}>Выйти</button>
                  <button type="button" className="btn btn-danger" onClick={() => submitHandler()} disabled={loading} data-bs-dismiss="modal">Удалить</button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default DeleteEstimate