


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
    gsisidno: '',
    pagibigno: '',
    philhealthno: '',
    sssno: '',
    tinno: '',
    employeeno: '',
    csidno: '',
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
    telno: '',
    mobileno: '',
    email: '',
  };


let currentEmploymentInformation = {
    role: 'staff',
    department: ''
}


let familyBackground = {
  spouse: {
    surname: '',
    firstname: '',
    middlename: '',
    ext: '',
    occupation: '',
    businessName: '',
    businessAddress: '',
    telno: ''
  },

  father: {
    surname: '',
    firstname: '',
    middlename: '',
    ext: ''
  },

  mother: {
    surname: '',
    firstname: '',
    middlename: '',
    ext: ''
  },
  children: [/* {fullname: '', birthdate: ''} */]
};


let educationalBackground = [{
    level: '',
    nameOfSchool: '',
    program: '', 
    poaFrom: '',
    poaTo: '',
    highestLevel: '',
    yearGraduated: '',
    scholarship: ''
}];

let civilServiceEligibilty = [{
  careerService: '',
  rating: '',
  date: '', venue: '',
  licenseNumber: '',
  licenseValidity: ''
}];



let workExperience = [{
  inclusiveDateFrom : '',
  inclusiveDateTo: '',
  positionTitle: '',
  office: '',
  monthlySalary: '',
  payGrade: '',
  statusOfAppointment: '',
  isGovernmentService: ''
}];


let voluntaryWork = [{
  nameAndAddress: '',
  inclusiveDateFrom: '',
  inclusiveDateTo: '',
  numberHours: '',
  position: ''
}];


let learningProgramAttended = [{
  title: '',
  inclusiveDateFrom: '',
  inclusiveDateTo: '',
  numberHours: '',
  type: '',
  sponsor: ''

}];


let otherInformation = {
  specialSkills: [],
  recognitions: [],
  associations: []
};


let userData = {
  personalInformation: personalInformation,
  employmentInformation: currentEmploymentInformation,
  familyBackground: familyBackground,
  educationalBackground: educationalBackground,
  civilServiceEligibilty: civilServiceEligibilty,
  workExperience: workExperience,
  voluntaryWork: voluntaryWork,
  learningProgramAttended: learningProgramAttended,
  otherInformation, otherInformation
}



export {userData, personalInformation, currentEmploymentInformation, familyBackground, educationalBackground, civilServiceEligibilty, workExperience, voluntaryWork, learningProgramAttended, otherInformation};