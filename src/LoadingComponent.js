import './LoadingComponent.css';

function LoadingComponent(props)
{
    if(props.responsive){return(
        <div className='w-full h-full bg-purple-900 flex justify-center items-center overflow-x-hidden overflow-y-hidden'>
            <h1 className='text-2xl font-bold text-white'>{props.text ?? 'Loading'}</h1>
            <div class="lds-hourglass"></div>
        </div>
    )}
    else{return(
        <div className='w-full h-screen bg-purple-900 flex justify-center items-center overflow-x-hidden overflow-y-hidden'>
            <h1 className='text-2xl font-bold text-white'>{props.text ?? 'Loading'}</h1>
            <div class="lds-hourglass"></div>
        </div>
    )}
}

export {LoadingComponent};