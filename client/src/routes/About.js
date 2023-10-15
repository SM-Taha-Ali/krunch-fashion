import Main_section from "../components/Main_section";
import AboutImg from "../assets/ds10.jpg";
import Footer from "../components/Footer";
import AboutUs from "../components/AboutUs";

function About() {
  return (
    <>
      <Main_section
      clasname="Main_section-mid"
      imgurl={AboutImg}
      title="About Us"
      />
      <AboutUs/>
      <Footer/>
    </>
  );
}

export default About;
