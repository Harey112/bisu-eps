import './styles/profile.css';
import "./components/styles/employee.css";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getUserByID } from '../util/Database';
import { logOutAccount } from '../util/Account';




function Profile() {
    const [errors, setError] = useState([]);
    const userID = useLocation().state.currentUser;
    const currentUser = sessionStorage.getItem('epsUser').uid;
    const [selectedTab, setSelectedTab] = useState('personal_information')
    const [roleEditMode, setRoleEditMode] = useState(false);
    const [departmentEditMode, setDepartmentEditMode] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [fetchDepartmentListStatus, setFetchDepartmentListStatus] = useState(false);
    const [personalInformation, setPersonalInformation] = useState();
    const [employmentInformation, setEmploymentInformation] = useState();
    const [departmentName, setDepartmentName] = useState();
    const infoTabs = [
        { name: "Personal Information", id: "personal_information" },
        { name: "Family Background", id: "family_background" },
        { name: "Educational Background", id: "educational_background" },
        { name: "Civil Service Eligibility", id: "civil_service_eligibility" },
        { name: "Work Experience", id: "work_experience" },
        { name: "Voluntary Work", id: "voluntary_work" },
        { name: "Learning & Development Program Attended", id: "learning_development_program_attended" },
        { name: "Other Information", id: "other_information" },
      ];



/* 
    useEffect(()=> {
        const fetchData = async () => {
        const response = await getUserByID(userID);
        setPersonalInformation(response.data.personalInformation);
        
        }
 
     fetchData();
        
     },[]); */


   /*   useEffect(()=> {
        const fetchData = async () => {
        const response = await getUserByID(userID);
        setEmploymentInformation(response.data.employmentInformation);
        
        }
 
     fetchData();
        
     },[userID]); */

   /*   useEffect(() => {
        const fetchData = async () => {
            try {
              // Get list of departments
              let response = await getAllDepartments();
              setFetchDepartmentListStatus(true)
              
              if (response.isRetrieved) {
                setDepartmentList(response.data);
              } else {
                addError(response.message);
              }
            } catch (error) {
              addError(error.message);
            }
          };
        fetchData();
      }, []); */

/* 
      useEffect( () => {
        if(departmentList.length > 0){
            departmentList.forEach((department) => {

               const deptName = department.id;
               console.log(employmentInformation);
                 if(deptName === employmentInformation.department){
                    setDepartmentName(department.data().name);
                } 
            })
        }
      }, [departmentList]); */



   /*   const addError = (errorMessage) => {
        setError([...errors,{key: errors.length, message: errorMessage}]);
    }
 */

    /* const closeError = () => {
        setError([]);
    } */
/* 
    const updateEmployentInfo = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setEmploymentInformation((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
    } */
/* 

    const handleLogout = () => {
      logOutAccount();
      sessionStorage.removeItem('epsUser')
       window.location.reload();
   } */



/*     const saveRole= (e) => {
        pushEmployeeInfo(employmentInformation, userID);
        setRoleEditMode(false);
    }

    const saveDepartment = (e) => {
        pushEmployeeInfo(employmentInformation, userID);
        setDepartmentEditMode(false)
    } */



    return ( 
     <div className="profile_container">
      <div className="side_bar">
        
      </div>
     </div>
   );
}
 
export default Profile;