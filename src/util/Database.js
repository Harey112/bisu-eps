import { myFirebase } from "../firebase";
import { collection, doc, getDoc, getDocs, getFirestore , setDoc} from 'firebase/firestore';
import { userData } from "./DataTemplate";

const db = getFirestore(myFirebase);




async function getUserByID(id) {

  let userDataClone = {...userData};
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
      const userData = await getDocs(collection(db, 'Employee',id, 'User_Data'));
      
      for(const data of userData.docs){
        switch(data.id){
          case "Personal_Information":
            
            userDataClone.personalInformation = data.data();
            break;

          case "Current_Employment_Information":
            userDataClone.employmentInformation = data.data();
            break;

          case "Family_Background":
            userDataClone.familyBackground = data.data();
            break;

          case "Educational_Background":
            userDataClone.educationalBackground = data.data();
            break;

          case "Civil_Service_Eligibilty":
            userDataClone.civilServiceEligibilty = data.data();
            break;

          case "Work_Experience":
            userDataClone.workExperience = data.data();
            break;

          case "Work_Experience":
            userDataClone.workExperience = data.data();
            break;
            
          case "Voluntary_Work":
            userDataClone.voluntaryWork = data.data();
            break;

          case "Learning_Program_Attended":
            userDataClone.learningProgramAttended = data.data();
            break;
          case "Other_Information":
            userDataClone.otherInformation = data.data();
            break;
            
          default:

        }
      }
      return { isSuccess: true, data: userDataClone, message: 'Successfully Retrived.' };
    } catch (error) {
        console.error(error);
        return { isSuccess: false, data: null, message: error.message };
  }
}


async function pushEmployeePersonalInfo(personalData, docID) {
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    await setDoc(doc(db, "Employee", docID), {});
    await setDoc(doc(db, "Employee", docID, "User_Data", "Personal_Information"), personalData);
    return { isSuccess: true, message: "Updated successfully!" };
  } catch (error) {
    console.error(error);
    return { isSuccess: false, message: error.message };
  }
  
}


async function pushFamilyBackgroundInfo(employeeData, docID) {
   try {
    if (!navigator.onLine) throw new Error('No internet connection');
    await setDoc(doc(db, "Employee", docID), {});
    await setDoc(doc(db, "Employee", docID, "User_Data", "Family_Background"), employeeData);
    return { isSuccess: true, message: "Updated successfully!" };
  } catch (error) {
    console.error(error);
    return { isSuccess: false, message: error.message };
  }

}


async function pushEducationalBackgroundInfo(educationalBackground, docID) {
  try {
   if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Employee", docID), {});
   await setDoc(doc(db, "Employee", docID, "User_Data", "Educational_Background"), educationalBackground);
   return { isSuccess: true, message: "Updated successfully!" };
 } catch (error) {
   console.error(error);
   return { isSuccess: false, message: error.message };
 }

}


async function pushCivilServiceInfo(civilServiceEligibilty, docID) {
  try {
   if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Employee", docID), {});
   await setDoc(doc(db, "Employee", docID, "User_Data", "Civil_Service_Eligibilty"), civilServiceEligibilty);
   return { isSuccess: true, message: "Updated successfully!" };
 } catch (error) {
   console.error(error);
   return { isSuccess: false, message: error.message };
 }

}


async function pushWorkExperienceInfo(workExperience, docID) {
  try {
   if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Employee", docID), {});
   await setDoc(doc(db, "Employee", docID, "User_Data", "Work_Experience"), workExperience);
   return { isSuccess: true, message: "Updated successfully!" };
 } catch (error) {
   console.error(error);
   return { isSuccess: false, message: error.message };
 }

}


async function pushVoluntaryWorkInfo(voluntaryWork, docID) {
  try {
   if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Employee", docID), {});
   await setDoc(doc(db, "Employee", docID, "User_Data", "Voluntary_Work"), voluntaryWork);
   return { isSuccess: true, message: "Updated successfully!" };
 } catch (error) {
   console.error(error);
   return { isSuccess: false, message: error.message };
 }

}


