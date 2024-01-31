import "../styles/employee.css";
import { useState, useEffect, Fragment } from "react";
import Dialog from "./Dialog";
import { getUserByID, pushEmployeePersonalInfo } from "../../../util/Database";
import { personalInformation } from "../../../util/DataTemplate";
import { getCurrentUser, updateUserEmail } from "../../../util/Account";
import TextfieldFragment from "./TextfieldFragment";
import SelectFragment from "./SelectFragment";
import GroupedCheckBoxFragment from "./GroupedCheckBoxFragment";




const PersonalInformationForm = (props) => {
    const [otherInputCursor, setOtherInputCursor] = useState(false);
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({...personalInformation});
    const [systemMessage, setSystemMessage] = useState(null);
    const [systemOperation, setSystemOPeration] = useState(null);
    const [systemError, setSystemError] = useState('');
    const [promptUser, setPromptUser] = useState(null);


    function appendError(newError){
        setSystemError(systemError+"\n- "+newError);
    }




    useEffect(()=> {

        const fetchData = async () => {
            setSystemOPeration('Loading...');
            const response = await getUserByID(props.userID);
            if(response.isSuccess){
                setFormData(response.data.personalInformation);
                setSystemOPeration(null);
            }else{
                setSystemOPeration(null);
                appendError(response.message)
            }
        }

   fetchData();
      
   },[props.userID]);

 
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };


      useEffect(()=> {
        if(formData.civilstatus === 'other'){
            setOtherInputCursor(true);
        }else{
            setOtherInputCursor(false);
        }
      }, [formData.civilstatus]);


      const handleResidentialAddressChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          residentialAddress: {
            ...prevFormData.residentialAddress,
            [name]: value,
          },
        }));
      };


      const handlePermanentAddressChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          permanentAddress: {
            ...prevFormData.permanentAddress,
            [name]: value,
          },
        }));
      };


      const handleCitizenshipChange = (event) => {
        const { name, checked, type, value } = event.target;
        if (type === 'checkbox') {
            setFormData((prevFormData) => ({
              ...prevFormData,
              citizenship: {
                ...prevFormData.citizenship,
                [name]: checked
              },
            }));
        } else if(type === 'select-one') {
          setFormData((prevFormData) => ({

            ...prevFormData,
            citizenship: {
              ...prevFormData.citizenship,
              [name]: value,
            },
          }));
        }
      };


    useEffect(() => {
        // Fetch countries
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                let countries = [];
                for(let i = 0; i < data.length; i++){
                    countries.push({name: `${data[i].name.common}`, value: data[i].cca3})
                }
                countries.sort((a, b)=>{
                    return a.name.localeCompare(b.name);
                })
                setCountries(countries)
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, []);


    const save = async () => {
        setSystemOPeration('Saving...');
        try {
            await pushEmployeePersonalInfo(formData, props.userID);
            setSystemOPeration(null);
            setSystemMessage('Saved!');
        } catch (error) {
            setSystemOPeration(null);
            appendError(error.message);
            
        }
    };


    return (
        <Fragment>

            <div style={{width: '98%', height: '100%', position: 'relative'}}>
                <table>
                    <thead><tr><th>Personal Information</th></tr></thead>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode}  type='text' name='CSID No' placeholder='Do not fill up. For CSC use only.' varName='csidno' value={formData.csidno} onChange={handleInputChange}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} type='text' name='Surname' varName='surname' value={formData.surname} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} type='text' name='Firstname' varName='firstname' value={formData.firstname} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} type='text' name='Middlename' varName='middlename' value={formData.middlename} onChange={handleInputChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} type='text' name='Extension' varName='ext' value={formData.ext} onChange={handleInputChange}/>
                            </td>
                        </tr>
                    </tbody>
                </table>

                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='date' name='Date of Birth' varName='birthdate' value={formData.birthdate} onChange={handleInputChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectFragment name='Sex' varName='sex' value={formData.sex} onChange={handleInputChange} options={[{name: 'Male', value: 'Male'}, {name: 'Female', value: 'Female'}]}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <SelectFragment name='Civil Status' value={formData.civilstatus} onChange={handleInputChange} options={
                                            [
                                                {name: 'Single', value: 'Single'},
                                                {name: 'Married', value: 'Married'},
                                                {name: 'Widowed', value: 'Widowed'},
                                                {name: 'Separated', value: 'Separated'},
                                                {name: 'Other', value: 'Other'},
                                            ]
                                        }/>
                                        {(formData.civilstatus === 'Other') && 
                                            <TextfieldFragment disable={props.viewMode} type='text' name='Other' varName='other' value={formData.other} onChange={handleInputChange}/>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='number' name='Height (m)' varName='height' value={formData.height} onChange={handleInputChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='number' name='Weight (kg)' varName='weight' value={formData.weight} onChange={handleInputChange}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <TextfieldFragment disable={props.viewMode} type='text' name='Blood Type' varName='bloodtype' value={formData.bloodtype} onChange={handleInputChange}/>
                                    </td>
                                </tr>
                                
                            </tbody>
                        </table>
                    
                    <table>
                        <tbody>
                        <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='GSIS ID No' varName='gsisidno' value={formData.gsisidno} onChange={handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='PAG-IBIG No' varName='pagibigno' value={formData.pagibigno} onChange={handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='PHIL-HEALTH No' varName='philhealthno' value={formData.philhealthno} onChange={handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='SSS No' varName='sssno' value={formData.sssno} onChange={handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='TIN No' varName='tinno' value={formData.tinno} onChange={handleInputChange}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextfieldFragment disable={props.viewMode} type='text' name='Agency Employee No' varName='employeeno' value={formData.employeeno} onChange={handleInputChange}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} type='text' name='Place of Birth' varName='birthplace'  value={formData.birthplace} onChange={handleInputChange}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <GroupedCheckBoxFragment name='Citizenship' options={
                                    [
                                        {name: 'Filipino', value: formData.citizenship.isFilipino, varName: 'isFilipino', onChange: (e)=>{handleCitizenshipChange(e);}},
                                        {name: 'Dual Citizenship', value: formData.citizenship.hasDualCitizenship, varName: 'hasDualCitizenship', onChange: (e)=>{handleCitizenshipChange(e)}}
                                    ]
                                }/>
                            </td>
                        </tr>
                        { formData.citizenship.hasDualCitizenship === true && (
                            <tr>
                                <td>
                                    <GroupedCheckBoxFragment name='If holder of Dual Citizenship' options={
                                        [
                                            {name: 'By Birth', value: formData.citizenship.byBirth, varName: 'byBirth', onChange: (e)=>{handleCitizenshipChange(e);}},
                                            {name: 'By Naturalization', value: formData.citizenship.byNaturalization, varName: 'byNaturalization', onChange: (e)=>{handleCitizenshipChange(e)}}
                                        ]
                                    }/>

                                    <SelectFragment name="Select a Country" varName='specifiedCountry' options={countries} onChange={(e)=> {handleCitizenshipChange(e);}}/>

                                </td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Residential Address</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='House/Block/Lot No' varName={'house'} value={formData.residentialAddress.house} onChange={(e)=> {handleResidentialAddressChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Street' varName={'street'} value={formData.residentialAddress.street} onChange={(e)=> {handleResidentialAddressChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Subdivision' varName={'subdivision'} value={formData.residentialAddress.subdivision} onChange={(e)=> {handleResidentialAddressChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Barangay' varName={'barangay'} value={formData.residentialAddress.barangay} onChange={(e)=> {handleResidentialAddressChange(e)}}/>
                            </td>
                        
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Zipcode' varName={'postalCode'} value={formData.residentialAddress.postalCode} onChange={(e)=> {handleResidentialAddressChange(e)}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                        <tr>
                            <th>Permanent Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='House/Block/Lot No' varName={'house'} value={formData.permanentAddress.house} onChange={(e)=> {handlePermanentAddressChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Street' varName={'street'} value={formData.permanentAddress.street} onChange={(e)=> {handlePermanentAddressChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Subdivision' varName={'subdivision'} value={formData.permanentAddress.subdivision} onChange={(e)=> {handlePermanentAddressChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Barangay' varName={'barangay'} value={formData.permanentAddress.barangay} onChange={(e)=> {handlePermanentAddressChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Zipcode' varName={'postalCode'} value={formData.permanentAddress.postalCode} onChange={(e)=> {handlePermanentAddressChange(e)}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Telephone No' varName='telno' value={formData.telno} onChange={(e)=>{handleInputChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Mobile No' varName='mobileno' value={formData.mobileno} onChange={(e)=>{handleInputChange(e)}}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <TextfieldFragment disable={props.viewMode} name='Email' varName='email' value={formData.email} onChange={(e)=>{handleInputChange(e)}}/>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {!props.viewMode && 
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                    <button style={{ marginBottom: '5px'}} onClick={save}>Save</button>
                </div>
                }
                
            </div> 

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
 
export default PersonalInformationForm ;