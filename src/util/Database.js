import { myFirebase } from "../firebase";
import { collection, doc, getDocs, getFirestore , setDoc} from 'firebase/firestore';
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

          default:

        }
      }
      return {isSuccess: true, data: userDataClone};
  } catch (error) {
    console.error( error);
    return {isSuccess: false, data: error.message};
  }
}


async function pushEmployeePersonalInfo(personalData, docID) {
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    await setDoc(doc(db, "Employee", docID), {});
    await setDoc(doc(db, "Employee", docID, "User_Data", "Personal_Information"), personalData);
    return { isSuccess: true, message: "Employee account information updated successfully!" };
  } catch (error) {
    return { isSuccess: false, message: error.message };
  }
  
}


async function pushEmployeeInfo(employeeData, docID) {
   try {
    if (!navigator.onLine) throw new Error('No internet connection');
    await setDoc(doc(db, "Employee", docID), {});
    await setDoc(doc(db, "Employee", docID, "User_Data", "Current_Employment_Information"), employeeData);
    return { isSuccess: true, message: "Employee information updated successfully!" };
  } catch (error) {
    return { isSuccess: false, message: error.message };
  }

}


async function addDepartment(name, description) {
  const departmentID = name.toLowerCase().replace(/\s/g, '');

  try {
  if (!navigator.onLine) throw new Error('No internet connection');
   await setDoc(doc(db, "Department", departmentID),{name: name, departmentID: departmentID, description: description});

   return { isSuccess: true, message: name+' is created successfully!' };
 } catch (error) {
   console.error('Error updating employee account information', error.message);
   return { isSuccess: false, message: error.message };
 }
}

async function getAllDepartments() {
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    let list = await getDocs(collection(db, 'Department'));
    return { isRetrieved: true, data: list.docs, message: 'Department list successfully retrieved.' };
  } catch (error) {
    console.error('Error:', error);
    return { isRetrieved: false, data: null, message: error.message || error };
  }
}


async function getAllEmployees() {
  try {
    if (!navigator.onLine) throw new Error('No internet connection');
    const list = await getDocs(collection(db, 'Employee'));
    return { isRetrieved: true, data: list.docs, message: 'Employee list successfully retrieved.' };
  } catch (error) {
    console.error('Error:', error);
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
    console.error(error.message);
    return { isSuccess: false, list: null, message: error.message };
  }
}



export {
  pushEmployeePersonalInfo,
  pushEmployeeInfo,
  addDepartment,
  getAllDepartments,
  getUserByID,
  getAllEmployees,
  searchEmployee
};
