import React, { Fragment, useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./styles/sidebarnavigation.css";
import { getUserByID } from "../../../util/Database";
import { getCurrentUser, logOutAccount } from "../../../util/Account";
import userLogo from '../../../images/user.png'


const SideBarNavigation = forwardRef((props, ref) => {
    const [systemError, setSystemError] = useState('');
    const navigate = useNavigate();
    const [personalInformation, setPersonalInformation] = useState();
    const [employmentInformation, setEmploymentInformation] = useState();
    const [greeting, setGreeting] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const componentRef = useRef();

    useImperativeHandle(ref, () => {return componentRef.current});

    function pushError(newError){
        setSystemError(systemError+"\n - "+newError);
    }



    //Get the current user info and current time
    useEffect(()=> {

       function fetchData(){
        const currentDate = new Date();
        const currentHour = currentDate.getHours();

       if (currentHour < 12) {
        setGreeting('Good morning')
      } else if (currentHour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
      

       }

    fetchData();
       
    },[]);


    useEffect(()=>{
        async function fetchData(){
            const user = await getCurrentUser();

            if(user.isSuccess){
                setCurrentUser(user.data);

                const query = await getUserByID(user.data.uid);
                if(query.isSuccess){
                    setPersonalInformation(query.data.personalInformation)
                    setEmploymentInformation(query.data.employmentInformation);
                }else{
                    pushError(query.message);
                }
            }else{
                pushError(user.message);
            }

        }

        fetchData()


    },[]);

    
    let [priorityTab, normalTab] = [props.tabs.filter((tab)=>{
        return tab.priority === 1;
    }),props.tabs.filter((tab)=>{
        return tab.priority === 0;
    })];

   

    return ( 

        <div className="sidebar_navigation" ref={componentRef}>
    
            <div className="profile_div">
                {systemError ? (
                    <p>{systemError}</p>
                ): (
                    (!personalInformation) && <p>Loading...</p>

                )}
            
                {personalInformation && <>
                    <div className="profile" onClick={()=>{navigate('/profile', { state: { currentUser: currentUser.uid } });}}>
                        <div className="image" onClick={()=>{navigate('/profile', { state: { currentUser: currentUser.uid } });}}>
                            <img src={userLogo} alt="" style={{height: 'inherit', width: 'inherit'}}/>
                        </div>
                        <div className="greetings"> {greeting} {personalInformation.firstname}!</div>
                    </div>
                    <Link className="fullname" to={{ pathname: '/profile'}} state={{currentUser: currentUser.uid }} >{personalInformation.firstname} {personalInformation.middlename} {personalInformation.surname} | {employmentInformation.role}</Link>
                </>
                }
            </div>
            <ul className="tab_list">
                {
                    priorityTab.length > 0 && priorityTab.map((tab)=>(<div onClick={() => {props.actionPerTabClick(tab.id)}} className="tab_link" key={tab.id}><li className={props.selected === tab.id ? " tab selected" : "tab"} id={tab.id}>{tab.name}</li></div>))
                }
    
                {
                    priorityTab.length > 0 && <div className="breakline" style={{width: '96%', margin: '20px 0 20px 2%'}}></div>
                }
    
                {
                    normalTab.map((tab) => (
                        <div onClick={() => {props.actionPerTabClick(tab.id)}} className="tab_link" key={tab.id}><li className={props.selected === tab.id ? " tab selected" : "tab"} id={tab.id}>{tab.name}</li></div>
                    ))
                }
            </ul>
                {(props.customBottomButton !== undefined) && (

                    <button onClick={props.customBottomButton.action}>{props.customBottomButton.label}</button>  
                )
                }
    
        </div>
         );
});


export default SideBarNavigation;
