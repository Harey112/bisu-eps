import { useState, useEffect, Fragment } from "react";
import Dialog from "./Dialog";
import { civilServiceEligibilty } from "../../../util/DataTemplate";
import TextfieldFragment from "./TextfieldFragment";
import editPencil from '../../../images/edit_pencil.png';
import deleteIcon from '../../../images/delete-user.png';
import { getUserByID, pushCivilServiceInfo } from "../../../util/Database";

const CivilServiceEligibilty = (props) => {
    const [formData, setFormData] = useState({...civilServiceEligibilty});
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [displayEdiForm, setDisplayEditForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);
    const [editData, setEditData] = useState();
    const dummy = {
        careerService: '',
        rating: '',
        date: '',
        venue: '',
        licenseNumber: '',
        licenseValidity: ''};
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
                    newArray.sort((a, b) => new Date(b.date) - new Date(a.date));
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
                let data = response.data.civilServiceEligibilty.data;
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
        await pushCivilServiceInfo({data: formData}, props.userID);
        setSystemOPeration(null);
        setSystemMessage('Saved!');
    } catch (error) {
        setSystemOPeration(null);
        appendError(error.message);
        
    }
};



    return ( 
        <Fragment>
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '98%', height: '100%'}}>
                    <table>
                        <thead>
                            <tr>
                                <th>Civil Service Eligibility</th>
                            </tr>
                        </thead>
                    </table>

                    {!props.viewMode &&
                        <>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                <button onClick={()=>{setDisplayAddForm(true)}}>Add</button>
                                <button onClick={save}>Save</button>
                            </div>
                            <p style={{margin: '10px 0 0 0'}}>Actions: <img src={editPencil} alt="Edit" style={{width: '15px', height: '15px'}} /> - Edit | <img src={deleteIcon} alt="Delete" style={{width: '15px', height: '15px'}}/> - Delete</p>
                        </>
                    }

                    <div style={{width: '100%', overflowX: 'auto'}}>
                        <div  style={{width: 'max-content'}}>
                            <table>
                                <thead>
                                    <tr>
                                        {!props.viewMode && 
                                            <th style={{fontSize: 'medium'}}>Action</th>
                                        }
                                        <th>Career Service/RA 1080 (BOARD/BAR)<blockquote>Special Laws/CES/CSEE</blockquote><blockquote>Barangay Eligibility/Driver's License</blockquote></th>
                                        <th>Rating</th>
                                        <th>Date of Examination/<blockquote>Conferment</blockquote></th>
                                        <th>Place of Examination/Conferment</th>
                                        <th>License Number</th>
                                        <th>License Validity</th>
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
                                                <td>{data.careerService}</td>
                                                <td>{data.rating}</td>
                                                <td>{data.date}</td>
                                                <td>{data.venue}</td>
                                                <td>{data.licenseNumber}</td>
                                                <td>{data.licenseValidity}</td>
                                            </tr>
                                        ))
                                        )
                                    }
                                    <tr>
                                    </tr>
                                </tbody>
                            </table>
                            {(!formData.length > 0) && 
                                <p>No Data Yet.</p>
                            }
                        </div>
                    </div>
                </div>
                { displayAddForm &&
                    <div className="dialog_div" style={{position: 'fixed'}}>
                        <div className="dialog_prompt">
                            <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>New Data</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Professional Certifications' varName='careerService' value={newData.careerService} onChange={(e)=>{handleNewDataChange(e);}} placeholder="CAREER SERVICE / RA 1080 (BOARD / BAR) UNDER SPECIAL LAW / CES / CSEE / BARANGAY ELIGIBILITY / DRIVER'S LICENSE"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Rating' varName='rating' value={newData.rating} onChange={(e)=>{handleNewDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='date' name='Date of Examination' varName='date' value={newData.date} onChange={(e)=>{handleNewDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Place of Examination' varName='venue' value={newData.venue} onChange={(e)=>{handleNewDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='License Number' varName='licenseNumber' value={newData.licenseNumber} onChange={(e)=>{handleNewDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='License Validity' varName='licenseValidity' value={newData.licenseValidity} onChange={(e)=>{handleNewDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                <button onClick={()=>{setDisplayAddForm(false)}} style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}}>Close</button>
                                <button onClick={addNewData} >Add</button>
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
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Professional Certifications' varName='careerService' value={editData.data.careerService} onChange={(e)=>{handleEditDataChange(e);}} placeholder="CAREER SERVICE / RA 1080 (BOARD / BAR) UNDER SPECIAL LAW / CES / CSEE / BARANGAY ELIGIBILITY / DRIVER'S LICENSE"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Rating' varName='rating' value={editData.data.rating} onChange={(e)=>{handleEditDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Date of Examination' varName='date' value={editData.data.date} onChange={(e)=>{handleEditDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Place of Examination' varName='venue' value={editData.data.venue} onChange={(e)=>{handleEditDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='License Number' varName='venue' value={editData.data.venue} onChange={(e)=>{handleEditDataChange(e);}} placeholder='Rating (If applicable)'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <TextfieldFragment disable={props.viewMode} type='text' name='License Validity' varName='licenseValidity' value={editData.data.licenseValidity} onChange={(e)=>{handleEditDataChange(e);}} placeholder='Rating (If applicable)'/>
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
            </div>
        </Fragment>
     );
}
 
export default CivilServiceEligibilty;