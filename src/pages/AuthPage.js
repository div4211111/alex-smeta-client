import React, {useContext, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {AuthContext} from "../context/auth.context";

const AuthPage = () => {
   const auth = useContext(AuthContext)
   const {loading, request, error,} = useHttp()
   const [form, setForm] = useState({
      username: '', password: ''
   })
   const [message, setMessage] = useState('')

   const changeHandler = event => {
      setForm(prev => ({...prev, [event.target.name]: event.target.value}))
   }

   const registerHandler = async () => {
      try {
         const data = await request('https://vast-lowlands-22096.herokuapp.com/api/auth/register', 'POST', {...form})
         setMessage(data.message)
         setTimeout(() => {
            setMessage('')
         }, 1000)

      }catch (e) {

      }
      setForm({username: '', password: ''})
   }

   const loginHandler = async () => {
      try {
         const data = await request('https://vast-lowlands-22096.herokuapp.com/api/auth/login', 'POST', {...form})
         auth.login(data.token, data.userId)

      }catch (e) {

      }
      setForm({username: '', password: ''})
   }

   return (
      <div className={'row'}>
         <h1 >Авторизация</h1>
         <div >
            <label htmlFor="username" className="form-label">Логин</label>
            <input type="text"
                   className="form-control"
                   id="username"
                   name={'username'}
                   value={form.username}
                   onChange={e => changeHandler(e)}
            />
         </div>
         <div >
            <label htmlFor="password" className="form-label">Пароль</label>
            <input type="password"
                   className="form-control"
                   id="password"
                   name={'password'}
                   value={form.password}
                   onChange={e => changeHandler(e)}
            />
         </div>
         {error && <div style={{color: 'red'}}>{error}</div>}
         {message && <div style={{color: 'green'}}>{message}</div>}
         <div >
            <div className="pt-3">
               <button style={{background: '#2390b6', color: 'white', width: '100%'}}
                       className="btn"
                       onClick={() => loginHandler()}
                       disabled={loading}
               >Войти</button>
            </div>
            <div className="pt-3">
               <button style={{background: '#2390b6', color: 'white', width: '100%'}}
                       className="btn"
                       onClick={() => registerHandler()}
                       disabled={loading}
               >Регистрация</button>
            </div>
         </div>

      </div>
   )
}

export default AuthPage