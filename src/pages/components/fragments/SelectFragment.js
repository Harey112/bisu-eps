import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

const SelectFragment = (props) => {
    const rootDivRef = useRef(null);
    const labelRef = useRef(null);
    const [rootDimension, setRootDimention] = useState({});
    const [labelDimension, setLabelDimention] = useState({});


    useLayoutEffect(() => {
        if (rootDivRef.current && labelRef.current) {
            setRootDimention(rootDivRef.current.getBoundingClientRect());
            setLabelDimention(labelRef.current.getBoundingClientRect());
        }
    }, [rootDivRef, labelRef]);



    return (
        <Fragment>
            <div ref={rootDivRef} style={{
            height: '40px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'flex-start'
            }}>
            <p ref={labelRef} style={{
                fontFamily: 'Poppins',
                fontSize: '15px',
                fontWeight: '400',
                margin: '0 10px 0 0'
            }}>
                {props.name}
                {props.required && <span style={{ color: 'red' }}>*</span>}:
            </p>

            <select
                name={(props.varName) ? props.varName : props.name.toLowerCase().replace(/\s/g, '').replace('-', '')}
                value={props.value}
                onChange={props.onChange}
                style={{
                width: (rootDimension.width - labelDimension.width) - 20 + 'px',
                height: '90%',
                fontFamily: 'Poppins',
                fontSize: '15px',
                fontWeight: 400,
                outline: 'none',
                padding: '0 0 0 1px'
                }}
            >
                {(props.options.length > 0) &&
                <option value=''>---</option>
                }
                {(props.options.length > 0) ? (
                props.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.name}</option>
                ))
                ) : (
                <option value=''>Nothing</option>
                )}
            </select>
            </div>
      </Fragment>
      
     );
}
 
export default SelectFragment;