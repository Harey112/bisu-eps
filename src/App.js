import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Fragment } from "react";
import Login from "./pages/Login";
import HomeHR from "./pages/HomeHR";
import HomeDeanOrChairperson from "./pages/HomeDeanOrChairperson";
import AdminPage from "./pages/AdminPage";
import Profile from "./pages/Profile";
import Test from './pages/Test';

function App() {
  const user = JSON.parse(sessionStorage.getItem("epsUser"));
  const isLoggedIn = (user !== null);

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          
          <Fragment>
            {/* Routes for Human Resource */}
            {user.user === "HR" &&
             (
              <Fragment>
                <Route exact path="/" element={ <HomeHR selected="dashboard" view=""/> }/>
                <Route path="/profile" element={ <Profile/> }/>
                <Route path="/dashboard" element={<Navigate to="/"/> }/>
                <Route path="/department" element={ <HomeHR selected="department" view=""/> }/>
                <Route path="/employee" element={ <HomeHR selected="employee" view=""/> }/>
                <Route path="/report" element={ <HomeHR selected="report" view=""/> }/>
                <Route path="/employee/add-employee" element={ <HomeHR selected="employee" view="add-employee"/> }/>
                <Route element={<Navigate to='/'/>}/>
              </Fragment>
             )
             }

            {/* Routes for Deans and Chairpersons */}
            {(user.user === "Dean" || user.user === "Chairperson") && (
              <Fragment>
                <Route exact path="/" element={ <HomeDeanOrChairperson selected="dashboard" view=""/> }/>
                <Route path="/profile" element={ <Profile/> }/>
                <Route path="/dashboard" element={<Navigate to="/"/> }/>
                <Route path="/department" element={ <HomeDeanOrChairperson selected="department" view=""/> }/>
                <Route path="/employee" element={ <HomeDeanOrChairperson selected="employee" view=""/> }/>
                <Route path="/report" element={ <HomeDeanOrChairperson selected="report" view=""/> }/>
                <Route path="/employee/add-employee" element={ <HomeDeanOrChairperson selected="employee" view="add-employee"/> }/>
                <Route element={<Navigate to='/'/>}/>
              </Fragment>
            )}

            {/* Routes for Admin */}
            {user.user === "Admin" && (
              <Fragment>
                <Route exact path='/' element={<AdminPage/>}/>
                <Route element={<Navigate to='/'/>}/>
              </Fragment>
            )}

            {/* Routes for Faculties and Staffs */}
            {(user.user === "Staff" || user.user === "Faculty") && (
              <Fragment>
                <Route exact path='/' element={<Profile/>} />
                <Route element={<Navigate to='/'/>}/>
              </Fragment>
            )}
            
          </Fragment>
        ) : (
              <Fragment>
                <Route exact path='/' element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login/>} />
              </Fragment>
        )}
        
        <Route path='/test' element={<Test/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
