import { Fragment, useState, useEffect } from "react";
import Dialog from "./Dialog";
import { learningProgramAttended } from "../../../util/DataTemplate";
import TextfieldFragment from "./TextfieldFragment";
import editPencil from '../../../images/edit_pencil.png';
import deleteIcon from '../../../images/delete-user.png';
import { getUserByID, pushLearingProgramAttendedInfo } from "../../../util/Database";


const LearningProgramAttended = (props) => {
    const [formData, setFormData] = useState({...learningProgramAttended});
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [displayEdiForm, setDisplayEditForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);
    const [editData, setEditData] = useState();
    const dummy = {
        title: '',
        inclusiveDateFrom: '',
        inclusiveDateTo: '',
        numberHours: '',
        type: '',
        sponsor: ''
      };

    const [newData, setNewData] = useState(dummy);
    
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
                let data = response.data.learningProgramAttended.data;
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
        await pushLearingProgramAttendedInfo({data: formData}, props.userID);
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
                            <th>Title of Learning and Development Interventions / Training Programs</th>
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
                                    <th>Title of Learning and Development Program</th>
                                    <th>Inclusive Date (FROM)</th>
                                    <th>Inclusive Date (TO)</th>
                                    <th>Number of Hours</th>
                                    <th>Type of LD <blockquote style={{fontSize: 'small'}}>( Managerial / Supervisory / Technical / etc)</blockquote> </th>
                                    <th>Conducted / Sponsored By</th>
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
                                        <td>{data.title}</td>
                                        <td>{data.inclusiveDateFrom}</td>
                                        <td>{data.inclusiveDateTo}</td>
                                        <td>{data.numberHours}</td>
                                        <td>{data.type}</td>
                                        <td>{data.sponsor}</td>
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
            { displayAddForm && (
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                        <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>New Data</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Title of Learning and Development Program' varName='title' value={newData.title} onChange={(e)=>{handleNewDataChange(e)}} placeholder='(Write in Full)'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style={{fontFamily: 'Poppins',fontWeight: '400', width: '100%', display: 'flex', margin: '5px 0'}}>Inclusive Date</p>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='From' varName='inclusiveDateFrom' value={newData.inclusiveDateFrom} onChange={(e)=>{handleNewDataChange(e)}}/>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='To' varName='inclusiveDateTo' value={newData.inclusiveDateTo} onChange={(e)=>{handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Number of Hours' varName='numberHours' value={newData.numberHours} onChange={(e)=>{handleNewDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Type of LD' varName='type' value={newData.type} onChange={(e)=>{handleNewDataChange(e)}} placeholder='( Managerial/ Supervisory / Technical / etc.)'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Conducted / Sponsored By' varName='sponsor' value={newData.sponsor} onChange={(e)=>{handleNewDataChange(e)}} placeholder='(Write in Full)'/>
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
            )}

            {displayEdiForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                    <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>Edit Data</p>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='Title of Learning and Development Program' varName='title' value={editData.data.title} onChange={(e)=>{handleEditDataChange(e)}} placeholder='(Write in Full)'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p style={{fontFamily: 'Poppins',fontWeight: '400', width: '100%', display: 'flex', margin: '5px 0'}}>Inclusive Date</p>
                                    <TextfieldFragment disable={props.viewMode} type='date' name='From' varName='inclusiveDateFrom' value={editData.data.inclusiveDateFrom} onChange={(e)=>{handleEditDataChange(e)}}/>
                                    <TextfieldFragment disable={props.viewMode} type='date' name='To' varName='inclusiveDateTo' value={editData.data.inclusiveDateTo} onChange={(e)=>{handleEditDataChange(e)}}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='Number of Hours' varName='numberHours' value={editData.data.numberHours} onChange={(e)=>{handleEditDataChange(e)}}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='Type of LD' varName='type' value={editData.data.type} onChange={(e)=>{handleEditDataChange(e)}} placeholder='( Managerial/ Supervisory / Technical / etc.)'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='Conducted / Sponsored By' varName='sponsor' value={editData.data.sponsor} onChange={(e)=>{handleEditDataChange(e)}} placeholder='(Write in Full)'/>
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
 
export default LearningProgramAttended;