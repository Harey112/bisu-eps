import React from "react";
import bisuLogo from "../../../images/BISU LOGO.png";

const Header = ({ title }) => {
  return (
    <div className="box" style={{ width: '98%', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', margin: '1% 0 0 0' }}>
      <div className="header_div" style={{ height: 'auto', width: '-webkit-fill-available', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="header" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center' }}>
          <img src={bisuLogo} id="header_bisu_logo" alt="" style={{ height: '75px', width: '75px' }} />
          <div className="header_title_div" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center', margin: '0 0 0 15px' }}>
            <h3 id="header_campus_name" style={{ fontFamily: 'Poppins', fontSize: 'medium', fontWeight: '600', color: 'var(--global-primary-color)' }}>BOHOL ISLAND STATE UNIVERSITY</h3>
            <div className="breakline" style={{ backgroundColor: 'var(--global-primary-color)', height: '2px' }}></div>
            <h5 id="header_system_name" style={{ fontFamily: 'Poppins', fontSize: 'small', fontWeight: '300', color: 'var(--global-primary-color)' }}>Employee Profile System</h5>
          </div>
        </div>
        <h3 id="page_title" style={{ fontFamily: 'Nunito', margin: '0 20px 0 0', fontSize: 'x-large' }}>{title}</h3>
      </div>
      <div className="breakline" style={{ backgroundColor: 'black', margin: '15px 0 0 0' }}></div>
    </div>
  );
}

export default Header;
