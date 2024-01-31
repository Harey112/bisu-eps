import SideBarNavigation from "./components/fragments/SideBarNavigation"
import { Fragment, useEffect, useRef, useState, useLayoutEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PersonalInformationForm from "./components/fragments/PersonalInformationForm";
import { getCurrentUser } from "../util/Account";
import FamilyBackground from "./components/fragments/FamilyBackgroundForm";
import FamilyBackgroundForm from "./components/fragments/FamilyBackgroundForm";
import EducationalBackground from "./components/fragments/EducationalBackground";
import CivilServiceEligibilty from "./components/fragments/CivilServiceEligibilty";
import WorkExperience from "./components/fragments/WorkExperience";
import VoluntaryWork from "./components/fragments/VoluntaryWork";
import LearningProgramAttended from "./components/fragments/LearningProgramAttended";
import OtherInformation from "./components/fragments/OtherInformation";




function Profile() {
    const [currentUser, setCurrentUser] = useState(null);
    const location = useLocation();
    const [userIdToView, setUserIdToView] = useState(location.state.currentUser);
    const navigate = useNavigate();
    const [rootDimensions, setRootDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
    const [style, setStyles] = useState({});
    const sideBarRef = useRef();
    const [sideBarDimension, setSideBarDimension] = useState({});
    const [selectedTab, setSelectedTab] = useState('personal_information');;
    const tabs = [
        { name: "Personal Information", id: "personal_information", priority: 1},
        { name: "Family Background", id: "family_background" , priority: 0},
        { name: "Educational Background", id: "educational_background", priority: 0 },
        { name: "Civil Service Eligibility", id: "civil_service_eligibility", priority: 0 },
        { name: "Work Experience", id: "work_experience", priority: 0},
        { name: "Voluntary Work", id: "voluntary_work", priority: 0 },
        { name: "Learning Program Attended", id: "learning_development_program_attended", priority: 0 },
        { name: "Other Information", id: "other_information", priority: 0 },
      ];

    useEffect(()=>{
      async function fetchData(){

        const query = await getCurrentUser();

        setCurrentUser(query.data);


        if(userIdToView === null || userIdToView === undefined){
          setUserIdToView(query.data.uid);
        }

        

      }

      fetchData();
    }, []);




    useLayoutEffect(() => {
      const handleResize = () => {
        setRootDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };


  
      // Attach the event listener when the component mounts
      window.addEventListener('resize', handleResize);
  
      // Remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    
    //Set Sidebar Dimension
    useLayoutEffect(() => {
      if (sideBarRef.current) {
        setSideBarDimension(sideBarRef.current.getBoundingClientRect());
      }
    }, [rootDimensions]);
  
    // Set style
    useLayoutEffect(() => {
      setStyles({
        homeContainer: {
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        },
        contentDisplay: {
          height: '100%',
          width: `${rootDimensions.width - sideBarDimension.width}px`,
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          alignItems: 'center',
          backgroundColor: 'var(--global-secondary-color)',
          overflowY: 'auto',
        },
      });
    }, [rootDimensions, sideBarDimension, sideBarRef])

  return ( 
  <div style={style.homeContainer}>
  
      <SideBarNavigation
        tabs={tabs}
        selected={selectedTab}
        ref={sideBarRef}
        actionPerTabClick={setSelectedTab}
        customBottomButton={{ label: 'Back', action: () => { navigate('/') } }}
      />
    
      <div style={style.contentDisplay}>
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center'}}>
          {currentUser && (
            <>
              {selectedTab === 'personal_information' && (
                <>
                  <PersonalInformationForm userID={userIdToView} viewMode={(currentUser !== userIdToView)} />
                </>
              )}
    
              {selectedTab === 'family_background' && (
                <FamilyBackgroundForm userID={userIdToView} viewMode={(currentUser === userIdToView)} />
              )}

              {selectedTab === 'educational_background' && (
                <EducationalBackground userID={userIdToView} viewMode={(currentUser === userIdToView)}/>
              )}

              {selectedTab === 'civil_service_eligibility' && (
                <CivilServiceEligibilty userID={userIdToView} viewMode={(currentUser === userIdToView)}/>
              )}

              {selectedTab === 'work_experience' && (
                <WorkExperience userID={userIdToView} viewMode={(currentUser === userIdToView)}/>
              )}

              {selectedTab === 'voluntary_work' && (
                <VoluntaryWork userID={userIdToView} viewMode={(currentUser === userIdToView)}/>
              )}

              {selectedTab === 'learning_development_program_attended' && (
                <LearningProgramAttended userID={userIdToView} viewMode={(currentUser === userIdToView)}/>
              )}
              
              {selectedTab === 'other_information' && (
                <OtherInformation userID={userIdToView} viewMode={(currentUser === userIdToView)}/>
              )}
            </>
          )}
        </div>
      </div>
  </div>
  
   );

}
 
export default Profile;