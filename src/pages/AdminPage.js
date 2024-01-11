import './styles/admin.css';
import enbaleUserIcon from '../images/enable-user.png'
import disableUserIcon from '../images/disable-user.png'
import deleteIcon from '../images/delete-user.png'
import Header from './components/fragments/Header';
import { useState, useEffect, Fragment } from 'react';
import TextfieldFragment from './components/fragments/TextfieldFragment';
import { logOutAccount } from '../util/Account';
import axios from 'axios';
import { personalInformation as personalInfo, currentEmploymentInformation as employmentInfo } from '../util/DataTemplate';
import server from '../server';
import Dialog from './components/fragments/Dialog';

const AdminPage = () => {

    const [greeting, setGreeting] = useState();
    const [fetchListStatus, setFetchListStatus] = useState(false);
    const [hrList, setHRList] = useState([]);
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [addingMessage, setAddingMessage] = useState('');
    const [systemMessage, setSystemMessage] = useState('');
    const [systemError, setSystemError] = useState('');
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        surname: '',
        extension: '',
        email: '',
        department: '',
    });

    const dummy = {
        firstname: '',
        middlename: '',
        surname: '',
        extension: '',
        email: '',
        department: '',
    };


    useEffect(()=> {
        const updateGreeting = async () => {
            const currentDate = new Date();
            const currentHour = currentDate.getHours();
            
            if (currentHour < 12) {
                setGreeting('Good Morning')
            } else if (currentHour < 18) {
                setGreeting('Good Afternoon');
            } else {
                setGreeting('Good Evening');
            }
       
        }
 
        updateGreeting();
        
     },[]);



     const handleInputChange = (event) => {
        setAddingMessage('');
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };


      const createAccount = async () => {
        setAddingMessage('Adding...');
        const {firstname, middlename, surname, email, department} = formData;
        if(firstname.replace(/\s/g, '') === '' || middlename.replace(/\s/g, '') === '' || surname.replace(/\s/g, '') === '' || email.replace(/\s/g, '') === '' || department.replace(/\s/g, '') === ''){
            setAddingMessage('Please fill all required data.');
        }else{
            const personalInformation = {...personalInfo};
            const currentEmploymentInformation = {...employmentInfo};
            const randNum = Math.floor(Math.random() * 900) + 100;
            const password = formData.surname.toLocaleLowerCase().replace(/\s/g, '')+formData.firstname.toLocaleLowerCase().replace(/\s/g, '')+randNum;
            personalInformation.firstname = firstname;
            personalInformation.middlename = middlename;
            personalInformation.surname = surname;
            currentEmploymentInformation.department = department.toLocaleLowerCase().replace(/\s/g, '');
            currentEmploymentInformation.role = 'HR';


            
            try {

                const data = {
                    email: email,
                    password: password,
                    personalInformation: personalInformation,
                    currentEmploymentInformation: currentEmploymentInformation
                }

                const response = await axios.post(`http://${server.host}:${server.port}/createAccount`, data);
                console.log(response);
                if(response.data.isSuccess){
                    setAddingMessage(response.data.message);
                    setFormData(dummy);
                   
                }else{
                    setAddingMessage(response.data.message);
                }
                
            } catch (error) {
                console.error(error)    
                
            }
        }
      };


    async function enableUser(uid){
        const response = await axios.post(`http://${server.host}:${server.port}/enableUser`, {uid: uid});
        setSystemMessage(response.data.message);
    }

    async function disableUser(uid){
        const response = await axios.post(`http://${server.host}:${server.port}/disableUser`, {uid: uid});
        setSystemMessage(response.data.message);

    }



    useEffect(()=>{
        async function fetchData(){
            setHRList([]);
            setFetchListStatus(false);
            const response = await axios.get(`http://${server.host}:${server.port}/getAllHR`);


            if(response.data.isSuccess){
                setHRList(response.data.data);
            }else{
                setSystemError(systemError+"\n"+ response.data.message);
            }

            setFetchListStatus(true);
            console.log(response.data.data[0]);
        }

        fetchData();
    },[addingMessage, systemMessage]);




          //Logout Account
    const handleLogout = () => {
        logOutAccount();
        sessionStorage.removeItem('epsUser')
        window.location.reload();
    }


    return ( 
        
        <div className="admin_page_div">
            <Header title={greeting+" Admin!"}/>

            <div className='admin_content'>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                    <button style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}} onClick={handleLogout}>Logout</button>
                    <button onClick={() => {setDisplayAddForm(true)}}>Add New HR</button>
                </div>
                <p style={{fontSize: 'larger',fontWeight: '600' ,margin: '20px 0 0 0'}}>Human Resource List</p>

                

                <table>
                    { (fetchListStatus && hrList.length > 0) &&

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    }
                    <tbody>
                        { !fetchListStatus && 
                            <tr><td>Loading...</td></tr>

                        }

                        {(fetchListStatus && hrList.length === 0 ) && 
                             <tr><td>No Employees Yet.</td></tr>
                        }
                        { (fetchListStatus && hrList.length > 0 ) && 

                            hrList.map((hr)=>(

                                <Fragment key={hr.id}>
                                    <tr>
                                        <td>{`${hr.data.personalInformation.firstname} ${hr.data.personalInformation.middlename} ${hr.data.personalInformation.surname} `}</td>
                                        <td>
                                            <div className='full_width center_vertical'>
                                                    
                                                    <p style={{ width: 'fit-content', padding: '3px 8px', backgroundColor: !hr.accountInfo.disabled ? '#2F9B0B' : '#A10808', fontWeight: '700', borderRadius: '5px', color: '#fff'}}>{!hr.accountInfo.disabled ? 'Active' : 'Disabled'}</p>

                                                </div>
                                            </td>
                                        <td>
                                            <div className='full_width center_vertical'>
                                                {!hr.accountInfo.disabled ? (
                                                    <div style={{width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                                                        <img id='disable_icon' onClick={() => {disableUser(hr.id)}} src={disableUserIcon} alt="" className='action_icon' />
                                                        <p id='disable_label' className='action_label disable_label'>Disable User</p>
                                                    </div>
                                                ):(
                                                    <div style={{width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                                                        <img id='disable_icon' onClick={() => {enableUser(hr.id)}} src={enbaleUserIcon} alt="" className='action_icon' />
                                                        <p id='disable_label' className='action_label disable_label'>Enable User</p>
                                                    </div>
                                                )

                                                }
                                                
            
                                                <div style={{width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'}}>
                                                    <img id='delete_icon' src={deleteIcon} alt="" className="action_icon" />
                                                    <p id='delete_label' className='action_label'>Delete User</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr> 
                                </Fragment>
                            ))
                        }
                        
                        
                    </tbody>
                </table>

            </div>

            {displayAddForm && 
            
                <div className='dialog_div'>
                    <div className="dialog_prompt">
                        <p style={{fontSize: 'x-large', fontWeight: '800'}}>Add New Human Resource</p>
                    
                        <table>
                        <tbody>
                            <tr>
                                <td>
                                    <TextfieldFragment type='text' name='Firstname' value={formData.firstname} onChange={handleInputChange} required={true}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment type='text' name='Middlename' value={formData.middlename} onChange={handleInputChange} required={true}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment type='text' name='Surname' value={formData.surname} onChange={handleInputChange} required={true}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment type='text' name='Extension' value={formData.extension} onChange={handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment type='text' name='Email' value={formData.email} onChange={handleInputChange} required={true}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment type='text' name='Department' value={formData.department} onChange={handleInputChange} required={true}/>
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                    <div style={{width: '100%', textAlign: 'left', margin: '5px 0 0 0'}}>
                        <p style={{fontFamily: 'Poppins',fontSize: '15px', margin: '0 0 10px 0'}}><span style={{fontSize: 'large', color: 'red'}}>*</span>Required</p>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                        <button style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}} onClick={()=> { setAddingMessage(''); setFormData(dummy); setDisplayAddForm(false); }}>Close</button>
                        <button onClick={createAccount}>Add</button>
                    </div>
                    <p style={{height: '15px', fontSize: 'medium', fontWeight: '500'}}>{addingMessage}</p>
                    </div>
                    
                </div>
            }
            { systemMessage && (

                <Dialog
                    title="Message"
                    message={systemMessage}
                    type="message"
                    positiveButton={{action: () =>{setSystemMessage('');}, label: 'Okay'}}
                />
            )}

{ systemError && (

<Dialog
    title="Error"
    message={systemError}
    type="error"
    positiveButton={{action: () =>{setSystemError('');}, label: 'Okay'}}
/>
)}

        </div>
        
     );
}
 
export default AdminPage;