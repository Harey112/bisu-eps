import { Fragment, useState, useEffect } from "react";
import TextfieldFragment from "./TextfieldFragment";
import Dialog from "./Dialog";
import { familyBackground } from "../../../util/DataTemplate";
import { getUserByID, pushFamilyBackgroundInfo } from "../../../util/Database";
import editPencil from '../../../images/edit_pencil.png';
import deleteIcon from '../../../images/delete-user.png';

const FamilyBackgroundForm = (props) => {
    const [formData, setFormData] = useState({...familyBackground});
    const [displayAddChildForm, setDisplayAddChildForm] = useState(false);
    const [displayEdiChildForm, setDisplayEditForm] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);
    const [editChildData, setEditChildData] = useState();
    const childDummy = {fullname: '', birthdate: ''};
    const [newChildData, setNewChildData] = useState({...childDummy});


    function appendError(newError){
        setSystemError(systemError+"\n- "+newError);
    }


    function handleNewChildDataChange(event){
        const { name, value } = event.target;
        setNewChildData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };


    function handleEditChildDataChange(event){
        const { name, value } = event.target;
        setEditChildData((preveditChildData) => ({
          ...preveditChildData,
          data: {
                ...preveditChildData.data,
                [name]: value
          }
        }));
    };



    function addNewChildData(){

        let hasEmpty = false;
        
        for (const key in newChildData) {
            if (newChildData.hasOwnProperty(key)) {
              if (newChildData[key] === '' || newChildData[key] === undefined) {
                hasEmpty = true;
              }
            }
          }

        if(!hasEmpty){

            try {
                let data = [...formData.children, { ...newChildData }];
                data.sort((a, b) => new Date(a.birthdate) - new Date(b.birthdate));
          
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  children: data,
                }));
          
                setNewChildData(childDummy);
              } catch (error) {
                appendError(error.message);
                console.error(error);
              }
        
        }else{
            setSystemMessage('Fill all input.');
        }
    }




    function saveEditChildData(){

        let hasEmpty = false;
        
        for (const key in editChildData.data) {
            if (editChildData.data.hasOwnProperty(key)) {
              if (editChildData.data[key] === '' || editChildData.data[key] === undefined) {
                hasEmpty = true;
              }
            }
          }

        if(!hasEmpty){
            try {
                setFormData((prevFormData) => {
                    const newArray = [...prevFormData.children];
                    newArray[editChildData.index] = { ...editChildData.data };
                    newArray.sort((a, b) => new Date(a.birthdate) - new Date(b.birthdate));
            
                    return {
                        ...prevFormData,
                        children: newArray,
                    };
                });
              } catch (error) {
                appendError(error.message);
              }
        }
    }


    function deleteChildData(indexToDel) {
        try {
            setFormData(prevFormData => ({
                ...prevFormData,
                children: prevFormData.children.filter((value, index)=>index !== indexToDel )
            }))
            
        } catch (error) {
            appendError(error.message)
        }
        
    }




    useEffect(()=> {

        const fetchData = async () => {
            setSystemOPeration('Loading...');
            const response = await getUserByID(props.userID);
            if(response.isSuccess){
                setFormData(response.data.familyBackground);
                setSystemOPeration(null);
            }else{
                setSystemOPeration(null);
                appendError(response.message)
            }
        }

   fetchData();
      
   },[props.userID]);


   const handleFamilyInfoChange = (event, who) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [who]: {
        ...prevFormData[who],
        [name]: value,
      },
    }));
  };
  

      const save = async () => {
        setSystemOPeration('Saving...');
        try {
            await pushFamilyBackgroundInfo(formData, props.userID);
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
                            <th>Family Background</th>
                        </tr>
                    </thead>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Spouse's Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Surname' varName='surname' value={formData.spouse.surname} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Firstname' varName='firstname' value={formData.spouse.firstname} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Middlename' varName='middlename' value={formData.spouse.middlename} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Extension' varName='ext' value={formData.spouse.ext} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Occupation' varName='occupation' value={formData.spouse.occupation} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Employer/Business Name' varName='businessName' value={formData.spouse.businessName} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Business Address' varName='businessAddress' value={formData.spouse.businessAddress} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Telephone No' varName='telno' value={formData.spouse.telno} onChange={(e) => {handleFamilyInfoChange(e, 'spouse')}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Father's Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Surname' varName='surname' value={formData.father.surname} onChange={(e) => {handleFamilyInfoChange(e, 'father')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Firstname' varName='firstname' value={formData.father.firstname} onChange={(e) => {handleFamilyInfoChange(e, 'father')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Middlename' varName='middlename' value={formData.father.middlename} onChange={(e) => {handleFamilyInfoChange(e, 'father')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Extension' varName='ext' value={formData.father.ext} onChange={(e) => {handleFamilyInfoChange(e, 'father')}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Mother's Maiden Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Surname' varName='surname' value={formData.mother.surname} onChange={(e) => {handleFamilyInfoChange(e, 'mother')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Firstname' varName='firstname' value={formData.mother.firstname} onChange={(e) => {handleFamilyInfoChange(e, 'mother')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Middlename' varName='middlename' value={formData.mother.middlename} onChange={(e) => {handleFamilyInfoChange(e, 'mother')}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment  type='text' name='Extension' varName='ext' value={formData.mother.ext} onChange={(e) => {handleFamilyInfoChange(e, 'mother')}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {!props.viewMode &&
                    <p style={{margin: '10px 0 0 0'}}>Actions: <img src={editPencil} alt="Edit"  style={{width: '15px', height: '15px'}} /> - Edit | <img src={deleteIcon} alt="Delete" style={{width: '15px', height: '15px'}}/> - Delete</p>
                }
                <table>
                    <thead>
                        <tr>
                            {!props.viewMode && 
                                <th style={{fontSize: 'medium'}}>Action</th>
                            }
                            <th>Name of Children</th>
                            <th>Date of Birth</th>
                        </tr>
                    </thead>
                    <tbody>
                    { formData.children.length > 0 && (
                        formData.children.map((data, index)=>(
                            <tr key={index}>
                                {!props.viewMode &&
                                <td>
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-around'}}>
                                        <img src={editPencil} alt="Delete" onClick={()=> {setEditChildData({data: data, index: index}); setDisplayEditForm(true)}} style={{width: '20px', height: '20px'}}/>
                                        <img src={deleteIcon} alt="Delete" onClick={()=> {setPromptUser({
                                            title: 'Confirm?',
                                            message: `Do you want to delete data?`,
                                            negativeButton: {label: 'Cancel', action: ()=> {setPromptUser(null)}},
                                            positiveButton: {label: 'Yes', action: ()=>{setPromptUser(null); deleteChildData(index)}}
                                        })}} style={{width: '20px', height: '20px'}}/>
                                    </div>
                                </td>
                                }
                                <td>{data.fullname}</td>
                                <td>{data.birthdate}</td>
                            </tr>
                        )))
                    }
                    </tbody>
                </table>
                {(!formData.children.length > 0) && 
                                <p style={{margin: '10px 0'}}>No Data Yet.</p>
                            }
                {!props.viewMode && 
                    <div style={{width: '100%'}}>
                        <button style={{ marginBottom: '5px'}} onClick={(e)=>{setDisplayAddChildForm(true)}}>Add Child</button>
                    </div>
                }
                {!props.viewMode && 
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <button style={{ marginBottom: '5px'}} onClick={save}>Save</button>
                    </div>
                }
            </div>

            {displayAddChildForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                    <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>New Child</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextfieldFragment  type='text' name='Fullname' varName='fullname' value={newChildData.fullname} onChange={(e)=>{handleNewChildDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment  type='date' name='Date of Birth' varName='birthdate' value={newChildData.birthdate} onChange={(e)=>{handleNewChildDataChange(e)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={()=>{setDisplayAddChildForm(false)}} style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}}>Close</button>
                            <button onClick={addNewChildData}>Add</button>
                        </div>
                    </div>
                </div>
                }

                {displayEdiChildForm && 
                <div className="dialog_div" style={{position: 'fixed'}}>
                    <div className="dialog_prompt">
                    <p style={{margin: '10px 0 10px 0', fontSize: 'large', fontWeight: '700'}}>Edit Child</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextfieldFragment  type='text' name='Fullname' varName='fullname' value={editChildData.data.fullname} onChange={(e)=>{handleEditChildDataChange(e)}}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment  type='date' name='Date of Birth' varName='birthdate' value={editChildData.data.birthdate} onChange={(e)=>{handleEditChildDataChange(e)}}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={()=>{setEditChildData(childDummy); setDisplayEditForm(false)}} style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}}>Close</button>
                            <button onClick={()=>{saveEditChildData(); setEditChildData(childDummy); setDisplayEditForm(false)}}>Save</button>
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
 
export default FamilyBackgroundForm;