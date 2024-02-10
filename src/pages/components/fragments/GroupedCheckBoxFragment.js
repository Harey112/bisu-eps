import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

const GroupedCheckBoxFragment = (props) => {
    const rootDivRef = useRef(null);
    const labelRef = useRef(null);
    const [rootDimension, setRootDimention] = useState({});
    const [labelDimension, setLabelDimention] = useState({});


    useEffect(() => {
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
                justifyContent: 'flex-start',
            }}>

            {props.disable !== undefined && props.disable === true && 
              <div style={{position: 'absolute', width: rootDimension.width+'px', height: 'inherit', backgroundColor: 'transparent'}}></div>
            }
                <p style={{
                fontFamily: 'Poppins',
                fontSize: '15px',
                fontWeight: '400',
                margin: '0 10px 0 0'
                }} ref={labelRef}>
                {props.name}
                {props.required && <span style={{ color: 'red' }} >*</span>}:
                </p>
                
                <div style={{
                width: (rootDimension.width - labelDimension.width)-20 + 'px',
                height: '90%',
                fontFamily: 'Poppins',
                fontSize: '15px',
                fontWeight: 400,
                outline: 'none',
                padding: '0 0 0 1px',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                }}>
                {props.options && (
                    props.options.map((option) => (
                    <div key={option.varName} style={{ display: 'flex', justifyContent: 'center' }}>
                        <input
                        type="checkbox"
                        style={{
                            margin: '0 5px',
                            width: '20px',
                            height: '20px',
                            cursor: 'pointer'
                        }}
                        name={(option.varName) ? option.varName : props.name.toLowerCase().replace(/\s/g, '').replace('-', '')}
                        id=""
                        checked={option.value}
                        onChange={option.onChange}
                        />
                        <p>{option.name}</p>
                    </div>
                    ))
                )}
                </div>
            </div>
    </Fragment>

     );
}
 
export default GroupedCheckBoxFragment;