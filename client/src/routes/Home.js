import * as React from 'react';
import Populardesign from "../components/Populardesign";
import Footer from "../components/Footer";
import Main_section from "../components/Main_section";
import Recentdesign from "../components/Recentdesign";

function Home() {
  return (
    <>
      <Main_section
      clasname="Main_section"
      imgurl="https://codesrevolvewordpress.s3.us-west-2.amazonaws.com/revolveai/2022/10/15105933/ai-in-fashion.jpg"
      // text="Search For Your Design"
      // title="We Make a Design For You"
      url= "/"
      // btnClass="show"
      // buttonText="Travel plan"
      />
      <Populardesign/>
      <Recentdesign/>
      <Footer/>
    </>
  );
}

export default Home;
