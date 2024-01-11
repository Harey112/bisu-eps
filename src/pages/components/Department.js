import "./styles/department.css";
import addIcon from "../../images/add_icon.png"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { addDepartment, getAllDepartments, searchEmployee } from "../../util/Database";
import unitLogo from '../../images/unit.png'

const Department = () => {

    const [showAddDialog, setDialogStatus] = useState(false);
    const [addStatus, setAddStatus] = useState('');
    const [errors, setError] = useState([]);
    const [departmentName, setDepartmentName] = useState('');
    const [description, setDescription] = useState('');
    const [departmentList, setDepartmentList] = useState([]);
    const [fetchDepartmentListStatus, setFetchDepartmentListStatus] = useState(false);

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
              addError(response.message);
            }
          } catch (error) {
            addError(error.message);
          }
        };
    
        fetchData();
      }, [addStatus, addError]); 


    const addDepartmentDialog = () => {
        setAddStatus('');
        setDialogStatus(true);
    };


    const createDepartment = async() => {  
        setAddStatus('Adding...');
        if(departmentName === ''){
            setAddStatus('Department Name is Empty!');
        }else{
            let response = await addDepartment(departmentName, description);
            if(response.isSuccess){
                setDepartmentName('');
                setDescription('');
                setAddStatus(response.message);
            }else{
                addError(response.message);
            }
        }
       
    };

    const cancelAdd = () => {
        setDepartmentName('');
        setDescription('');
        setDialogStatus(false);
    };


    const addError = (errorMessage) => {
        setError([...errors,{key: errors.length, message: errorMessage}]);
    }


    const closeError = () => {
        setError([]);
    }
    



    return ( 
        <><div className="department_container">
            <div id="top">
                <div id="directory">
                    <Link to="/" id="to_home">Home </Link>
                    <p id="separator">&gt;</p>
                    <p>Department</p>
                </div>
                
                <div className="breakline" style={{width: '-webkit-fill-available', margin: "0 10px 0 10px", height: "2px", backgroundColor: "var(--global-primary-color)"}}></div>
                <button id="add_department_button"onClick={addDepartmentDialog} >Add Department <img id="add_icon"  src={addIcon} alt="" /></button>
            </div>

            <div className="department_content_div">
                { !fetchDepartmentListStatus && <p>Loading...</p> }
            
                { fetchDepartmentListStatus && departmentList.length > 0 &&
                    departmentList.map((department) =>( 
                    <div key={department.data.departmentID} className="department_cardview">
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

        {showAddDialog && 
        
            <div className="dialog_div">
                <form className="dialog_promt" style={{width: '500px', height: '300px', padding: '0'}}>
                    <h2>Add New Department</h2>
                    <input type="text" id="department_name" placeholder="Department Name" onChange={(e) => {setDepartmentName(e.target.value);setAddStatus('')}} value={departmentName} style={{margin: '0 0 0 0'}}/>
                    <input type="text" id="description" placeholder="Description (Optional)" style={{margin: '0 0 0 0'}} onChange={(e) => {setDescription(e.target.value)}} value={description}/>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-around',  margin: '0 0 -30px 0'}}>
                        <button type="button" className="negative_button" onClick={cancelAdd}>Cancel</button>
                        <button type="button" onClick={createDepartment}>Add</button>
                        
                    </div>
                    <p style={{fontSize: 'small', margin: '5px 0 0 0', height: '5px', fontFamily: 'Poppins'}}>{addStatus}</p>
                </form>
            </div>
            }

        { errors.length > 0 && 
            <div className="dialog_div">
                <form className="dialog_promt" style={{border: '3px solid #ff6464'}}>
                    <h2 style={{margin: '10px 0'}}>Error: {errors.length}</h2>
                    <div style={{width: '500px', height: '200px', overflow: 'auto', border: ' 2px solid black'}}>
                    {
                        errors.map((err) => (<p key={err.key} style={{margin: '5px 0'}}>Error: {err.message}</p>))
                    }
                    </div>
                    
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-around', margin: '20px 0'}}>
                        <button type="button" onClick={closeError} >Close</button>
                    </div>
                </form>
            </div>
        }


        </>
     );
}
 
export default Department;