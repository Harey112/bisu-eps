import SideBarNavigation from "./components/fragments/SideBarNavigation"
import Header from "./components/fragments/Header";
import { useEffect, useRef, useState } from "react";

const HomeLayout = ({tabs, selected, content: Content, title }) => {
    const [dimensions, setDimensions] = useState({width: window.innerWidth, height: window.innerHeight});
    const [deviceType, setDeviceType] = useState('DESKTOP');
    const [style, setStyles] = useState({});
    const headerRef = useRef(null);
    
      useEffect(() => {
        const handleResize = () => {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        };

        if (window.innerWidth < 768) {
            setDeviceType('MOBILE');
          } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
            setDeviceType('TABLET');
          } else {
            setDeviceType('DESKTOP');
          }
    
        // Attach the event listener when the component mounts
        window.addEventListener('resize', handleResize);
    
        // Remove the event listener when the component unmounts
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

      useEffect(()=>{
        setStyles({
            homeContainer: { height: dimensions.height, width: dimensions.width, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-start', alignItems: 'flex-start' },
            contentDisplay: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', backgroundColor: 'var(--global-secondary-color)' },
            contentBox: { margin: '1% 0 0 0', height: '-webkit-fill-available', width: '98%', overflowY: 'auto', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-start' }
          });
      },[dimensions]);

    return ( 
        <div style={style.homeContainer}>
            <SideBarNavigation tabs={tabs} selected={selected} ref={headerRef}/>
            <div style={style.contentDisplay}>
                <Header title={title}/>
                <div style={style.contentBox}>
                    <Content tabs={tabs}/>
                </div>
            </div>
        </div>
     );
}
 
export default HomeLayout;