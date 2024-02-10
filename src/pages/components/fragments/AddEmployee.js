import "../styles/employee.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { pushEmployeePersonalInfo, pushEmployeeInfo, getAllDepartments } from "../../../util/Database";
import { createAccount } from "../../../util/Account";
import { personalInformation, currentEmploymentInformation } from "../../../util/DataTemplate";
import { getUserByID } from "../../../util/Database";
import { useNavigate } from "react-router-dom";
import TextfieldFragment from "./TextfieldFragment";
import SelectFragment from "./SelectFragment";

const AddEmployee = () => {

    const navigate = useNavigate();
    const [errors, setError] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);
    const [fetchDepartmentListStatus, setFetchDepartmentListStatus] = useState(false);
    const userType = JSON.parse(sessionStorage.getItem('epsUser')).user;
    const [password, setPassword] = useState();
    const [formData, setFormData] = useState({
        surname: '',
        firstname: '',
        ext: '',
        middlename: '',
        email: '',
        position: '',
        department: [],
    });

    const dummy = {
        surname: '',
        firstname: '',
        ext: '',
        middlename: '',
        email: '',
        position: '',
        department: [],
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
     
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
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
      }
  
  
      const closeError = () => {
          setError([]);
      }

    

    /* const handleSubmit = async(e) => {
       
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
    }; */



    return (
        <>
        <div style={{width: '100%', height: '100%', overflowY: 'auto'}}>

            <div id="top">
                <div id="directory">
                    <Link to="/" className="prev_tab">Home </Link>
                    <p id="separator">&gt;</p>
                    <Link to="/employee" className="prev_tab">Employee</Link>
                    <p id="separator">&gt;</p>
                    <p style={{ minWidth: 'max-content', padding: '0 10px 0 0'}}>Add Employee</p>
                </div>

                <div className="breakline" style={{ width: '-webkit-fill-available', margin: "0", height: "2px", backgroundColor: "var(--global-primary-color)" }}></div>
            </div>
            <div style={{width: '100%'}}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment type='text' name='Surname' varName='surname' value={formData.surname} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment type='text' name='Firstname' varName='firstname' value={formData.firstname} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment type='text' name='Middlename' varName='middlename' value={formData.middlename} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment type='text' name='Extension' varName='ext' value={formData.ext} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment type='text' name='Email' varName='email' value={formData.email} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <SelectFragment name='Position' varName='position' value={null} onChange={null} options={[
                                    {name: 'Staff', value: 'Staff'},
                                    {name: 'Faculty', value: 'Faculty'},
                                    {name: 'Dean', value: 'Dean'},
                                    {name: 'Chairperson', value: 'Chairperson'}]}/>
                            </td>
                        </tr>
                        {formData.position && 
                        <tr>
                            <td>
                                {formData.department.length > 0 && (
                                    formData.department.map((data)=>{

                                    })
                                )
                                }
                                { formData.position === 'Dean' && 
                                    <button>Set New Department</button>
                                }
                                <button>Set Department</button>
                            </td>
                        </tr>
                        }
                    </tbody>
                </table>

            </div>
        </div>
                
                   
        </>
    );
}

export default AddEmployee;