function Content(props) {

    let render = (<></>);
  
    return (
      <div id="content" className={`content container bg-white min-h-screen px-2 py-5`}>
        {props.children ?? render}
      </div>
    );
  }
  
  function Footer(props) {
  
    let render = (<></>);
  
    return (
      <div id="footer" className="footer w-full mt-auto md:rounded-t-lg bg-gray-900 h-24">
          {props.children ?? render}    
      </div>
    );
  }
  
  function Header(props) {
  
    let render = (
        <></>
    );
  
    return (
      <div id="header" className="header w-full h-auto py-4 bg-purple-600 md:rounded-b-lg flex flex-col justify-center items-center">
        {props.children ?? render}
      </div>
    );
  }
  
  function PageHolder(props)
  {
  
    let render = (<></>);
  
    return(
      <div className="page-holder flex flex-col justify-start items-center min-h-screen">
        {props.children ?? render}
      </div>
    )
  
  }

  export {Content, Footer, Header, PageHolder};