import "../styles/employee.css";
import { useState, useEffect } from "react";
import { getUserByID, pushEmployeePersonalInfo } from "../../../util/Database";
import { personalInformation } from "../../../util/DataTemplate";
import { getCurrentUser, updateUserEmail } from "../../../util/Account";
import TextfieldFragment from "./TextfieldFragment";




const PersonalInformationForm = ({addError, userID, viewMode}) => {
    const [otherInputCursor, setOtherInputCursor] = useState(false);
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({...personalInformation});


    useEffect(()=> {
      const fetchData = async () => {
      const response = await getUserByID(userID);
      setFormData(response.data.personalInformation);
      }

   fetchData();
      
   },[userID]);

 
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };


      useEffect(()=> {
        console.log("Civil Status Change.");
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
          console.log(value);
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
                setCountries(data);
            })
            .catch(error => console.error('Error fetching countries:', error));
    }, []);


    const savePersonalInfo = async () => {
      pushEmployeePersonalInfo(formData, userID);
      if(!viewMode && userID === getCurrentUser().then((user) => { return user.uid})){
        try{
            await updateUserEmail(formData.email);
        }catch(error){

            console.error(error);
        }
      }
    };



    return (

        <div style={{width: '-webkit-fill-available'}}>

        <form style={{position: 'relative', width: '-webkit-fill-available', height: 'auto', overflowY: 'auto', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>

          {formData &&
          <>
            {/*Personal Info */}
           <table>
            <tbody>
                <tr>
                    <td>
                        <TextfieldFragment type='text' name='Surname' value={formData.surname} onChange={handleInputChange} required={true}/>
                    </td>
                    <td>
                        <TextfieldFragment type='text' name='Firstname' value={formData.firstname} onChange={handleInputChange} required={true}/>
                    </td>
                    <td>
                        <TextfieldFragment type='text' name='Firstname' value={formData.firstname} onChange={handleInputChange} required={true}/>
                    </td>
                </tr>
            </tbody>
           </table>
           <div style={{ margin: '10px 0 10px 0', height: 'auto', width: '98%', display: 'flex', flexFlow: 'row', borderStyle: 'solid', borderWidth: '1px', borderColor: 'var(--global-primary-color)' }}>
               <div style={{ width: '50%', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)' }}>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">Date of Birth: </p>
                       <input type="date" id="birthdate" name="birthdate" className="personal_data-input" onChange={handleInputChange} value={formData.birthdate}/></div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">Place of Birth: </p>
                       <input type="text" id="birthplace" name="birthplace" className="personal_data-input" onChange={handleInputChange} value={formData.birthplace}/>
                   </div>

                   {/*Sex */}
                   <div className="personal_data-input-div">
                       <p className="personal_data-label" >Sex: </p>
                       <div style={{ width: '-webkit-fill-available', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                           <div className="radio_selection">
                               <input type="radio" name="sex" id="male" value="male" className="personal_data-input-radio" onChange={handleInputChange} checked={formData.sex === 'male'}/>
                               <p className="personal_data-label">Male</p>
                           </div>
                           <div className="radio_selection">
                               <input type="radio" name="sex" id="female" value='female' className="personal_data-input-radio" onChange={handleInputChange} checked={formData.sex === 'female'}/>
                               <p className="personal_data-label">Female</p>
                           </div>
                       </div>
                   </div>

                   {/*Civil Status*/}
                   <div className="personal_data-input-div" style={{ height: '120px', width: 'auto' }}>
                       <p className="personal_data-label">Civil Status: </p>
                       <div id="civilstats" style={{ width: '-webkit-fill-available' }}>
                           <div style={{ margin: '2px 0 0 0', width: '-webkit-fill-available', height: '60px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap' }}>
                               <div className="radio_selection">
                                   <input type="radio" name="civilstatus" value="single" className="personal_data-input-radio" onChange={handleInputChange} checked={formData.civilstatus === "single" }/>
                                   <p className="personal_data-label">Single</p>
                               </div>

                               <div className="radio_selection">
                                   <input type="radio" name="civilstatus" value='married' className="personal_data-input-radio" onChange={handleInputChange} checked={formData.civilstatus === "married" }/>
                                   <p className="personal_data-label">Married</p>
                               </div>

                               <div className="radio_selection">
                                   <input type="radio" name="civilstatus" value='widowed' className="personal_data-input-radio" onChange={handleInputChange} checked={formData.civilstatus === "widowed" }/>
                                   <p className="personal_data-label">Widowed</p>
                               </div>

                           </div>
                           <div style={{ width: '-webkit-fill-available', height: '60px', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                               <div className="radio_selection" style={{ width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                   <input type="radio" name="civilstatus" value="separated" className="personal_data-input-radio" onChange={handleInputChange} checked={formData.civilstatus === "separated" }/>
                                   <p className="personal_data-label">Separated</p>
                               </div>

                               <div className="radio_selection" style={{ width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                                   <input type="radio" name="civilstatus" value="other" className="personal_data-input-radio" onChange={handleInputChange} checked={formData.civilstatus === "other" }/>
                                   <p className="personal_data-label">Other:</p>
                                   { otherInputCursor &&
                                   <input type="text" name="other" style={{ height: '30px', width: '130px', margin: '0'}} onChange={handleInputChange} value={formData.other} placeholder="Please Specify"/>
                                   }
                               </div>

                           </div>
                       </div>
                   </div>

                   {/*Other Info*/}
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">Height(m): </p>
                       <input type="text" name="height" className="personal_data-input" onChange={handleInputChange} value={formData.height}/>
                   </div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">Weight(kg): </p>
                       <input type="text" name="weight" className="personal_data-input" onChange={handleInputChange} value={formData.weight}/>
                   </div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">Blood Type: </p>
                       <input type="text" name="bloodtype" className="personal_data-input" onChange={handleInputChange} value={formData.bloodtype}/>
                   </div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">GSIS NO. : </p>
                       <input type="text" name="gsisNo" className="personal_data-input" onChange={handleInputChange} value={formData.gsisNo}/>
                   </div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">PAG-IBIG NO. : </p>
                       <input type="text" name="pagibigNo" className="personal_data-input" onChange={handleInputChange} value={formData.pagibigNo}/>
                   </div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">PHILHEALTH NO. :  </p>
                       <input type="text" name="philhealthNo" className="personal_data-input" onChange={handleInputChange} value={formData.philhealthNo}/>
                   </div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">SSS NO. : </p>
                       <input type="text" name="sssNo" className="personal_data-input" onChange={handleInputChange} value={formData.sssNo}/></div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">TIN NO. : </p>
                       <input type="text" name="tinNo" className="personal_data-input" onChange={handleInputChange} value={formData.tinNo}/>
                   </div>
                   <div className="personal_data-input-div">
                       <p className="personal_data-label">Agency Employee No. : </p>
                       <input type="text" name="employeeNo" className="personal_data-input" onChange={handleInputChange} value={formData.employeeNo} />
                   </div>
                   <div className="personal_data-input-div" style={{borderWidth: '0 0 0 0'}}>
                       <p className="personal_data-label">CS ID No. : </p>
                       <input type="text" name="csidNo" className="personal_data-input" placeholder=" (Do not fill u/p. For CSC use only)"onChange={handleInputChange} value={formData.csidNo}/>
                   </div>

               </div>

               <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
               <div className="personal_data-input-div">
                     <p className="personal_data-label">Citizenship: </p>
                     <div style={{ height: '100%', width: '-webkit-fill-available', display: 'flex', flexFlow: 'wrap', justifyContent: 'space-evenly', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                       <div style={{ width: '50%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                         <input className="checkbox" type="checkbox" name="isFilipino" onChange={handleCitizenshipChange} checked={formData.citizenship.isFilipino}/>
                         <p className="personal_data-label">Filipino</p>
                       </div>
                       <div style={{ width: '50%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                         <input className="checkbox" type="checkbox" name="hasDualCitizenship" onChange={handleCitizenshipChange} checked={formData.citizenship.hasDualCitizenship}/>
                         <p className="personal_data-label">Dual Citizenship</p>
                       </div>
                     </div>
                   </div>
                                 
                                 
                       <div className="personal_data-input-div">
                         <p className="personal_data-label">If holder of <br /> dual citizenship: </p>
                         <div style={{ height: '60px', width: '-webkit-fill-available', display: 'flex', flexFlow: 'wrap', justifyContent: 'space-evenly', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                           <div style={{ width: '50%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                             <input className="checkbox" type="checkbox" name="byBirth" onChange={handleCitizenshipChange} checked={formData.citizenship.byBirth}/>
                             <p className="personal_data-label">By Birth</p>
                           </div>
                           <div style={{ width: '50%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                             <input className="checkbox" type="checkbox" name="byNaturalization" onChange={handleCitizenshipChange} checked={formData.citizenship.byNaturalization}/>
                             <p className="personal_data-label">By Naturalization</p>
                           </div>
                         </div>
                       </div>
                                 
                       <div className="personal_data-input-div">
                         <p className="personal_data-label">Specify Country:</p>
                         <div style={{ height: '100%', width: '-webkit-fill-available', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center' }}>
                           <select name="specifiedCountry" onChange={handleCitizenshipChange} className="custom_select" >
                             <option value="">Select a country</option>
                             {countries.map(country => (
                               <option key={country.cca3} value={country.cca3}>{country.name.common}</option>
                             ))}
                           </select>
                         </div>
                       </div>

               <div className="info_title">Residential Address</div>
                   <div className="personal_data-input-div" style={{borderWidth: '1px 0 1px 0', height: '60px'}}>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)'}}>
                           <p className="personal_data-label" style={{height: '15px'}} > House/Block/Lot No </p>
                           <input type="text" name="house" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="House/Block/Lot No" onChange={handleResidentialAddressChange} value={formData.residentialAddress.house}/>
                       </div>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
                           <p className="personal_data-label" style={{height: '15px'}}> Street </p>
                           <input type="text" name="street" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Street" onChange={handleResidentialAddressChange} value={formData.residentialAddress.street}/>
                       </div>
                            
                   </div>
                   <div className="personal_data-input-div">
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)'}}>
                           <p className="personal_data-label" style={{height: '15px'}} > Subdivision/Village </p>
                           <input type="text" name="subdivision" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Subdivision/Village" onChange={handleResidentialAddressChange} value={formData.residentialAddress.subdivision}/>
                       </div>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
                           <p className="personal_data-label" style={{height: '15px'}}>Barangay</p>
                           <input type="text" name="barangay" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Barangay" onChange={handleResidentialAddressChange} value={formData.residentialAddress.barangay}/>
                       </div>
                            
                   </div>
                   <div className="personal_data-input-div" >
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)'}}>
                           <p className="personal_data-label" style={{height: '15px'}} > City </p>
                           <input type="text" name="city" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="City" onChange={handleResidentialAddressChange} value={formData.residentialAddress.city}/>
                       </div>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
                           <p className="personal_data-label" style={{height: '15px'}}>Province</p>
                           <input type="text" name="province" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Province" onChange={handleResidentialAddressChange} value={formData.residentialAddress.province}/>
                       </div>
                            
                   </div>
                   <div className="personal_data-input-div" style={{height: '60px'}}>
                       <p className="personal_data-label">Postal Code : </p>
                       <input type="text" name="postalCode" className="personal_data-input" onChange={handleResidentialAddressChange} value={formData.residentialAddress.postalCode}/>
                   </div>

                   <div className="info_title" style={{marginBottom: '9px'}}>Permanent Address</div>

                   <div className="personal_data-input-div" style={{borderWidth: '1px 0 1px 0', height: '61px'}}>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)'}}>
                           <p className="personal_data-label" style={{height: '15px'}} > House/Block/Lot No </p>
                           <input type="text" name="house" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="House/Block/Lot No" onChange={handlePermanentAddressChange} value={formData.permanentAddress.house}/>
                       </div>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
                           <p className="personal_data-label" style={{height: '15px'}}> Street </p>
                           <input type="text" name="street" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Street" onChange={handlePermanentAddressChange} value={formData.permanentAddress.street}/>
                       </div>
                            
                   </div>
                   <div className="personal_data-input-div">
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)'}}>
                           <p className="personal_data-label" style={{height: '15px'}} > Subdivision/Village </p>
                           <input type="text" name="subdivision" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Subdivision/Village" onChange={handlePermanentAddressChange} value={formData.permanentAddress.subdivision}/>
                       </div>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
                           <p className="personal_data-label" style={{height: '15px'}}>Barangay</p>
                           <input type="text" name="barangay" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Barangay" onChange={handlePermanentAddressChange} value={formData.permanentAddress.barangay}/>
                       </div>
                            
                   </div>
                   <div className="personal_data-input-div"  >
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)'}}>
                           <p className="personal_data-label" style={{height: '15px'}} > City </p>
                           <input type="text" name="city" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="City" onChange={handlePermanentAddressChange} value={formData.permanentAddress.city}/>
                       </div>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }}>
                           <p className="personal_data-label" style={{height: '15px'}}>Province</p>
                           <input type="text" name="province" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Province" onChange={handlePermanentAddressChange} value={formData.permanentAddress.province}/>
                       </div>
                            
                   </div>
                   <div className="personal_data-input-div" style={{height: '59px'}}>
                       <p className="personal_data-label">Postal Code : </p>
                       <input type="text" name="postalCode" className="personal_data-input" onChange={handlePermanentAddressChange} value={formData.permanentAddress.postalCode}/>
                   </div>
                   <div className="personal_data-input-div" style={{borderWidth: '0 0 0 0'}} >
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', borderStyle: 'none solid none none', borderWidth: '0 1px 0 0', borderColor: 'var(--global-primary-color)'}}>
                           <p className="personal_data-label" style={{height: '15px'}} > Telephone No. </p>
                           <input type="text" name="telNo" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Telephone No." onChange={handleInputChange} value={formData.telNo}/>
                       </div>
                       <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center' }} >
                           <p className="personal_data-label" style={{height: '15px'}}>Mobile No.</p>
                           <input type="text" name="mobileNo" className="personal_data-input" style={{height: '45px', textAlign: 'center'}} placeholder="Mobile No." onChange={handleInputChange} value={formData.mobileNo}/>
                       </div>
                            
                   </div>
                   <div className="personal_data-input-div" style={{borderWidth: '1px 0 0 0'}}>
                       <p className="personal_data-label"> Email Address (if any):  </p>
                       <input type="text" name="email" className="personal_data-input" autoComplete="email" onChange={handleInputChange} value={formData.email}/>
                   </div>
               </div>   
           </div>
           
          </>
                   }

            {!viewMode &&

            <div style={{width: '100%', alignItems: 'start', display: 'flex', justifyContent: 'end'}}>
            <button type="button" onClick={savePersonalInfo} style={{margin: '0 15px 0 0'}}>Save</button>         
            </div>
            }

            {viewMode &&
            <div style={{position: 'absolute',height: '-webkit-fill-available', width: '100%', backgroundColor: 'transparent'}}></div>

            }
         
       </form>


        </div>           


     );
}
 
export default PersonalInformationForm ;