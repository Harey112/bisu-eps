import HomeLayout from "./HomeLayout";
import Dashboard from "./components/Dashboard";
import Department from "./components/Department";
import Employee from "./components/Employee";
import AddEmployee from "./components/fragments/AddEmployee";
import ViewDepartment from "./components/fragments/ViewDepartment";
import Report from "./components/Report";

const HomeHR = ({selected, view}) => {

    const tabs = [
        { name: "Dashboard", component: Dashboard, id: "dashboard", message: '', data: '',  priority: 1 },
        { name: "Department", component: Department, id: "department", message: 'Go To Departments', data: '', priority: 0 },
        { name: "Employee", component: Employee, id: "employee", message: 'Go To Employees', data: '', priority: 0 },
        { name: "Report", component: Report, id: "report", message: 'Go To Reports', data: '', priority: 0 },
      ];

    let contents = [
        {name: "Add Employee", component: AddEmployee, id: "add-employee"},
        {name: "View Department", component: ViewDepartment, id: "view-department"}
    ];

    let component, title;
  

    for(let i = 0; i < tabs.length; i++){
        if(tabs[i].id === selected ){
            [title, component] =  [tabs[i].name,tabs[i].component];
            break;
        }
        
    }


    if(view !== ""){
        for(let i = 0; i < contents.length; i++){
            if(contents[i].id === view){
                component = contents[i].component;
            }
        }
    }
    


    return ( 
        <HomeLayout tabs={tabs} selected={selected} content={component} title={title}/>
     );
}
 
export default HomeHR;