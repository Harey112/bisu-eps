let userData = {
    personalInformation: {},
    employmentInformation: {}
}


let personalInformation = {
    surname: '',
    firstname: '',
    ext: '',
    middlename: '',
    birthdate: '',
    birthplace: '',
    sex: '',
    civilstatus: '',
    other: '',
    height: '',
    weight: '',
    bloodtype: '',
    gsisNo: '',
    pagibigNo: '',
    philhealthNo: '',
    sssNo: '',
    tinNo: '',
    employeeNo: '',
    csidNo: '',
    citizenship: {
        isFilipino: false,
        hasDualCitizenship: false,
        byBirth: false,
        byNaturalization: false,
        specifiedCountry: ''
      },
    residentialAddress: {
        house: '',
        street: '',
        subdivision: '',
        barangay: '',
        city: '',
        province: '',
        postalCode: ''
      },
    permanentAddress: {
        house: '',
        street: '',
        subdivision: '',
        barangay: '',
        city: '',
        province: '',
        postalCode: ''
      },
    telNo: '',
    mobileNo: '',
    email: '',
  };


let currentEmploymentInformation = {
    role: 'staff',
    department: ''
}



export {userData, personalInformation, currentEmploymentInformation};