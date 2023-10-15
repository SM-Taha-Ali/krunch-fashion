import "./Main_sectionStyles.css";


function Main_section(props) {
  return (
    <>
      <div className={props.clasname}>
        <img src={props.imgurl} alt="Main_section_image" />
        <div className="Main_sectiontext">
          <h1>{props.title}</h1>
          <p>{props.text}</p>
          {/* <Searchbar/> */}
          <a href={props.url} className={props.btnClass}>{props.buttonText}</a>
        </div>
      </div>
    </>
  );
}

export default Main_section;
