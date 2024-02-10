import "./styles/employee.css";
import addIcon from "../../images/add_icon.png"
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllDepartments, searchEmployee, getUserByID } from "../../util/Database";


const Employee = () => {
    let navigate = new useNavigate();
    const [departmentName, setDepartmentName] = useState();
    const [errors, setError] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [fetchEmployeeListStatus, setFetchEmployeeListStatus] = useState(false);
    const [departmentList, setDepartmentList] = useState([]);
    const [fetchDepartmentListStatus, setFetchDepartmentListStatus] = useState(false);
    const [userType, setUserType] = useState();
    const currentUser = JSON.parse(sessionStorage.getItem('epsUser'));
    const [searchFilter, setSearchFilter] = useState({
        keyword: '',
        role: 'All',
        department: 'All'
      });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setSearchFilter((prevFilter) => ({
          ...prevFilter,
          [name]: value
        }));
      };
    

    useEffect(() => {
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
      }, []);

      useEffect(() => {
  const fetchData = async () => {
    setFetchEmployeeListStatus(false);
    const response = await searchEmployee(searchFilter);
    
    if (response.isSuccess) {
      setEmployeeList(response.list);
      setFetchEmployeeListStatus(true);
    } else {
      console.error(response.message);
      setFetchEmployeeListStatus(true);
    }
  };

  fetchData();
}, [searchFilter]);

// Use another useEffect to log the updated employeeList
useEffect(() => {
  console.log(employeeList);
}, [employeeList]);



    let addEmployee = () => {
        navigate('/employee/add-employee');
    };

    const addError = (errorMessage) => {
        setError([...errors,{key: errors.length, message: errorMessage}]);
    }


    const closeError = () => {
        setError([]);
    }

    return ( 

        <div className="employee_container">

          <div id="top">
              <div id="directory">
                  <Link to="/" className="prev_tab">Home </Link>
                  <p id="separator">&gt;</p>
                  <p className="current_tab">Employee</p>
              </div>
              
              <div className="breakline" style={{width: '-webkit-fill-available', margin: "0 10px 0 10px", height: "2px", backgroundColor: "var(--global-primary-color)"}}></div>
              {currentUser &&
                <>
                {currentUser.user === 'HR' &&

                <button id="add_button" onClick={addEmployee}>Add Employee <img id="add_icon"  src={addIcon} alt="" /></button>
                }
                </>
              }
          </div>
          <div className="employee_content_div">
          <div className="employee_filter" >
              <div className="search_div">
                  <input type="search" name="keyword" id="search_box" placeholder="Search" value={searchFilter.keyword} onChange={handleInputChange}/>
              </div>
              <div style={{display: 'flex'}}>
              <div style={{ display: 'flex', margin: '10px 0', alignItems: 'center' }}>
                  <p className="personal_data-label" style={{ margin: '0 10px 0 0 ' }}>Position: </p>
                  <select  name="role"  className="custom_select"  id="role"  style={{ width: 'auto' }}  value={searchFilter.role}  onChange={handleInputChange}>
                      <option value="All">All</option>
                      <option value="Staff">Staff</option>
                      <option value="Faculy">Faculty</option>
                      <option value="Dean">Dean</option>
                      <option value="Chairperson">Chairperson</option>
                      <option value="HR">Human Resource</option>
                  </select>
              </div>
              <div style={{ display: 'flex', margin: '10px 10px', alignItems: 'center' }}>
                  <p className="personal_data-label" style={{ margin: '0 10px 0 0 ' }}>Department: </p>
                  <select name="department" className="custom_select" style={{ width: '250px' }} value={searchFilter.department} onChange={handleInputChange}>
                      <option value="All">{fetchDepartmentListStatus ? 'All' : 'Loading...'}</option>
                      {fetchDepartmentListStatus && departmentList.length > 0 && departmentList.map((department) => (
                      <option key={department.data().departmentID} value={department.data().departmentID}>{department.data().name}</option>
                  ))}
                  </select>
              </div>

              </div>
            </div>

            <div className="employee_list">
                  { !fetchEmployeeListStatus &&
                      <p>Loading...</p>
                  }

                  {employeeList && fetchEmployeeListStatus &&
                    employeeList.map((employee) => {
                      const { firstname, middlename, surname, ext } = employee.data.personalInformation;
                      const { role, department } = employee.data.employmentInformation;
                  
                      return (
                        <div className="employee" key={employee.id} onClick={(e)=>{navigate('/profile', { state: { currentUser: employee.id } });}}>
                          <p id="name">{firstname} {middlename} {surname} {ext} </p>
                          <p id="details">{role} | {departmentList.map((departnmt)=> (departnmt.id === department ? departnmt.data().name: ''))}</p>
                        </div>
                      );
                    })
                  }
    
                  { employeeList.length === 0 && fetchEmployeeListStatus &&
                    
                      <p>No Employees Found</p>
                  }

              </div>
          </div>
        </div>
    

     );
}
 
export default Employee;