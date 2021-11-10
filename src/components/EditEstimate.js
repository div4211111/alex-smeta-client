import React, {useCallback, useContext, useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";
import {useHistory, useParams} from 'react-router-dom'
import {ReactComponent as ReactSave} from '../files/save.svg'

const EditEstimate = ({estimate, isOpen, setIsOpen}) => {
   const estimateId = useParams().id
   const history = useHistory()
   const auth = useContext(AuthContext)
   const [list, setList] = useState([])
   const [listMessage, setListMessage] = useState('')
   const {loading, request} = useHttp()
   const [message, setMessage] = useState('')
   const [form, setForm] = useState({
      customer: '',
      object: '',
      typeWork: '',
      contractor: 'Алексеев С.В.',
      brigade: '',
      date: '',
      id: estimateId
   })


   const fetchedList = useCallback(async () => {
      try {
         const fetched = await request('https://vast-lowlands-22096.herokuapp.com/api/type-work-estimate', 'GET', null, {
            Authorization: `Bearer ${auth.token}`
         })
         setList(fetched)
      }catch (e) {}
   }, [auth.token, request])

   useEffect(() => {
      if (isOpen){
         fetchedList()
      }

   }, [fetchedList, isOpen])

   const edit = useCallback(() => {
      setForm(prev => ({...prev, ...estimate}))
   }, [estimate])

   useEffect(() => {
      edit()
   }, [edit])

   const inputHandler = event => {
      setForm(prev => ({...prev, [event.target.name]: event.target.value}))
   }

   const submitHandler = async () => {
      const result = {}
      for (let key in form) {
         const name = form[key]
         if (name !== '') result[key] = name
      }
      try {
         await request('https://vast-lowlands-22096.herokuapp.com/api/estimate/edit', 'POST', result, {
            authorization: `Bearer ${auth.token}`
         })
         setMessage('Смета успешно изменена')
         setTimeout(() => {
            setMessage('')
            history.go(0)
         }, 1000)
      }catch (e) {

      }
      setForm({
         customer: '',
         object: '',
         typeWork: '',
         contractor: 'Алексеев С.В.',
         brigade: '',
         date: ''
      })
   }

   const saveListHandler = async () => {
      try {
         await request('https://vast-lowlands-22096.herokuapp.com/api/type-work-estimate/create', 'POST', {title: form.typeWork}, {
            authorization: `Bearer ${auth.token}`
         })
         setListMessage('Успешно добавлено')
         setTimeout(() => {
            setListMessage('')
         }, 1000)

      }catch (e) {

      }
   }


   return (
      <div className="modal fade" id="editEstimate" tabIndex="-1" aria-labelledby="editEstimate"
           aria-hidden="true">
         <div className="modal-dialog">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="editEstimateLabel">Изменение сметы</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsOpen(false)}/>
               </div>
               <div className="modal-body">
                  <div className="mb-1">
                     <label htmlFor="customer" className="form-label">Заказчик</label>
                     <input type="text" className="form-control" id="customer" name="customer" value={form.customer} onChange={e => inputHandler(e)}/>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="object" className="form-label">Объект</label>
                     <input type="text" className="form-control" id="object" name="object" value={form.object} onChange={e => inputHandler(e)}/>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="typeWork" className="form-label" style={{display: 'block'}}>Тип работ {listMessage && <span style={{color: 'green'}}>{listMessage}</span>}</label>
                     <div className={'input-group'}>
                        <input autoComplete={'off'} className="form-control" aria-describedby="button-addon2" list="listTypeEstimateEdit"  name="typeWork" value={form.typeWork} onChange={e => inputHandler(e)}/>
                        <button className="btn btn-outline-success" id="button-addon2" onClick={() => saveListHandler()}><ReactSave/></button>
                        <datalist id="listTypeEstimateEdit">
                           {list.map((el, i) => {
                              return <option key={i} value={el.title}/>
                           })}
                        </datalist>
                     </div>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="contractor" className="form-label">Подрядчик</label>
                     <input type="text" className="form-control" id="contractor" name="contractor" value={form.contractor} onChange={e => inputHandler(e)}/>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="brigade" className="form-label">Бригада</label>
                     <input type="text" className="form-control" id="brigade" name="brigade" value={form.brigade} onChange={e => inputHandler(e)}/>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="date" className="form-label">Дата</label>
                     <input type="date" className="form-control" id="date" name="date" value={form.date} onChange={e => inputHandler(e)}/>
                  </div>
                  {message && <div style={{color: 'green'}}>{message}</div>}
               </div>
               <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)} data-bs-dismiss="modal" disabled={loading}>Выйти</button>
                  <button type="button" className="btn btn-primary" onClick={() => submitHandler()} disabled={loading}>Изменить</button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default EditEstimate