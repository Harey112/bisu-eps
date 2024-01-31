import { Fragment, useRef, useState, useLayoutEffect} from "react";

const TextfieldFragment = (props) => {

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
          alignItems: 'center'
        }}>
          {props.disable !== undefined && props.disable === true && 
              <div style={{position: 'absolute', width: rootDimension.width+'px', height: 'inherit', backgroundColor: 'transparent'}}></div>
          }
          <p ref={labelRef} style={{
            fontFamily: 'Poppins',
            fontSize: '15px',
            fontWeight: '400',
            margin: '0 10px 0 0',
            width: 'auto'
          }}>
            { props.name !== undefined && 
                <>
                    {props.name}
                    {props.required && <span style={{ color: 'red' }}>*</span>}:
                </>

            }
          </p>
          <input
            
            type={props.type}
            name={(props.varName) ? props.varName : props.name.toLowerCase().replace(/\s/g, '').replace('-', '')}
            value={props.value}
            placeholder={props.placeholder ? props.placeholder : props.name}
            onChange={(e) => { props.onChange(e) }}
            style={{
              width: (Number.parseFloat(rootDimension.width) - Number.parseFloat(labelDimension.width)) - 20 + 'px',
              height: '90%',
              borderStyle: 'none',
              borderRadius: '0px',
              borderColor: 'transparent',
              backgroundColor: '#e7e7e7',
              outline: 'transparent',
              fontFamily: 'Poppins',
              fontSize: '15px',
              padding: '0 0 0 5px',
              pointerEvents: (props.disable !== undefined && props.disable === true) ? 'none' : 'auto'
            }}
            autoComplete={props.autoComplete !== undefined ? props.autoComplete : 'off'}
          />
        </div>
      </Fragment>
      
     );
}


export default TextfieldFragment;