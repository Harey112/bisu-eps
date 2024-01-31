import { Fragment, useState, useEffect } from "react";
import Dialog from "./Dialog";
import { workExperience } from "../../../util/DataTemplate";
import TextfieldFragment from "./TextfieldFragment";
import editPencil from '../../../images/edit_pencil.png';
import deleteIcon from '../../../images/delete-user.png';
import { getUserByID, pushWorkExperienceInfo } from "../../../util/Database";
import SelectFragment from "./SelectFragment";

const WorkExperience = (props) => {
    const [formData, setFormData] = useState({...workExperience});
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [displayEdiForm, setDisplayEditForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);
    const [editData, setEditData] = useState();
    const dummy = {
        inclusiveDateFrom : '',
        inclusiveDateTo: '',
        positionTitle: '',
        office: '',
        monthlySalary: '',
        payGrade: '',
        statusOfAppointment: '',
        isGovernmentService: ''
    }
    const [newData, setNewData] = useState({...dummy});


    function handleNewDataChange(event){
        const { name, value } = event.target;
        setNewData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };


    function handleEditDataChange(event){
        const { name, value } = event.target;
        setEditData((prevEditData) => ({
          ...prevEditData,
          data: {
                ...prevEditData.data,
                [name]: value
          }
        }));
    };



    //Display Errors
    function appendError(newError){
        setSystemError(systemError+"\n- "+newError);
    }


    function addNewData(){

        let hasEmpty = false;
        
        for (const key in newData) {
            if (newData.hasOwnProperty(key)) {
              if (newData[key] === '' || newData[key] === undefined) {
                hasEmpty = true;
              }
            }
          }

        if(!hasEmpty){

            try {
                
                let data = [...formData, newData];
                data.sort((a, b) => new Date(b.inclusiveDateFrom) - new Date(a.inclusiveDateFrom));
                setFormData(data);
    
                setNewData(dummy);
            } catch (error) {
                appendError(error.message);
            }
        
        }else{
            setSystemMessage('Fill all input.');
        }
    }



     function saveEditData(){

        let hasEmpty = false;
        
        for (const key in editData.data) {
            if (editData.data.hasOwnProperty(key)) {
              if (editData.data[key] === '' || editData.data[key] === undefined) {
                hasEmpty = true;
              }
            }
          }

        if(!hasEmpty){
            try {
                
                setFormData(prevFormData => {
                    const newArray = [...prevFormData]; // Create a shallow copy of the array
                    newArray[editData.index] = editData.data; // Modify the element at the specified index
                    newArray.sort((a, b) => new Date(b.inclusiveDateFrom) - new Date(a.inclusiveDateFrom));
                    return newArray;
                });
            } catch (error) {
                appendError(error.message);
            }
        }
    }



    function deleteData(indexToDel) {
        try {
            setFormData(prevFormData => prevFormData.filter((value, index)=>index !== indexToDel ))
            
        } catch (error) {
            appendError(error.message)
        }
        
    }


    //Retrieve Data
    useEffect(()=>{
        const fetchData = async () => {
            setSystemOPeration('Loading...');
            const response = await getUserByID(props.userID);
            if(response.isSuccess){
                let data = response.data.workExperience.data;
                setFormData(data === undefined || data === null? [] : data);
                setSystemOPeration(null);
            }else{
                setSystemOPeration(null);
                appendError(response.message)
            }
        }

   fetchData();
      
   },[props.userID]);



   const save = async () => {
    setSystemOPeration('Saving...');
    try {
        await pushWorkExperienceInfo({data: formData}, props.userID);
        setSystemOPeration(null);
        setSystemMessage('Saved!');
    } catch (error) {
        setSystemOPeration(null);
        appendError(error.message);
        
    }
};

    return ( 
        <Fragment>
            <div style={{width: '98%', height: '100%'}}>
                <table>
                    <thead>
                        <tr>
                            <th>Work Experience</th>
                        </tr>
                    </thead>
                </table>

                {!props.viewMode &&
                    <>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={()=>{setDisplayAddForm(true)}}>Add</button>
                            <button onClick={save}>Save</button>
                        </div>
                        <p style={{margin: '10px 0 0 0'}}>Actions: <img src={editPencil} alt="Edit"  style={{width: '15px', height: '15px'}} /> - Edit | <img src={deleteIcon} alt="Delete" style={{width: '15px', height: '15px'}}/> - Delete</p>
                    </>
                }

                <div style={{width: '100%', overflowX: 'auto'}}>
                    <div style={{width: 'max-content'}}>
                        <table>
                            <thead>
                                <tr>
                                    {!props.viewMode && 
                                        <th style={{fontSize: 'medium'}}>Action</th>
                                        }
                                    <th>Inclusive Date (FROM)</th>
                                    <th>Inclusive Date (TO)</th>
                                    <th>Position Title</th>
                                    <th>Department/Agency/Office/Company</th>
                                    <th>Monthly Salary</th>
                                    <th>Salary/ Job/ Pay Grade & <blockquote>Step / Increment</blockquote></th>
                                    <th>Status of Appointment</th>
                                    <th>Government Service<blockquote style={{fontSize: 'small'}}>(YES/NO)</blockquote></th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.length > 0 && (
                                    formData.map((data, index)=>(
                                        <tr key={index}>
                                            {!props.viewMode &&
                                                <td>
                                                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                                                        <img src={editPencil} alt="Delete" onClick={()=> {setEditData({data: data, index: index}); setDisplayEditForm(true)}} style={{width: '20px', height: '20px'}}/>
                                                        <img src={deleteIcon} alt="Delete" onClick={()=> {setPromptUser({
                                                            title: 'Confirm?',
                                                            message: `Do you want to delete data?`,
                                                            negativeButton: {label: 'Cancel', action: ()=> {setPromptUser(null)}},
                                                            positiveButton: {label: 'Yes', action: ()=>{setPromptUser(null); deleteData(index)}}
                                                        })}} style={{width: '20px', height: '20px'}}/>

                                                    </div>
                                                </td>
                                                }
                                            <td>{data.inclusiveDateFrom}</td>
                                            <td>{data.inclusiveDateTo}</td>
                                            <td>{data.positionTitle}</td>
                                            <td>{data.office}</td>
                                            <td>{data.monthlySalary}</td>
                                            <td>{data.payGrade}</td>
                                            <td>{data.statusOfAppointment}</td>
                                            <td>{data.isGovernmentService}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {(!formData.length > 0) && 
                            <p>No Data Yet.</p>
                        }
                    </div>
                </div>
            </div>
            {displayAddForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                        <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>New Data</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <p style={{fontFamily: 'Poppins',fontWeight: '400', width: '100%', display: 'flex', margin: '5px 0'}}>Inclusive Date</p>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='From' varName='inclusiveDateFrom' value={newData.inclusiveDateFrom} onChange={(e)=>{handleNewDataChange(e)}}/>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='To' varName='inclusiveDateTo' value={newData.inclusiveDateTo} onChange={(e)=>{handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Posistion Title' varName='positionTitle' value={newData.positionTitle} onChange={(e)=>{handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Department / Agency / Office / Company' varName='office' value={newData.office} onChange={(e)=>{handleNewDataChange(e)}} placeholder='(Write in full/Do not abbreviate)'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Monthly Salary' varName='monthlySalary' value={newData.monthlySalary} onChange={(e)=>{handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Salary/ Job/ Pay Grade' varName='payGrade' value={newData.payGrade} onChange={(e)=>{handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Status of Appointment' varName='statusOfAppointment' value={newData.statusOfAppointment} onChange={(e)=>{handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectFragment type='text' name='Government Service' varName='isGovernmentService' value={newData.isGovernmentService} onChange={(e)=>{handleNewDataChange(e)}} options={[
                                            {name: 'YES', value: 'YES'},
                                            {name: 'NO', value: 'NO'}
                                        ]}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={()=>{setDisplayAddForm(false)}} style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}}>Close</button>
                            <button onClick={addNewData}>Add</button>
                        </div>
                    </div>
                </div>
            }

            {displayEdiForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                    <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>Edit Data</p>
                    <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <p style={{fontFamily: 'Poppins',fontWeight: '400', width: '100%', display: 'flex', margin: '5px 0'}}>Inclusive Date</p>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='From' varName='inclusiveDateFrom' value={editData.data.inclusiveDateFrom} onChange={(e)=>{handleEditDataChange(e)}}/>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='To' varName='inclusiveDateTo' value={editData.data.inclusiveDateTo} onChange={(e)=>{handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Posistion Title' varName='positionTitle' value={editData.data.positionTitle} onChange={(e)=>{handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Department / Agency / Office / Company' varName='office' value={editData.data.office} onChange={(e)=>{handleEditDataChange(e)}} placeholder='(Write in full/Do not abbreviate)'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Monthly Salary' varName='monthlySalary' value={editData.data.monthlySalary} onChange={(e)=>{handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Salary/ Job/ Pay Grade' varName='payGrade' value={editData.data.payGrade} onChange={(e)=>{handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Status of Appointment' varName='statusOfAppointment' value={editData.data.statusOfAppointment} onChange={(e)=>{handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    <SelectFragment type='text' name='Government Service' varName='isGovernmentService' value={editData.data.isGovernmentService} onChange={(e)=>{handleEditDataChange(e)}} options={[
                                            {name: 'YES', value: 'YES'},
                                            {name: 'NO', value: 'NO'}
                                        ]}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={()=>{setEditData({...dummy}); setDisplayEditForm(false)}} style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}}>Close</button>
                            <button onClick={()=>{saveEditData(); setEditData({...dummy}); setDisplayEditForm(false)}}>Save</button>
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


                 { props.viewMode && (

                <div style={{position: 'fixed', width: '100%', height: '100%'}}>
                </div>
                )}   

        </Fragment>
     );
}
 
export default WorkExperience; 