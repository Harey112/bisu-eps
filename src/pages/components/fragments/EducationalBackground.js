import { Fragment, useState, useEffect } from "react";
import Dialog from "./Dialog";
import { getUserByID, pushEducationalBackgroundInfo } from "../../../util/Database";
import { educationalBackground } from "../../../util/DataTemplate";
import TextfieldFragment from "./TextfieldFragment";
import editPencil from '../../../images/edit_pencil.png';
import deleteIcon from '../../../images/delete-user.png';

const EducationalBackground = (props) => {
    const [formData, setFormData] = useState({...educationalBackground});
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [displayEdiForm, setDisplayEditForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);
    const [editData, setEditData] = useState();
    const dummy = {
        level: '',
        nameOfSchool: '',
        program: '', 
        poaFrom: '',
        poaTo: '',
        highestLevel: '',
        yearGraduated: '',
        scholarship: ''
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
                data.sort((a, b) => new Date(b.poaFrom) - new Date(a.poaFrom));
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
                    newArray.sort((a, b) => new Date(b.poaFrom) - new Date(a.poaFrom));
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
                let data = response.data.educationalBackground.data;
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
        await pushEducationalBackgroundInfo({data: formData}, props.userID);
        setSystemOPeration(null);
        setSystemMessage('Saved!');
    } catch (error) {
        setSystemOPeration(null);
        appendError(error.message);
        
    }
};

    return ( 
        <Fragment>
            <div style={{width: '100%', height: '100%', maxHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: '98%', height: '100%'}}>
                    <table>
                        <thead>
                            <tr>
                                <th>Educational Background</th>
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

                    <div style={{width: '100%', overflowX: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <div style={{width: 'max-content', height: 'auto'}}>
                            <table>
                                <thead>
                                    <tr>
                                        {!props.viewMode && 
                                        <th style={{fontSize: 'medium'}}>Action</th>
                                        }
                                        <th style={{fontSize: 'medium'}}>Level</th>
                                        <th style={{fontSize: 'medium'}}>Name of School</th>
                                        <th style={{fontSize: 'medium'}}>Basic Education/Degree/Course</th>
                                        <th><p style={{fontSize: 'medium'}}>Period of Attendance</p><p style={{fontSize: 'medium'}}>(FROM)</p></th>
                                        <th><p style={{fontSize: 'medium'}}>Period of Attendance</p><p style={{fontSize: 'medium'}}>(TO)</p></th>
                                        <th style={{fontSize: 'medium'}}>Highest Level</th>
                                        <th style={{fontSize: 'medium'}}>Year Graduated</th>
                                        <th style={{fontSize: 'medium'}}>Scholarship/Academic Honor Received</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { formData.length > 0 && (
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
                                                <td>{data.level}</td>
                                                <td>{data.nameOfSchool}</td>
                                                <td>{data.program}</td>
                                                <td>{data.poaFrom}</td>
                                                <td>{data.poaTo}</td>
                                                <td>{data.highestLevel}</td>
                                                <td>{data.yearGraduated}</td>
                                                <td>{data.scholarship}</td>
                                            </tr>
                                        ))
                                        )
                                    }
                                </tbody>
                            </table>
                            {(!formData.length > 0) && 
                                <p style={{margin: '10px 0'}}>No Data Yet.</p>
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
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Level' varName='level' value={newData.level} onChange={(e)=> {handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Name of School' varName='nameOfSchool' value={newData.nameOfSchool} onChange={(e)=> {handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Basic Education/Degree/Course' varName='program' value={newData.program} onChange={(e)=> {handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{fontFamily: 'Poppins',fontWeight: '400', width: '100%', display: 'flex', margin: '5px 0'}}>Period of Attendance:</p>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='From' varName='poaFrom' value={newData.poaFrom} onChange={(e)=> {handleNewDataChange(e)}}/>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='To' varName='poaTo' value={newData.poaTo} onChange={(e)=> {handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Highest Level' placeholder="Highest Level/Units Earned (if not graduated)" varName='highestLevel' value={newData.highestLevel} onChange={(e)=> {handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Year Graduated' varName='yearGraduated' value={newData.yearGraduated} onChange={(e)=> {handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Scholarship/Academic Honor Received' varName='scholarship' value={newData.scholarship} onChange={(e)=> {handleNewDataChange(e)}}/>
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
            </div>

            
            {displayEdiForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                    <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>Edit Data</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Level' varName='level' value={editData.data.level} onChange={(e)=> {handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Name of School' varName='nameOfSchool' value={editData.data.nameOfSchool} onChange={(e)=> {handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Basic Education/Degree/Course' varName='program' value={editData.data.program} onChange={(e)=> {handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{fontFamily: 'Poppins',fontWeight: '400', width: '100%', display: 'flex', margin: '5px 0'}}>Period of Attendance:</p>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='From' varName='poaFrom' value={editData.data.poaFrom} onChange={(e)=> {handleEditDataChange(e)}}/>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='To' varName='poaTo' value={editData.data.poaTo} onChange={(e)=> {handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Highest Level' placeholder="Highest Level/Units Earned (if not graduated)" varName='highestLevel' value={editData.data.highestLevel} onChange={(e)=> {handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Year Graduated' varName='yearGraduated' value={editData.data.yearGraduated} onChange={(e)=> {handleEditDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Scholarship/Academic Honor Received' varName='scholarship' value={editData.data.scholarship} onChange={(e)=> {handleEditDataChange(e)}}/>
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
        </Fragment>
     );
}
 
export default EducationalBackground;
