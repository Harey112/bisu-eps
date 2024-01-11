import { Fragment } from "react";

const Dialog = (props) => {

    const type = (props.type !== undefined)? props.type : 'message';

    const borderColor = (type === 'error')? '#A10808' : 'var(--global-primary-color)';


    return ( 
        <Fragment>
            <div style={{height: '100%', width: '100%', position: 'absolute', backgroundColor: '#41414191', display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{height: 'auto', width: 'auto', minWidth: '300px', maxWidth: '500px', maxHeight: '100%', backgroundColor: '#fff', border: `3px solid ${borderColor}`, display: 'flex', flexDirection: 'column', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', padding: '30px'}}>
                    
                    {props.title !== undefined && (
                        <h2>{props.title}</h2>
                    )}

                    { props.message !== undefined && (
                        <p style={{fontSize: '21px', fontWeight: '600', marginTop: '15px'}}>{props.message}</p>
                    )}
                    <div style={{ width: '100%', marginTop: '20px', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-evenly', gap: '30%' }}>
                        { props.negativeButton !== undefined && (
                            <button onClick={props.negativeButton.action} style={{backgroundColor: 'transparent', color: 'var(--global-primary-color)'}}>{props.negativeButton.label}</button>
                        )
                        }
                        { props.positiveButton !== undefined && (
                            <button onClick={props.positiveButton.action}>{props.positiveButton.label}</button>
                        )
                        }
                        
                    </div>
                </div>
            </div>
        </Fragment>
     );
}
 
export default Dialog;