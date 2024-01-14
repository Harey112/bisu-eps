import SideBarNavigation from "./components/fragments/SideBarNavigation"
import Header from "./components/fragments/Header";
import { useEffect, useRef, useState } from "react";

const HomeLayout = ({tabs, selected, content: Content, title }) => {
    const [rootDimensions, setRootDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
    const [deviceType, setDeviceType] = useState('DESKTOP');
    const [style, setStyles] = useState({});
    const sideBarRef = useRef();
    const [sideBarDimension, setSideBarDimension] = useState({});
    const headerRef = useRef();
    const [headerDimension, setHeaderDimension] = useState({});
    
      useEffect(() => {
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
      }, [window]);
      

      useEffect(()=>{
        if(sideBarRef){
          setSideBarDimension(sideBarRef.current.getBoundingClientRect());
        }

        if(headerRef){
          setHeaderDimension(headerRef.current.getBoundingClientRect());
        }
      }, [deviceType, rootDimensions]);


      useEffect(()=>{
        if (rootDimensions.width < 768) {
          setDeviceType('MOBILE');
        } else if (rootDimensions.width >= 768 && rootDimensions.width <= 1024) {
          setDeviceType('TABLET');
        } else {
          setDeviceType('DESKTOP');
        }

        setStyles({
            homeContainer: { height: rootDimensions.height, width: rootDimensions.width, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-start', alignItems: 'flex-start' },
            contentDisplay: { height: '100%', width: `${rootDimensions.width - sideBarDimension.width}px`, display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', backgroundColor: 'var(--global-secondary-color)' },
            contentBox: { margin: '1% 0 0 0', height: `${rootDimensions.height - headerDimension.height}px`, width: '98%', overflowY: 'auto', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-start' }
          });
      },[rootDimensions, sideBarDimension, headerDimension]);

    return ( 
        <div style={style.homeContainer}>
            <SideBarNavigation tabs={tabs} selected={selected} ref={sideBarRef} deviceType={deviceType}/>
            <div style={style.contentDisplay}>
                <Header title={title} ref={headerRef} deviceType={deviceType}/>
                <div style={style.contentBox}>
                    <Content tabs={tabs}/>
                </div>
            </div>
        </div>
     );
}
 
export default HomeLayout;