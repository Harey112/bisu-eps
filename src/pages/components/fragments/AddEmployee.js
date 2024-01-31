import "../styles/employee.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { pushEmployeePersonalInfo, pushEmployeeInfo, getAllDepartments } from "../../../util/Database";
import { createAccount } from "../../../util/Account";
import { personalInformation, currentEmploymentInformation } from "../../../util/DataTemplate";
import { getUserByID } from "../../../util/Database";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {

    const navigate = useNavigate();
    const [errors, setError] = useState([]);
    const [confirmPromptStatus, setConfirmPromtStatus] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [fetchDepartmentListStatus, setFetchDepartmentListStatus] = useState(false);
    const [addingMessage,setAddingMessage] = useState();
    const [addingResult,setAddingResult] = useState();
    const [userType, setUserType] = useState();
    const userID = sessionStorage.getItem('epsUser');
    const [password, setPassword] = useState();
    const [formData, setFormData] = useState({
        surname: '',
        firstname: '',
        ext: '',
        middlename: '',
        email: '',
        role: 'Staff',
        department: '',
    });

    const dummy = {
        surname: '',
        firstname: '',
        ext: '',
        middlename: '',
        email: '',
        role: 'Staff',
        department: '',
    };


    useEffect(()=>{
        async function fetchData( ){
          await getUserByID(userID).then((res) => {
            if(res.isSuccess){
              setUserType(res.data.employmentInformation.role);
              console.log(res);
              if(res.data.employmentInformation.role === 'Admin'){
                formData.role = 'HR';
              }
              switch(res.data.employmentInformation.role){
                case 'Admin':
                case 'HR':

                break;

                default:
                    console.log(userType);
                    navigate('/employee');
              }
            }
          });
        }
      
          fetchData();
          
      },[]);



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
     
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
        console.log(formData);
      };

      useEffect(() => {
       
                if(departmentList.length > 0){

                    formData.department = departmentList[0].id;
                    console.log(formData.department);
                }
           
      }, [fetchDepartmentListStatus]);




      useEffect(() => {
        const fetchData = async () => {
            try {
              // Get list of departments
              let response = await getAllDepartments();
              setFetchDepartmentListStatus(true)

              if (response.isRetrieved) {
                setDepartmentList(response.data);
                if(departmentList.length > 0){

                    formData.department = departmentList[0].id;
                    console.log(formData.department);
                }
              } else {
                addError(response.message);
                console.error(response.message);
              }
            } catch (error) {
              addError(error.message);
            }
          };
        fetchData();
      }, [formData.type]);

 
  
    const addError = (errorMessage) => {
        setError([...errors,{key: errors.length, message: errorMessage}]);
        setAddingMessage('');
    }


    const closeError = () => {
        setError([]);
    }
    

    const handleSubmit = async(e) => {
       
      setAddingMessage('Adding...');
      const randNum = Math.floor(Math.random() * 900) + 100;
      const password = formData.surname.toLocaleLowerCase().replace(/\s/g, '')+formData.firstname.toLocaleLowerCase().replace(/\s/g, '')+randNum;
      setPassword(password);
      const response = await createAccount(formData.email, password);
      const employeeID = response.uid;
      console.log("Passwor: "+password);

      const personalInfo = {...personalInformation};
      personalInfo.firstname = formData.firstname;
      personalInfo.middlename = formData.middlename;
      personalInfo.surname = formData.surname;
      personalInfo.ext = formData.ext;
      personalInfo.email = formData.email;


      const employmentInfo = {...currentEmploymentInformation};
      employmentInfo.role = formData.role;
      employmentInfo.department = formData.department;


      if(response.isCreated){
        let response1 = await pushEmployeePersonalInfo(personalInfo, employeeID);
        let response2 = await pushEmployeeInfo(employmentInfo, employeeID);
        setAddingMessage(response1.message);
        setConfirmPromtStatus(false);
        setAddingMessage('')
        console.log("New Passwaord: "+password);
        if(response1.isSuccess && response2.isSuccess){
            setAddingResult("Account Successfully Added!");
            setFormData(dummy);
        }else{
            addError(response1.message, response2.message);
        }
      }else{
        addError(response.message);
      }
     

     console.log("New UID: "+response.uid);
    };


    


    return (
        <>
            <div id="top">
                <div id="directory">
                    <Link to="/" className="prev_tab">Home </Link>
                    <p id="separator">&gt;</p>
                    <Link to="/employee" className="prev_tab">Employee</Link>
                    <p id="separator">&gt;</p>
                    <p style={{ minWidth: 'max-content' }}>Add Employee</p>
                </div>

                <div className="breakline" style={{ width: '-webkit-fill-available', margin: "0", height: "2px", backgroundColor: "var(--global-primary-color)" }}></div>
            </div>

            <form className="new_employee_box" onSubmit={(e) => { e.preventDefault();setConfirmPromtStatus(true)}}>

                <p id="category" style={{ width: 'auto', fontFamily: 'Poppins', margin: '-14px 0 0 15px', padding: '0 8px 0 8px', backgroundColor: 'var(--global-secondary-color)' }}>Basic Information</p>
                <div style={{ height: '-webkit-fill-available', width: '-webkit-fill-available', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                {/* <div style={{ margin: '10px 0 10px 0', height: 'auto', width: '98%', display: 'flex', flexFlow: 'row', borderStyle: 'solid', borderWidth: '1px', borderColor: 'var(--global-primary-color)' }}>
                            <div style={{ width: '-webkit-fill-available'}}>
                                <div className="personal_data-input-div ">
                                    <p className="personal_data-label">Surname: </p>
                                    <input type="text" id="surname" name="surname" className="personal_data-input" onChange={handleInputChange} value={formData.surname} required/>
                                </div>
                                <div style={{ width: '-webkit-fill-available', height: '60px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                    <div className="personal_data-input-div " style={{ width: '70%' }}>
                                        <p className="personal_data-label">Firstname: </p>
                                        <input type="text" id="firstname" name="firstname" className="personal_data-input" onChange={handleInputChange} value={formData.firstname} required/>
                                    </div>
                                    <div className="personal_data-input-div" style={{ width: '30%', borderStyle: 'none none solid solid', borderWidth: '0 0 1px 1px' }}>
                                        <p className="personal_data-label">Extension(SR.,JR.): </p>
                                        <input type="text" id="ext" name="ext" className="personal_data-input" style={{ width: '100%' }} onChange={handleInputChange} value={formData.ext}/>
                                    </div>
                                </div>
                                <div className="personal_data-input-div">
                                    <p className="personal_data-label">Middle Name: </p>
                                    <input type="text" id="middlename" name="middlename" className="personal_data-input" onChange={handleInputChange} value={formData.middlename} required/>
                                </div>
                                <div className="personal_data-input-div">
                                    <p className="personal_data-label">Email: </p>
                                    <input type="text" id="email" name="email" autoComplete="email" className="personal_data-input" onChange={handleInputChange} value={formData.email} required/>
                                </div>

                                <div className="personal_data-input-div" style={{ borderStyle: 'none none none none' }}>
                                  <div style={{ height: '100%', width: '-webkit-fill-available', display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', flexWrap: 'nowrap' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <div style={{display: 'flex', margin: '20px 0', alignItems: 'center'}}>
                                    <p className="personal_data-label" style={{margin: '0 10px 0 0 '}}>Set Role: </p>
                                        <select name="role" className="custom_select" id="role" onChange={handleInputChange} value={formData.role} required>
                                            { userType && <>
                                                {userType !== 'Admin' && <>
                                                <option value="Staff">Staff</option>
                                                <option value="Faculty">Faculty</option>
                                                <option value="Dean">Dean</option>
                                                <option value="Chairperson">Chairperson</option>
                                                </>
                                                }
                                                <option value="HR">Human Resource</option>
                                            </>
                                            }
                                        </select>
                                    </div>
                                    </div>
                                    <div style={{display: 'flex', margin: '20px 0', alignItems: 'center'}}>
                                        <p className="personal_data-label" style={{margin: '0 10px 0 0 '}}>Set Department: </p>
                                        <select name="department" className="custom_select" onChange={handleInputChange} value={formData.department} required>
                                        {!fetchDepartmentListStatus && <option value="">Loading...</option>}
                                            
                                            {fetchDepartmentListStatus && 
                                                departmentList.length > 0 && departmentList.map((department) => (<option key={department.data().departmentID} value={department.data().departmentID}>{department.data().name}</option>))
                                            }
                                        </select>
                                    </div>
                        
                                  </div>
                                </div>

                            </div>
                        </div> */}
                </div>
                    <div style={{width: '90%', margin: '20px 0', padding: '0 5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <p>*Please double-check the information you entered.</p>
                        <button type="submit" >Submit</button>
                    </div>
            </form>
            { confirmPromptStatus && 
                <div className="dialog_div">
                    <form className="dialog_prompt">
                        <h2 style={{margin: '10px 0'}}>Confirm?</h2>
                        <div style={{margin: '40px'}}>
                            <p>Name: {formData.firstname} {formData.middlename} {formData.surname} {formData.ext}</p><br />
                            <p>Email: {formData.email}</p>
                        </div>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-around', margin: '10px 0 -10px 0'}}>
                            <button type="button" className="negative_button" onClick={(e)=> {setConfirmPromtStatus(false);}} >Cancel</button>
                            <button type="button" onClick={handleSubmit}>Confirm</button>
                        </div>
                        <p>{addingMessage}</p>
                    </form>
                </div>
        }
            
        { addingResult &&
             <div className="dialog_div">
             <form className="dialog_prompt">
                 <div style={{margin: '40px'}}>
                     <p className="personal_data-label">{addingResult}</p><br />
                 </div>
                 <div style={{width: '100%', display: 'flex', justifyContent: 'space-around', margin: '10px 0 -10px 0'}}>
                    <p> Password: {password}</p>;<br />
                     <button type="button" onClick={(e)=> {setAddingResult(false);}} >Okay</button>
                 </div>
             </form>
         </div>   
        }
            { errors.length > 0 && 
                <div className="dialog_div">
                    <form className="dialog_prompt" style={{border: '3px solid #ff6464'}}>
                        <h2 style={{margin: '10px 0'}}>Error: {errors.length}</h2>
                        <div style={{width: '500px', height: '200px', overflow: 'auto', border: ' 2px solid black'}}>
                        {
                            errors.map((err) => (<p key={err.key} style={{margin: '5px 0'}}>Error: {err.message}</p>))
                        }
                        </div>
                        
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-around', margin: '20px 0 -10px 0'}}>
                            <button type="button" onClick={closeError} >Close</button>
                        </div>
                    </form>
                </div>
        }
        </>
    );
}

export default AddEmployee;