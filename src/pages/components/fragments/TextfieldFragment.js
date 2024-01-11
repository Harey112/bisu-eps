import { Fragment, useEffect, useRef, useState } from "react";

const TextfieldFragment = (props) => {

    const rootDivRef = useRef(null);
    const labelRef = useRef(null);
    const [rootDimension, setRootDimention] = useState({});
    const [labelDimension, setLabelDimention] = useState({});




    useEffect(() => {
        if (rootDivRef.current && labelRef.current) {
            setRootDimention(rootDivRef.current.getBoundingClientRect());
            setLabelDimention(labelRef.current.getBoundingClientRect());
        }
    }, []);



    //Styles
    const rootStyle = {height: '40px',width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center'};
    const inputStyle = {width: (rootDimension.width - labelDimension.width) - 20+'px', height:rootDimension.height*.98+'px', borderStyle: 'none', borderRadius: '0px', borderColor: 'transparent', backgroundColor: '#d9d9d9', outline: 'transparent', fontFamily: 'Poppins', fontSize: '15px', padding: '0 0 0 5px' };
    const labelStyle = { fontFamily: 'Barlow', fontSize: 'large', fontWeight: 500, margin: '0 10px 0 0' };


    return ( 
        <Fragment>
            <div style={rootStyle} ref={rootDivRef}>
                <label htmlFor={props.name.toLowerCase()} ref={labelRef} style={labelStyle}>{props.name}{props.required && <span style={{color: 'red'}}>*</span>}:</label>
                <input type={props.type} id={props.name.toLowerCase()} name={props.name.toLowerCase()} value={props.value} placeholder={props.name} onChange={props.onChange} style={inputStyle} autoComplete={props.autoComplete !== undefined ? props.autoComplete : 'off'}/>
            </div>
        </Fragment>
     );
}


export default TextfieldFragment;