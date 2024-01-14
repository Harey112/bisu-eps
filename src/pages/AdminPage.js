import './styles/admin.css';
import enbaleUserIcon from '../images/enable-user.png'
import disableUserIcon from '../images/disable-user.png'
import deleteIcon from '../images/delete-user.png'
import Header from './components/fragments/Header';
import { useState, useEffect, Fragment } from 'react';
import TextfieldFragment from './components/fragments/TextfieldFragment';
import axios from 'axios';
import { personalInformation as personalInfo, currentEmploymentInformation as employmentInfo } from '../util/DataTemplate';
import server from '../server';
import Dialog from './components/fragments/Dialog';
import SelectFragment from './components/fragments/SelectFragment';

const AdminPage = () => {

    const [greeting, setGreeting] = useState();
    const [fetchListStatus, setFetchListStatus] = useState(false);
    const [hrList, setHRList] = useState([]);
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [departmentList, setDepartmentList] = useState([]);
    const [addNewDepartment, setAddNewDepartment] = useState(false);
    const [newDepartment, setNewDepartment] = useState({
        name: '',
        description: ''
    })
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


    const dummy2 = {
        name: '',
        description: ''
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
        
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };


      const newDepartmentChange = (event) => {
        
        const { name, value } = event.target;
        setNewDepartment((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));

      };


      function appendError(newError){
        setSystemError(systemError+"\n- "+newError);
    }



      const createAccount = async () => {
        setSystemOPeration('Adding New HR...');
        const {firstname, middlename, surname, email, department} = formData;
        if(firstname.replace(/\s/g, '') === '' || middlename.replace(/\s/g, '') === '' || surname.replace(/\s/g, '') === '' || email.replace(/\s/g, '') === '' || department.replace(/\s/g, '') === ''){
            setSystemOPeration(null);
            setSystemMessage('Please fill all required data.');
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

                const query = await axios.post(`http://${server.host}:${server.port}/createAccount`, data);
                setSystemOPeration(null);
                if(query.data.isSuccess){
                    setSystemMessage(query.data.message);
                    setFormData(dummy);
                   
                }else{
                    appendError(query.data.message);
                }
                
            } catch (error) {
                console.error(error)    
                appendError(error.message);
                
            }
            setRefreshTrigger(Math.floor(Math.random() * 900) + 100);
        }
      };


    async function enableUser(uid){
        setSystemOPeration("Enabling User...");
        const query = await axios.post(`http://${server.host}:${server.port}/enableUser`, {uid: uid});
        setSystemOPeration(null);
        if(query.data.isSuccess){
            setSystemMessage(query.data.message);
            setRefreshTrigger(Math.floor(Math.random() * 900) + 100);
        }else{
            appendError(query.data.message);
        }
    }

    async function disableUser(uid){
        setSystemOPeration("Disabling User...");
        const query = await axios.post(`http://${server.host}:${server.port}/disableUser`, {uid: uid});
        setSystemOPeration(null);
        if(query.data.isSuccess){
            setSystemMessage(query.data.message);
            setRefreshTrigger(Math.floor(Math.random() * 900) + 100);
        }else{
            appendError(query.data.message);
        }
    }

    async function deleteUser(uid){
        setSystemOPeration("Deleting User...");
        const query = await axios.post(`http://${server.host}:${server.port}/deleteUser`, {uid: uid});
        setSystemOPeration(null);
        if(query.data.isSuccess){
            setSystemMessage(query.data.message);
            setRefreshTrigger(Math.floor(Math.random() * 900) + 100);
        }else{
            appendError(query.data.message);
        }
    }

    
    async function addDepartment(department){

        setSystemOPeration("Adding New Department...");
        if(newDepartment.name === ''){
            setSystemMessage('Please fill the required');
            setSystemOPeration(null);
        }else{

            const query = await axios.post(`http://${server.host}:${server.port}/addDepartment`, department);
    
            setSystemOPeration(null);
            if(query.data.isSuccess){
                setNewDepartment(dummy2);   
                setSystemMessage(query.data.message);
                setRefreshTrigger(Math.floor(Math.random() * 900) + 100);
            }else{
                appendError(query.data.message);
            }
        }


    }



    useEffect(()=>{

        async function fetchData(){
            setHRList([]);
            setFetchListStatus(false);
            const query = await axios.get(`http://${server.host}:${server.port}/getAllHR`);

            setSystemOPeration('');
            if(query.data.isSuccess){
                setHRList(query.data.data);
            }else{
                appendError(query.data.message);
            }

            setFetchListStatus(true);
        }

        fetchData();
    },[refreshTrigger]);



    useEffect(()=>{
        setDepartmentList([]);

        async function fetchData(){
            const query = await axios.get(`http://${server.host}:${server.port}/getAllDepartment`);

            let newList = [];

            query.data.data.forEach((department) =>{
                newList = [...newList, {
                    value: department.departmentID,
                    name: department.name
                }];
            });


            if(query.data.isSuccess){

                setDepartmentList(newList);

                //Set initial department for new HR
                if(formData.department === ''){
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        department: newList[0].value,
                      }));
                }
            }else{
                appendError(query.data.message);
            }
        }

        fetchData();
    },[refreshTrigger]);




          //Logout Account
    const handleLogout = () => {
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
                                                    <img id='delete_icon' src={deleteIcon} alt="" className="action_icon" onClick={()=>{setPromptUser({
                                                        title: 'Confirm?',
                                                        message: `Do you want to delete ${hr.data.personalInformation.firstname} ${hr.data.personalInformation.middlename} ${hr.data.personalInformation.surname}?`,
                                                        negativeButton: {label: 'Cancel', action: ()=> {setPromptUser(null)}},
                                                        positiveButton: {label: 'Yes', action: ()=>{setPromptUser(null); deleteUser(hr.id)}}
                                                    })}}/>
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
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>

                                        {departmentList.length > 0 &&
                                        
                                            <div style={{width: '60%'}}>
                                                <SelectFragment name='Department' value={formData.department} onChange={handleInputChange} options={departmentList} required={true}/>
                                            </div>
                                        }
                                        <div style={{ width: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <button style={{fontSize: 'small', width: 'max-content'}} onClick={()=>{ setAddNewDepartment(true);}}>Add Department</button>
                                        </div> 
                                    </div>

                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                    <div style={{width: '100%', textAlign: 'left', margin: '5px 0 0 0'}}>
                        <p style={{fontFamily: 'Poppins',fontSize: '15px', margin: '0 0 10px 0'}}><span style={{fontSize: 'large', color: 'red'}}>*</span>Required</p>
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                        <button style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}} onClick={()=> { setFormData(dummy); setDisplayAddForm(false); }}>Close</button>
                        <button onClick={createAccount}>Add</button>
                    </div>
                    </div>
                    
                </div>
            }

            {addNewDepartment && 
                <div className='dialog_div'>
                <div className="dialog_prompt">
                    <p style={{fontSize: 'x-large', fontWeight: '800'}}>Add New Department</p>
                
                    <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment type='text' name='Name' value={newDepartment.name} onChange={newDepartmentChange} required={true}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment type='text' name='Description' value={newDepartment.description} onChange={newDepartmentChange} />
                            </td>
                        </tr>
                    
                    </tbody>
                </table>
                <div style={{width: '100%', textAlign: 'left', margin: '5px 0 0 0'}}>
                    <p style={{fontFamily: 'Poppins',fontSize: '15px', margin: '0 0 10px 0'}}><span style={{fontSize: 'large', color: 'red'}}>*</span>Required</p>
                </div>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <button style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}} onClick={()=> { setAddNewDepartment(false)}}>Close</button>
                    <button onClick={()=>{addDepartment(newDepartment);}}>Add</button>
                </div>
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

            { systemOperation && (

            <Dialog
                title="Operation"
                message={systemOperation}
                />
            )}

            { promptUser && (

            <Dialog
                title={promptUser.title}
                message={promptUser.message}
                negativeButton={promptUser.negativeButton}
                positiveButton={promptUser.positiveButton}
                />
            )}
                    
                    </div>
                    
                );
            }
            
export default AdminPage;