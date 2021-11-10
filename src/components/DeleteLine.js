import React, {useContext, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import {useHistory, useParams} from 'react-router-dom'

const DeleteLine = ({index}) => {
   const estimateId = useParams().id
   const history = useHistory()
   const auth = useContext(AuthContext)
   const {loading, request} = useHttp()
   const [message, setMessage] = useState('')



   const submitHandler = async () => {
      try {
         await request('https://vast-lowlands-22096.herokuapp.com/api/lines/delete', 'POST', {id: index}, {
            authorization: `Bearer ${auth.token}`
         })
         const fetched = await request('https://vast-lowlands-22096.herokuapp.com/api/lines', 'GET', null, {
            Authorization: `Bearer ${auth.token}`,
            id: estimateId
         })
         const sum = fetched.reduce((acc, cv) => acc + cv.totalPrice, 0)
         await request('https://vast-lowlands-22096.herokuapp.com/api/estimate/edit', 'POST', {totalPrice: +sum, id: estimateId}, {
            authorization: `Bearer ${auth.token}`
         })

         setMessage('Поле успешно успешно удалено')
         setTimeout(() => {
            setMessage('')
            history.go(0)
         }, 1000)
      }catch (e) {

      }
   }
   return (
      <div className="modal fade" id="deleteLine" tabIndex="-1" aria-labelledby="deleteLineLabel"
           aria-hidden="true">
         <div className="modal-dialog">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="deleteLineLabel">Удаление поля</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
               </div>
               <div className="modal-body">
                  <div className={'fs-4'}>Вы уверены что хотите удалить данное поле?</div>
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

export default DeleteLine