import React, { Fragment, useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./styles/sidebarnavigation.css";
import { getUserByID } from "../../../util/Database";
import { getCurrentUser, logOutAccount } from "../../../util/Account";
import userLogo from '../../../images/user.png'


const SideBarNavigation = forwardRef((props, ref) => {
    const [systemError, setSystemError] = useState();
    const navigate = useNavigate();
    const [personalInformation, setPersonalInformation] = useState();
    const [employmentInformation, setEmploymentInformation] = useState();
    const [greeting, setGreeting] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const componentRef = useRef();
    const [hoveredTab, setHoveredTab] = useState('');
    const [styles, setStyles] = useState(
        {
            sidebarNavigation: { height: '100vh', width: '280px', backgroundColor: 'var(--global-primary-color)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'nowrap', zIndex: 1 },
            profileDiv: { width: '95%', height: '120px', fontFamily: 'Poppins', backgroundColor: 'var(--global-secondary-color)', margin: '2.5% 0 0 0', borderStyle: 'var(--global-secondary-color) solid', borderRadius: '10px 10px 3px 3px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' },
            profile: { margin: '10px 0 0 0', height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-around' },
            image: { height: '60px', width: '60px', borderStyle: 'solid', borderWidth: 'thin', borderColor: '#333333', borderRadius: '100px', backgroundColor: '#ffffff', overflow: 'hidden', display: 'contents' },
            fullname: { margin: '0 0 10px 0', textDecoration: 'none', fontWeight: 600, color: '#0c1a43' },
            tabList: { width: '100%', height: '-webkit-fill-available', margin: '60px 0 0 0' },
            tabLink: { textDecoration: 'none' },
            tab: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '90%', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 5%', padding: '0 0 0 5%', color: '#ffffff', zIndex: 2 },
            tabHover: { margin: '0 0 0 0', width: '-webkit-fill-available', padding: '0 0 0 10%', backgroundColor: 'rgb(174, 183, 188)', color: 'black' },
            tabSelected: { backgroundColor: 'var(--global-secondary-color)', color: 'black', borderStyle: 'var(--global-secondary-color) solid', borderRadius: '25px 0 0 25px' },
            tabSelectedHover: { width: '90%', margin: '0 0 0 5%', padding: '0 0 0 5%', backgroundColor: 'var(--global-secondary-color)' },
          }
    );

    useImperativeHandle(ref, () => {return componentRef.current});

    function pushError(newError){
        setSystemError(systemError+"\n - "+newError);
    }

    //Logout Account
    const handleLogout = () => {
        logOutAccount();
        sessionStorage.removeItem('epsUser')
        window.location.reload();
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




    useEffect(()=>{
        if(props.deviceType === 'DESKTOP'){
            setStyles(
                {
                    sidebarNavigation: { height: '100%', width: '280px', backgroundColor: 'var(--global-primary-color)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'nowrap', zIndex: 1 },
                    profileDiv: { width: '95%', height: '120px', fontFamily: 'Poppins', backgroundColor: 'var(--global-secondary-color)', margin: '2.5% 0 0 0', borderStyle: 'var(--global-secondary-color) solid', borderRadius: '10px 10px 3px 3px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' },
                    profile: { margin: '10px 0 0 0', height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-around' },
                    image: { height: '60px', width: '60px', borderStyle: 'solid', borderWidth: 'thin', borderColor: '#333333', borderRadius: '100px', backgroundColor: '#ffffff', overflow: 'hidden', display: 'contents' },
                    fullname: { margin: '0 0 10px 0', textDecoration: 'none', fontWeight: 600, color: '#0c1a43' },
                    tabList: { width: '100%', height: '-webkit-fill-available', margin: '60px 0 0 0' },
                    tabLink: { textDecoration: 'none' },
                    tab: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '90%', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 5%', padding: '0 0 0 5%', color: '#ffffff', zIndex: 2 },
                    tabHover: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '-webkit-fill-available', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 0', padding: '0 0 0 10%', backgroundColor: 'rgb(174, 183, 188)', color: 'black', zIndex: 2 },
                    tabSelected: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '90%', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 5%', padding: '0 0 0 5%', color: 'black', backgroundColor: 'var(--global-secondary-color)', borderStyle: 'var(--global-secondary-color) solid',  borderRadius: '25px 0 0 25px', zIndex: 2 },
                  }
            );
        }else if(props.deviceType === 'TABLET'){
            setStyles(
                {
                    sidebarNavigation: { height: '100%', width: '100px', backgroundColor: 'var(--global-primary-color)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'nowrap', zIndex: 1 },
                    profileDiv: { width: '95%', height: '120px', fontFamily: 'Poppins', backgroundColor: 'var(--global-secondary-color)', margin: '2.5% 0 0 0', borderStyle: 'var(--global-secondary-color) solid', borderRadius: '10px 10px 3px 3px', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' },
                    profile: { margin: '10px 0 0 0', height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-around' },
                    image: { height: '60px', width: '60px', borderStyle: 'solid', borderWidth: 'thin', borderColor: '#333333', borderRadius: '100px', backgroundColor: '#ffffff', overflow: 'hidden', display: 'contents' },
                    fullname: { margin: '0 0 10px 0', textDecoration: 'none', fontWeight: 600, color: '#0c1a43' },
                    tabList: { width: '100%', height: '-webkit-fill-available', margin: '60px 0 0 0' },
                    tabLink: { textDecoration: 'none' },
                    tab: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '90%', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 5%', padding: '0 0 0 5%', color: '#ffffff', zIndex: 2 },
                    tabHover: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '-webkit-fill-available', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 0', padding: '0 0 0 10%', backgroundColor: 'rgb(174, 183, 188)', color: 'black', zIndex: 2 },
                    tabSelected: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '90%', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 5%', padding: '0 0 0 5%', color: 'black', backgroundColor: 'var(--global-secondary-color)', borderStyle: 'var(--global-secondary-color) solid',  borderRadius: '25px 0 0 25px', zIndex: 2 },
                  }
            );
        }else if(props.deviceType === 'MOBILE'){
            setStyles(
                {
                    sidebarNavigation: { height: '100%', width: '0', backgroundColor: 'var(--global-primary-color)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'nowrap', zIndex: 1 },
                    profileDiv: { width: '95%', height: '120px', fontFamily: 'Poppins', backgroundColor: 'var(--global-secondary-color)', margin: '2.5% 0 0 0', borderStyle: 'var(--global-secondary-color) solid', borderRadius: '10px 10px 3px 3px', display: 'none', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between' },
                    profile: { margin: '10px 0 0 0', height: 'auto', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-around' },
                    image: { height: '60px', width: '60px', borderStyle: 'solid', borderWidth: 'thin', borderColor: '#333333', borderRadius: '100px', backgroundColor: '#ffffff', overflow: 'hidden', display: 'contents' },
                    fullname: { margin: '0 0 10px 0', textDecoration: 'none', fontWeight: 600, color: '#0c1a43' },
                    tabList: { width: '100%', height: '-webkit-fill-available', margin: '60px 0 0 0' },
                    tabLink: { textDecoration: 'none' },
                    tab: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '90%', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 5%', padding: '0 0 0 5%', color: '#ffffff', zIndex: 2 },
                    tabHover: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '-webkit-fill-available', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 0', padding: '0 0 0 10%', backgroundColor: 'rgb(174, 183, 188)', color: 'black', zIndex: 2 },
                    tabSelected: { fontFamily: 'Nunito', fontSize: 'large', fontWeight: 800, width: '90%', listStyle: 'none', height: '50px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', margin: '0 0 0 5%', padding: '0 0 0 5%', color: 'black', backgroundColor: 'var(--global-secondary-color)', borderStyle: 'var(--global-secondary-color) solid',  borderRadius: '25px 0 0 25px', zIndex: 2 },
                  }
            );

        }

    }, [props.deviceType]);


   

    return ( 

    <Fragment >
        <div style={styles.sidebarNavigation} ref={componentRef}>

            <div style={styles.profileDiv}>
                {systemError ? (
                    <p>{systemError}</p>
                ):

                    (!personalInformation && <p>Loading...</p>)
                }

                {personalInformation && <>
                    <div style={styles.profile}>
                        <div style={styles.image} onClick={(e)=>{navigate('/profile', { state: { currentUser: currentUser.uid } });}}>
                            <img src={userLogo} alt="" style={{height: 'inherit', width: 'inherit'}}/>
                        </div>
                        <div> {greeting} {personalInformation.firstname}!</div>
                    </div>
                    <Link style={styles.fullname} to={{ pathname: '/profile'}} state={{currentUser: currentUser.uid }} >{personalInformation.firstname} {personalInformation.middlename} {personalInformation.surname} | {employmentInformation.role}</Link>
                </>
                }
            </div>
            <ul style={styles.tabList}>
                {
                    priorityTab.length > 0 && priorityTab.map((tab)=>(<Link to={"/"+tab.id} style={styles.tabLink} key={tab.key} onMouseEnter={()=> {setHoveredTab(tab.id)}} onMouseLeave={()=>{setHoveredTab('')}}><li style={(props.selected === tab.id) ? styles.tabSelected :((hoveredTab === tab.id)? styles.tabHover : styles.tab)} id={tab.id}>{tab.name}</li></Link>))
                }

                {
                    priorityTab.length > 0 && <div className="breakline" style={{width: '96%', margin: '20px 0 20px 2%'}}></div>
                }

                {
                    normalTab.map((tab) => (
                        <Link to={"/"+tab.id} style={styles.tabLink} key={tab.key} onMouseEnter={()=> {setHoveredTab(tab.id)}} onMouseLeave={()=>{setHoveredTab('')}}><li style={(props.selected === tab.id) ? styles.tabSelected :((hoveredTab === tab.id)? styles.tabHover : styles.tab)} id={tab.id}>{tab.name}</li></Link>
                    ))
                }
            </ul>

                <button onClick={handleLogout}>Logout</button>  
        </div>
    </Fragment>
     );
});


export default SideBarNavigation;
