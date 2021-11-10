import React, {useContext, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {AuthContext} from "../context/auth.context";
import {useHttp} from "../hooks/http.hook";
import {ReactComponent as ReactSave} from '../files/save.svg'


const CreateLine = ({subs, list}) => {
   const history = useHistory()
   const estimateId = useParams().id
   const auth = useContext(AuthContext)
   const [listMessage, setListMessage] = useState('')
   const {loading, request} = useHttp()
   const [message, setMessage] = useState('')
   const [form, setForm] = useState({
      job: '',
      unit: '',
      count: '',
      price: '',
      totalPrice: '',
      section: ''
   })



   const inputHandler = event => {
      setForm(prev => ({...prev, [event.target.name]: event.target.value}))
      setForm(prev => ({...prev, totalPrice: prev.count * prev.price}))
   }

   const submitHandler = async () => {
      try {
         await request('https://vast-lowlands-22096.herokuapp.com/api/lines/create', 'POST', {...form, id: estimateId}, {
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

         setMessage('Поле успешно создано')
         setTimeout(() => {
            setMessage('')
            history.go(0)
         }, 1000)
      }catch (e) {

      }
      setForm({
         job: '',
         unit: '',
         count: '',
         price: '',
         totalPrice: '',
         section: ''
      })
   }

   const saveListHandler = async () => {
      try {
         await request('https://vast-lowlands-22096.herokuapp.com/api/type-work-line/create', 'POST', {title: form.job}, {
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
      <div className="modal fade" id="createLineModal" tabIndex="-1" aria-labelledby="createLineModalLabel"
           aria-hidden="true">
         <div className="modal-dialog">
            <div className="modal-content">
               <div className="modal-header">
                  <h5 className="modal-title" id="createLineModalLabel">Создание поля</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
               </div>
               <div className="modal-body">
                  <div className="mb-1">
                     <label htmlFor="section" className="form-label">Добавить в подраздел</label>
                     <input autoComplete={'off'} className="form-control" list="subsListCreate" id="section" name="section" value={form.section} onChange={e => inputHandler(e)}/>
                     <datalist id="subsListCreate">
                        {subs.map((el, i) => {
                           return (<option key={i} value={el}/>)
                        })}
                     </datalist>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="job" className="form-label" style={{display: 'block'}}>Тип работы {listMessage && <span style={{color: 'green'}}>{listMessage}</span>}</label>
                     <div className={'input-group'}>
                        <input autoComplete={'off'} className="form-control" aria-describedby="button-addon2" list="typeWorkListCreate" name="job" value={form.job} onChange={e => inputHandler(e)}/>
                        <button className="btn btn-outline-success" id="button-addon2" onClick={() => saveListHandler()}><ReactSave/></button>
                        <datalist id="typeWorkListCreate">
                           {list.map((el, i) => {
                              return <option key={i} value={el.title}/>
                           })}
                        </datalist>
                     </div>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="unit" className="form-label">Единица измерения</label>
                     <input autoCapitalize={'off'} type="text" className="form-control" id="unit" name="unit" value={form.unit} onChange={e => inputHandler(e)}/>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="count" className="form-label">Количество</label>
                     <input type="number" className="form-control" id="count" name="count" value={form.count} onChange={e => inputHandler(e)}/>
                  </div>
                  <div className="mb-1">
                     <label htmlFor="price" className="form-label">Стоимость</label>
                     <input type="number" className="form-control" id="price" name="price" value={form.price} onChange={e => inputHandler(e)}/>
                  </div>
                  {message && <div style={{color: 'green'}}>{message}</div>}
               </div>
               <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" disabled={loading}>Выйти</button>
                  <button type="button" className="btn btn-primary" onClick={() => submitHandler()} disabled={loading}>Создать</button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default CreateLine


