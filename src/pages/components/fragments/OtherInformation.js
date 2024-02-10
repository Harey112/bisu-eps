import { Fragment, useState, useEffect } from "react";
import Dialog from "./Dialog";
import { otherInformation } from "../../../util/DataTemplate";
import TextfieldFragment from "./TextfieldFragment";
import editPencil from '../../../images/edit_pencil.png';
import deleteIcon from '../../../images/delete-user.png';
import { getUserByID, pushOtherInformationInfo } from "../../../util/Database";
import SelectFragment from "./SelectFragment";

const OtherInformation = (props) => {
    const [formData, setFormData] = useState({...otherInformation});
    const [displayAddForm, setDisplayAddForm] = useState(false);
    const [displayEdiForm, setDisplayEditForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);
    const [editData, setEditData] = useState();
    const dummy = {
        category: '',
        data: ''
    }
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
            [name]: value
        }));
    };



    //Display Errors
    function appendError(newError){
        setSystemError(systemError+"\n- "+newError);
    }


    function addNewData(){

        console.log(newData)

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
                
                setFormData(prevFormData => ({
                    ...prevFormData,
                    [newData.category]:[...prevFormData[newData.category], newData.data]
                }));
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

          if (!hasEmpty) {
            try {
                setFormData(prevFormData => ({
                ...prevFormData,
                    [editData.category]: (() => {
                        let array = [...prevFormData[editData.category]];  // Make a copy of the array
                        array[editData.index] = editData.data;
                        return array;
                    })(),
                }));

            } catch (error) {
                appendError(error.message);
            }
        }
    }



    function deleteData(category,indexToDel) {
        try {
            setFormData(prevFormData =>({...prevFormData, [category] : prevFormData[category].filter((value, index)=>index !== indexToDel )}))
            
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
                let data = response.data.otherInformation;
                setFormData((data.specialSkills === undefined || data.recognitions === undefined || data.associations === undefined)? otherInformation : data);
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
        await pushOtherInformationInfo(formData, props.userID);
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
                            <th>Other Information</th>
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
                <table>
                    <thead>
                        <tr>
                        {!props.viewMode && 
                                <th style={{fontSize: 'medium'}}>Action</th>
                            }
                            <th>Special Skills and Hobbies</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.specialSkills.length > 0 && (
                            formData.specialSkills.map((data, index)=>(
                                <tr key={index}>
                                    {!props.viewMode &&
                                        <td>
                                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                                                <img src={editPencil} alt="Delete" onClick={()=> {setEditData({category: 'specialSkills', data: data, index: index}); setDisplayEditForm(true)}} style={{width: '20px', height: '20px'}}/>
                                                <img src={deleteIcon} alt="Delete" onClick={()=> {setPromptUser({
                                                    title: 'Confirm?',
                                                    message: `Do you want to delete data?`,
                                                    negativeButton: {label: 'Cancel', action: ()=> {setPromptUser(null)}},
                                                    positiveButton: {label: 'Yes', action: ()=>{setPromptUser(null); deleteData('specialSkills',index)}}
                                                })}} style={{width: '20px', height: '20px'}}/>

                                            </div>
                                        </td>
                                        }
                                    <td>{data}</td>
                                </tr>
                            ))

                        )}
                    </tbody>
                </table>
                {!formData.specialSkills.length > 0 && 
                            <p>No Data Yet.</p>
                     }
                <table>
                    <thead>
                        <tr>
                        {!props.viewMode && 
                                <th style={{fontSize: 'medium'}}>Action</th>
                            }
                            <th>Non-Academic Distinctions / Recognition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.recognitions.length > 0 && (
                            formData.recognitions.map((data, index)=>(
                                <tr key={index}>
                                    {!props.viewMode &&
                                        <td>
                                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                                                <img src={editPencil} alt="Delete" onClick={()=> {setEditData({category: 'recognitions', data: data, index: index}); setDisplayEditForm(true)}} style={{width: '20px', height: '20px'}}/>
                                                <img src={deleteIcon} alt="Delete" onClick={()=> {setPromptUser({
                                                    title: 'Confirm?',
                                                    message: `Do you want to delete data?`,
                                                    negativeButton: {label: 'Cancel', action: ()=> {setPromptUser(null)}},
                                                    positiveButton: {label: 'Yes', action: ()=>{setPromptUser(null); deleteData('recognitions', index)}}
                                                })}} style={{width: '20px', height: '20px'}}/>

                                            </div>
                                        </td>
                                        }
                                    <td>{data}</td>
                                </tr>
                            ))

                        )}
                       
                    </tbody>
                </table>
                {!formData.recognitions.length > 0 && 
                            <p>No Data Yet.</p>
                     }
                <table>
                    <thead>
                        <tr>
                        {!props.viewMode && 
                                <th style={{fontSize: 'medium'}}>Action</th>
                            }
                            <th>Membership in Association / Organization</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.associations.length > 0 && (
                            formData.associations.map((data, index)=>(
                                <tr key={index}>
                                    {!props.viewMode &&
                                        <td>
                                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                                                <img src={editPencil} alt="Delete" onClick={()=> {setEditData({category: 'associations', data: data, index: index}); setDisplayEditForm(true)}} style={{width: '20px', height: '20px'}}/>
                                                <img src={deleteIcon} alt="Delete" onClick={()=> {setPromptUser({
                                                    title: 'Confirm?',
                                                    message: `Do you want to delete data?`,
                                                    negativeButton: {label: 'Cancel', action: ()=> {setPromptUser(null)}},
                                                    positiveButton: {label: 'Yes', action: ()=>{setPromptUser(null); deleteData('associations',index)}}
                                                })}} style={{width: '20px', height: '20px'}}/>

                                            </div>
                                        </td>
                                        }
                                    <td>{data}</td>
                                </tr>
                            ))

                        )}
                        
                    </tbody>
                </table>
                {!formData.associations.length > 0 && 
                            <p>No Data Yet.</p>
                     }
                
            </div>

            { displayAddForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                        <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>New Data</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <SelectFragment disable={props.viewMode} type='text' name='Category' varName='category' value={newData.category} onChange={(e)=> {handleNewDataChange(e)}} options={[
                                            {name: 'Special Skills and Hobbies', value: 'specialSkills'},
                                            {name: 'Non-Academic Distinctions / Recognition', value: 'recognitions'},
                                            {name: 'Membership in Association / Organization', value: 'associations'},
                                        ]}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Info' varName='data' value={newData.data} onChange={(e)=> {handleNewDataChange(e)}}/>
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
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Info' varName='data' value={editData.data} onChange={(e)=> {handleEditDataChange(e)}}/>
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
 
export default OtherInformation;