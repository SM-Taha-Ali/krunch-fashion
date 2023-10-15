import "./RecentdesignStyles.css";
import RecentdesignData from "./RecentdesignData";
import Img1 from "../assets/ds5.jpg";
import Img2 from "../assets/ds6.jpg";
import Img3 from "../assets/ds7.jpg";

function Recentdesign() {
  return (
    <div className="Recent_design_cont">
      <h1>Recent Design</h1>
      <p>Here are some of our recent Design.</p>
      <div className="Recent_design_card">
        <RecentdesignData
        image={Img1}
        heading="AI image 1"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit reprehenderit libero tempora officia enim delectus nostrum perferendis fugiat. Maxime?"
        
        />
        <RecentdesignData
        image={Img2}
        heading="AI image 2"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit reprehenderit libero tempora officia enim delectus nostrum perferendis fugiat. Maxime?"
        
        />
        <RecentdesignData
        image={Img3}
        heading="AI image 3"
        text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum sit reprehenderit libero tempora officia enim delectus nostrum perferendis fugiat. Maxime?"
        
        />
      </div>
    </div>
  );
}

export default Recentdesign;
