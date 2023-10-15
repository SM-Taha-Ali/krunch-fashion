import PopulardesignData from "./PopulardesignData";
import "./PopulardesignStyles.css";
import img5 from "../assets/ds1.jpg";
import img6 from "../assets/ds2.jpg";
import img7 from "../assets/ds3.jpg";
import img8 from "../assets/ds4.jpg";

const Populardesign = () => {
  return (
    <div className="populardesign_container">
      <h1>popular Design</h1>
      <p>Here are some of our Populer Design</p>

      {/* making first Popular design interface */}
      <PopulardesignData
      classname="first-des"
      heading="Cloth Go Design"
      text="Our latest dress design is perfect for a night out on the town. The sleek black fabric and plunging neckline are sure to turn heads. Pair it with some high heels and statement jewelry for a look that will make you stand out from the crowd. Shop the dress now!"
      img1={img5}
      img2={img6}/>


      {/* making second popular design interface */}
      <PopulardesignData
      classname="first-des-reverse"
      heading="Clothing line Design"
      text="Our most popular dress design is back in stock! This dress is perfect for any occasion, from a night out on the town to a special event. The flattering fit and stylish design will make you look and feel your best. Order yours today!"
      img1 = {img7}
      img2={img8}
      />
      
    </div>
  );
};

export default Populardesign;
