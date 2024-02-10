import { useEffect, useState } from "react";
import {Link, useLocation, useNavigate } from "react-router-dom";
import { getDepartment, searchEmployee } from "../../../util/Database";
import userMaleIcon from '../../../images/usermale.png';
import userFemaleIcon from '../../../images/userfemale.png';
import plusButton from '../../../images/plus-icon.png';

const ViewDepartment = () => {
    const navigate = useNavigate();
    const location = useLocation().state;
    const [departmentDean, setDepartmentDean] = useState();
    const [departmentChairperson, setDepartmentChairperson] = useState();
    const [department, setDepartment] = useState();


// Assuming location.id is available from the component's props or state
    useEffect(() => {
        const fetchDepartmentInfo = async () => {
            const query = await getDepartment(location.id);
            console.log(query);
            if(query.isRetrieved)
                setDepartment(query.data);
            else
                console.log(query.message);
        };

        fetchDepartmentInfo();
    }, [location.id]);





    useEffect(()=>{
        const fetchData = async() => {
            const query = await searchEmployee({role: 'Dean', department: location.id, keyword: ''});
            console.log(query);
            setDepartmentChairperson(query.list[0]);
               }

            fetchData();
    }, [location.id]);


    useEffect(()=>{
        const fetchData = async() => {
            const query = await searchEmployee({role: 'Chairperson', department: location.id, keyword: ''});
            console.log(query);
            setDepartmentDean(query.list[0]);
               }

            fetchData();
    }, [location.id]);



    return ( 
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto'}}>
            <div id="top">
                <div id="directory">
                    <Link to="/" className="path">Home </Link>
                    <p id="separator">&gt;</p>
                    <Link to="/department" className="path">Department </Link>
                    <p id="separator">&gt;</p>
                    <p style={{width: 'max-content'}}>{department ? department.name : "Loading..."}</p>
                </div>
                
                <div className="breakline" style={{width: '-webkit-fill-available', margin: "0 10px 0 10px", height: "2px", backgroundColor: "var(--global-primary-color)"}}></div>
            </div>
            {/* Dean Card */}
            <div style={{width: '100%', height: '300px' , display: 'flex', justifyContent: 'space-around', margin: '20px 0 0 0'}}>
                <div onClick={()=>{navigate(departmentDean ? '/profile' : '/employee/add-employee', {state: {currentuser: departmentDean ? departmentDean.id : ''}})}} style={{height: '100%', width: '250px', border: '2px solid var(--global-primary-color)', borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' ,cursor: 'pointer'}}>
                    {/* For User Icon */}
                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {departmentDean ? (
                            <img src={departmentDean.data.personalInformation.sex === 'Female' ?  userFemaleIcon : userMaleIcon} alt="" style={{ width: '100%', height: '100%', opacity: '.5'}} />
                        ):(
                            <img src={plusButton} alt="Plus" style={{ width: '80%', height: '80%', opacity: '.5'}} />
                        )}
                    </div>
                    {departmentDean ? 
                        <div style={{width: '98%', textAlign: 'center', margin: '20px 0 0 0'}}>
                            <h3>{departmentDean.data.personalInformation.firstname} {departmentDean.data.personalInformation.middlename} {departmentDean.data.personalInformation.surname}</h3>
                            <div className="breakline" style={{width: '100%', height: "2px", margin: '10px 0', backgroundColor: "var(--global-primary-color)"}}></div>
                            <h3 style={{fontWeight: '300'}}>Dean</h3>
                        </div>
                        : 
                        <p>Add Dean</p>
                    }
                </div>
                {/* Chairperson Card */}
                <div onClick={()=>{navigate(departmentChairperson ? '/profile' : '/employee/add-employee', {state: {currentuser: departmentChairperson ? departmentChairperson.id : ''}})}} style={{height: '100%', width: '250px', border: '2px solid var(--global-primary-color)', borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' ,cursor: 'pointer'}}>
                    {/* For User Icon */}
                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {departmentChairperson ? (
                            <img src={departmentChairperson.data.personalInformation.sex === 'Female' ?  userFemaleIcon : userMaleIcon} alt="" style={{ width: '100%', height: '100%', opacity: '.5'}} />
                        ):(
                            <img src={plusButton} alt="Plus" style={{ width: '80%', height: '80%', opacity: '.5'}} />
                        )}
                    </div>
                    {departmentChairperson ? 
                        <div style={{width: '98%', textAlign: 'center', margin: '20px 0 0 0'}}>
                            <h3>{departmentChairperson.data.personalInformation.firstname} {departmentChairperson.data.personalInformation.middlename} {departmentChairperson.data.personalInformation.surname}</h3>
                            <div className="breakline" style={{width: '100%', height: "2px", margin: '10px 0', backgroundColor: "var(--global-primary-color)"}}></div>
                            <h3 style={{fontWeight: '300'}}>Dean</h3>
                        </div>
                        : 
                        <p>Add Chairperson</p>
                    }
                </div>
            </div>
        </div>
     );
}
 
export default ViewDepartment;