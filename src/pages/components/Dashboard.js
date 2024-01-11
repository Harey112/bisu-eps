import { useEffect, useState } from 'react';
import './styles/dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({tabs}) => {
    const navigate = new useNavigate();
    return ( 
        <div className='dashboard_content'>
            { 
                tabs.map((tab) =>(
                    <div key={tab.id} onClick={()=> {navigate('/'+tab.id)}} className="tabs">
                        <h3 className='card_name' >{tab.name}</h3>
                        <p className='card_message'>{tab.message}</p>

                    </div>
                ))
            }
           

        </div>
     );
}
 
export default Dashboard;