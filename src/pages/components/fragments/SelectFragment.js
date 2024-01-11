import { Fragment, useEffect, useRef, useState } from "react";

const SelectFragment = (props) => {
    const rootDivRef = useRef(null);
    const labelRef = useRef(null);
    const [rootDimension, setRootDimention] = useState({});
   

    useEffect(() => {
        if (rootDivRef.current && labelRef.current) {
            setRootDimention(rootDivRef.current.getBoundingClientRect());
        }
    }, []);
    

    //Style
    const rootStyle = {height: '40px',width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center'};
    const selectStye = { width: 'auto', height: rootDimension.height*.98+'px', fontFamily: 'Poppins', fontSize: '15px', fontWeight: 400, outline: 'none', padding: '0 0 0 5px' };
    const labelStyle = { fontFamily: 'Barlow', fontSize: 'large', fontWeight: 500, margin: '0 10px 0 0' };
    return ( 
        <Fragment>
            <div style={rootStyle}>
            <label htmlFor={props.name.toLowerCase()} style={labelStyle}>{props.name}:</label>
            <select id={props.name.toLowerCase()} name={props.name.toLowerCase()} value={props.value} onChange={props.onChange} style={selectStye}>
                { props.options &&
                    props.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.name}</option>
                    ))
                }
            </select>
            </div>
        </Fragment>
     );
}
 
export default SelectFragment;