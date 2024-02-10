import "./styles/department.css";
import addIcon from "../../images/add_icon.png"
import { Link, useNavigate } from "react-router-dom";
import Dialog from "./fragments/Dialog";
import { Fragment, useEffect, useState } from "react";
import { addDepartment, getAllDepartments, searchEmployee } from "../../util/Database";
import unitLogo from '../../images/unit.png'
import TextfieldFragment from "./fragments/TextfieldFragment";

const Department = () => {
    const navigate = useNavigate();
    const [departmentList, setDepartmentList] = useState([]);
    const [fetchDepartmentListStatus, setFetchDepartmentListStatus] = useState(false);
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);

    const dummy = {
        name : '',
        description: ''
    }
    const [newDepartment, setNewDepartment] = useState({...dummy});


    function handleNewDataChange(event){
        const { name, value } = event.target;
        setNewDepartment((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };


    //Display Errors
    function appendError(newError){
        setSystemError(systemError+"\n- "+newError);
    }

    useEffect(() => {
        const fetchData = async () => {
          try {
            let response = await getAllDepartments();
    
            if (response.isRetrieved) {
              const promises = response.data.map(async (department) => {
                const employee = await searchEmployee({
                  keyword: '',
                  role: 'All',
                  department: department.data().departmentID,
                });
    
                return { data: department.data(), no_employee: employee.list.length};
              });
    
              const departmentDataList = await Promise.all(promises);
              
              setDepartmentList([...departmentDataList]);
              setFetchDepartmentListStatus(true);
             /*  console.log(departmentList); */
             
            } else {
                appendError(response.message);
            }
          } catch (error) {
            appendError(error.message);
          }
        };
    
        fetchData();
      }, [systemOperation]); 


    const addNewDepartment = async() => {  
        setSystemOPeration('Adding...');
        console.log('Adding...');
        if( newDepartment.name === ''){
            setSystemOPeration(null);
            setSystemMessage('Department Name is Empty!');
        }else{
            let response = await addDepartment(newDepartment.name, newDepartment.description);
            if(response.isSuccess){
                setSystemOPeration(null);
                setSystemMessage(response.message);
            }else{
                setSystemOPeration(null);
                appendError(response.message);
            }
        }
       
    };

    function viewDepartment(id){
        navigate('/department/view-department', {state: {id: id}});
    }



    return ( 
        <Fragment>
        <div className="department_container">
            <div id="top">
                <div id="directory">
                    <Link to="/" id="to_home">Home </Link>
                    <p id="separator">&gt;</p>
                    <p>Department</p>
                </div>
                
                <div className="breakline" style={{width: '-webkit-fill-available', margin: "0 10px 0 10px", height: "2px", backgroundColor: "var(--global-primary-color)"}}></div>
                <button id="add_department_button"onClick={()=> {setDisplayAddForm(true)}} >Add Department <img id="add_icon"  src={addIcon} alt="" /></button>
            </div>

            <div className="department_content_div">
                { !fetchDepartmentListStatus && <p>Loading...</p> }
            
                { fetchDepartmentListStatus && departmentList.length > 0 &&
                    departmentList.map((department) =>( 
                    <div key={department.data.departmentID} className="department_cardview" onClick={()=>{viewDepartment(department.data.departmentID)}}>
                        <div style={{width: '-webkit-fill-available', height: 'auto', display: 'flex', alignItems: 'center', margin: '0 0 0 3px'}}>
                            <div className="department_logo">
                                <img src={unitLogo} alt="" />
                            </div>
                            <div style={{width: '235px', margin: '0 0 0 3px'}}>
                            <p style={{fontFamily: 'Quicksand', fontWeight: '500', fontSize: 'large'}}>{department.data.name}</p>
                            <p style={{fontFamily: 'Poppins', fontWeight: '300', fontSize: 'small'}}>{department.data.description}</p>
                            </div>
                        </div>
                        <br /><br />
                        <p>No. of Employee: {department.no_employee}</p>

                        <div>
                            <p>{}</p>
                        </div>
                    
                    </div>  ))
                }
                {fetchDepartmentListStatus && departmentList.length === 0 && <p>No Department Yet.</p>}
                
            </div>
               
        </div>

        {displayAddForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                        <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>New Department</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextfieldFragment type='text' name='Department Name' varName='name' value={newDepartment.name} onChange={handleNewDataChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment type='text' name='Description' varName='description' value={newDepartment.description} onChange={handleNewDataChange}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={()=>{setDisplayAddForm(false)}} style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}}>Close</button>
                            <button onClick={()=>{addNewDepartment();setDisplayAddForm(false);}}>Add</button>
                        </div>
                    </div>
                </div>
            }


        { systemOperation && (
                <div style={{position: 'fixed', width: '100%', height: '100%'}}>
                    
                    <Dialog
                        title="Operation"
                        message={systemOperation}
                        />
                </div>
            )} 

            { systemMessage && (

                <div style={{position: 'fixed', width: '100%', height: '100%'}}>

                    <Dialog
                        title="Message"
                        message={systemMessage}
                        type="message"
                        positiveButton={{action: () =>{setSystemMessage('');}, label: 'Okay'}}
                        /> 
                </div>

                )}

                { systemError && (
                <div style={{position: 'fixed', width: '100%', height: '100%'}}>

                    <Dialog
                        title="Error"
                        message={systemError}
                        type="error"
                        positiveButton={{action: () =>{setSystemError('');}, label: 'Okay'}}
                        />
                </div>

                )}

    

                { promptUser && (

                <div style={{position: 'fixed', width: '100%', height: '100%'}}>

                    <Dialog
                        title={promptUser.title}
                        message={promptUser.message}
                        negativeButton={promptUser.negativeButton}
                        positiveButton={promptUser.positiveButton}
                        />
                </div>
                )} 

        </Fragment>
     );
}
 
export default Department;