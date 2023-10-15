import Main_section from "../components/Main_section";
import AboutImg from "../assets/ds11.jpg";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";

function Contact() {
  return (
    <>
      <Main_section
      clasname="Main_section-mid"
      imgurl={AboutImg}
      // text="Yous Journey Your Story"
      title="Contact"
      // url= "/"
      // btnClass="show"
      // buttonText="Travel plan"
      />
      <ContactForm/>
     <Footer/>

    </>
  );
}

export default Contact;