async function pushLearingProgramAttendedInfo(learningProgramAttended, docID) {
  try {
   if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Employee", docID), {});
   await setDoc(doc(db, "Employee", docID, "User_Data", "Learning_Program_Attended"), learningProgramAttended);
   return { isSuccess: true, message: "Updated successfully!" };
 } catch (error) {
   console.error(error);
   return { isSuccess: false, message: error.message };
 }

}


async function pushOtherInformationInfo(otherInformation, docID) {
  try {
   if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Employee", docID), {});
   await setDoc(doc(db, "Employee", docID, "User_Data", "Other_Information"), otherInformation);
   return { isSuccess: true, message: "Updated successfully!" };
 } catch (error) {
   console.error(error);
   return { isSuccess: false, message: error.message };
 }

}


async function pushEmployeeInfo(familyBackground, docID) {
  try {
   if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Employee", docID), {});
   await setDoc(doc(db, "Employee", docID, "User_Data", "Current_Employment_Information"), familyBackground);
   return { isSuccess: true, message: "Updated successfully!" };
 } catch (error) {
   console.error(error);
   return { isSuccess: false, message: error.message };
 }

}


async function addDepartment(name, description) {
  const departmentID = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');

  try {
  if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Department", departmentID),{name: name, departmentID: departmentID, description: description});

   return { isSuccess: true, message: name+' is created successfully!' };
 } catch (error) {
  console.error(error);
   return { isSuccess: false, message: error.message };
 }
}

async function getAllDepartments() {
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    let list = await getDocs(collection(db, 'Department'));
    return { isRetrieved: true, data: list.docs, message: 'Department list successfully retrieved.' };
  } catch (error) {
    console.error(error);
    return { isRetrieved: false, data: null, message: error.message || error };
  }
}


async function getDepartment(id) {
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    let department = await getDoc(doc(db, 'Department', id));
    /* console.log(department.data()); */
    return { isRetrieved: true, data: department.data(), message: 'Department list successfully retrieved.' };
  } catch (error) {
    console.error(error);
    return { isRetrieved: false, data: null, message: error.message || error };
  }
}



async function getAllEmployees() {
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    const list = await getDocs(collection(db, 'Employee'));
    return { isRetrieved: true, data: list.docs, message: 'Employee list successfully retrieved.' };
  } catch (error) {
    console.error(error);
    return { isRetrieved: false, data: null, message: error.message };
  }
}


async function searchEmployee(filter) {
  const keyword = filter.keyword;
  const role = filter.role === 'All' ? '' : filter.role;
  const department = filter.department === 'All' ? '' : filter.department;
  
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    const employees = await getAllEmployees();

    if (employees.isRetrieved) {
      const filteredList = await Promise.all(employees.data.map(async (employee) => {
        const employeeData = await getUserByID(employee.id);
        const personalData = employeeData.data.personalInformation;
        const employmentData = employeeData.data.employmentInformation;

        if(( personalData.firstname.toLowerCase().includes(keyword.toLowerCase()) || personalData.middlename.toLowerCase().includes(keyword.toLowerCase()) || personalData.surname.toLowerCase().includes(keyword.toLowerCase())) && ((employmentData.role.toLowerCase().includes(role.toLowerCase()) && employmentData.department.toLowerCase().includes(department.toLowerCase()))) && employmentData.role !== 'Admin' ){
          return { id: employee.id, data: employeeData.data };
          
        }

        return null;
      }));

      const filteredListWithoutNulls = filteredList.filter((item) => item !== null);
      return { isSuccess: true, list: filteredListWithoutNulls, message: '' };
    } else {
      return { isSuccess: false, list: null, message: employees.message };
    }
  } catch (error) {
    console.error(error);
    return { isSuccess: false, list: null, message: error.message };
  }
}



export {
  pushEmployeePersonalInfo,
  pushEmployeeInfo,
  pushFamilyBackgroundInfo,
  pushEducationalBackgroundInfo,
  pushCivilServiceInfo,
  pushWorkExperienceInfo,
  pushVoluntaryWorkInfo,
  pushLearingProgramAttendedInfo,
  pushOtherInformationInfo,
  addDepartment,
  getAllDepartments,
  getDepartment,
  getUserByID,
  getAllEmployees,
  searchEmployee
};
