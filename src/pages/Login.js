import React from "react";
import "./styles/login.css";
import bisuLogo from "../images/BISU LOGO.png";
import { useState } from "react";
import { loginAccount } from "../util/Account";
import axios from 'axios';
import server from "../server";



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMassage] = useState('');
  const [loginStatus, setStatus] = useState('');
  const [showPassword, setShowPassword] = useState('');



  const handleSetEmail = (event) =>{
    setEmail(event.target.value);
    setLoginMassage('');
  }
  const handleSetPassword = (event) =>{
    setPassword(event.target.value);
    setLoginMassage('');
  }
  
  const handleShowPassword = () => {
     setShowPassword(!showPassword); 
    };


  
  let login = async(e) =>{

    

    setStatus('Logging in...');
    setLoginMassage('');

    //Check if admin
    try {
      
      const response = await axios.post(`http://${server.host}:${server.port}/login`, {email, password});
      console.log(response);

      if(response.data.isSuccess){

        sessionStorage.setItem('epsUser', JSON.stringify(response.data));
        window.location.href = '/';
     }else{
       const result = await loginAccount(email, password);
 
       if(result.isLoggedIn){
         sessionStorage.setItem('epsUser', JSON.stringify(result.user));
         const user = sessionStorage.getItem('epsUser');
         console.log(JSON.parse(user));
         window.location.href = '/';
   
       }else{
         setLoginMassage(result.message);
       }
       
     }
    } catch (error) {
      console.error(error);
    }


    setStatus('');
  };


  return ( 
    <div className="login_container">

      <div className="login_div">
        <form action=""  className="login_form">
          <h3 id="login_title">Login</h3>
          <label htmlFor="username_tf" style={{margin: '30px 0 3px 10%'}}>Email</label>
          <input type="text" name="username" id="username_tf" className="input_style1" autoComplete="on" value={email} onChange={handleSetEmail} />
          <label htmlFor="password_tf" style={{margin: '30px 0 3px 10%'}}>Password</label>
          <input type={showPassword ? "text" : "password"} name="password" id="password_tf" className="input_style1" autoComplete="on" value={password} onChange={handleSetPassword} />
            <div style={{display: 'flex', gap: '10px', alignItems: 'center', margin: '10px 0 0 28px'}}>
            <input className="checkbox" type="checkbox" name="" id="showpassword"  onChange={handleShowPassword} />
            <label htmlFor="showpassword" style={{margin: '0', fontSize: 'medium'}}>Show Password</label>
            </div>
          <p style={{margin: '10px 0 0 10%', fontFamily: 'Poppins', fontSize: 'small',color: 'red'}}>{loginMessage}</p>
          <div className="btn_div">
            <button id="login_btn" type="button" onClick={login}>Login</button>

            <p style={{margin: '10px 0 0 0', fontFamily: 'Poppins', fontSize: 'small'}}>{loginStatus}</p>
           
          </div>
          
        </form>
      </div>
      <div className="banner_div">
        <div className="bg_div">
          <div className="banner">
            <img src={bisuLogo} id="bisu_logo" alt="" />
            <div className="title_div">
              <h3 id="campus_name">BOHOL ISLAND STATE UNIVERSITY</h3>
              <div className="breakline"></div>
              <h5 id="system_name">Employee Profile System</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default Login;