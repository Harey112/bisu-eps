import { Link, useNavigate } from "react-router-dom";
import "./styles/sidebarnavigation.css";
import { getUserByID } from "../../../util/Database";
import { Fragment, useEffect, useState } from "react";
import { logOutAccount } from "../../../util/Account";
import userLogo from '../../../images/user.png'


const SideBarNavigation = ({tabs, selected}) => {
    const navigate = useNavigate();
    const [personalInformation, setPersonalInformation] = useState();
    const [employmentInformation, setEmploymentInformation] = useState();
    const [greeting, setGreeting] = useState('');
    const user = JSON.parse(sessionStorage.getItem('epsUser'));
    const userID = (user === null) ? null : user.uid;

    //Logout Account
    const handleLogout = () => {
        logOutAccount();
        sessionStorage.removeItem('epsUser')
        window.location.reload();
    }

    //Get the current user info and current time
    useEffect(()=> {
       const fetchData = async () => {
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
       const response = await getUserByID(userID);
       setPersonalInformation(response.data.personalInformation);
       setEmploymentInformation(response.data.employmentInformation);

       if (currentHour < 12) {
        setGreeting('Good morning')
      } else if (currentHour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
      

       }

    fetchData();
       
    },[userID]);

    
    let [priorityTab, normalTab] = [tabs.filter((tab)=>{
        return tab.priority === 1;
    }),tabs.filter((tab)=>{
        return tab.priority === 0;
    })];




    


   

    return ( 

    <Fragment>
        <div className="sidebar_navigation">

            <div className="profile_div">
                {!personalInformation && <p>Loading...</p>}

                {personalInformation && <>
                    <div className="profile">
                        <div className="image" onClick={(e)=>{navigate('/profile', { state: { currentUser: userID } });}}>
                            <img src={userLogo} alt="" style={{height: 'inherit', width: 'inherit'}}/>
                        </div>
                        <div className="greetings"> {greeting} {personalInformation.firstname}!</div>
                    </div>
                    <Link className="fullname" to={{ pathname: '/profile'}} state={{currentUser: userID }} >{personalInformation.firstname} {personalInformation.middlename} {personalInformation.surname} | {employmentInformation.role}</Link>
                </>
                }
            </div>
            <ul className="tab_list">
                {
                    priorityTab.length > 0 && priorityTab.map((tab)=>(<Link to={"/"+tab.id} className="tab_link" key={tab.key}><li className={selected === tab.id ? " tab selected" : "tab"} id={tab.id}>{tab.name}</li></Link>))
                }

                {
                    priorityTab.length > 0 && <div className="breakline" style={{width: '96%', margin: '20px 0 20px 2%'}}></div>
                }

                {
                    normalTab.map((tab) => (
                        <Link to={"/"+tab.id} className="tab_link" key={tab.key}><li className={selected === tab.id ? " tab selected" : "tab"} id={tab.id}>{tab.name}</li></Link>
                    ))
                }
            </ul>

                <button onClick={handleLogout}>Logout</button>  
        </div>
    </Fragment>
     );
}


export default SideBarNavigation;
