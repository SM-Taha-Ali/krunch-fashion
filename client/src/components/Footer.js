import "./FooterStyles.css";

const Footer = () => {
  return (
      <div className="footer">
        <div className="top">
          <div>
            <h4>FASHION-CHEK👗</h4>
            <p>WE make Design that you like</p>
          </div>
          <div>
            <a href="/"><i className="fa-brands fa-facebook-square"></i></a>
            <a href="/"><i className="fa-brands fa-instagram-square"></i></a>
            <a href="/"><i className="fa-brands fa-behance-square"></i></a>
            <a href="/"><i className="fa-brands fa-twitter-square"></i></a>
          </div>
        </div>

        <div className="bottom">
            <div>
              <h4>projects</h4>
              <a href="/">Algorithum</a>
              <a href="/">Status</a>
              <a href="/">Gallery</a>
              <a href="/">Process</a>
            </div>
            <div>
              <h4>Community</h4>
              <a href="/">Github</a>
              <a href="/">Issues</a>
              <a href="/">Project</a>
              <a href="/"> Twitter</a>
            </div>
            <div>
              <h4>Help</h4>
              <a href="/">support</a>
              <a href="/">Trouble shooting</a>
              <a href="/">Contact us</a>
            </div>
            <div>
              <h4>Others</h4>
              <a href="/">Terms of service </a>
              <a href="/">Privacy policy</a>
              <a href="/">License</a>
            </div>
          </div>
          <div className="footer_end"><p>&copy; 2023 FASHION-CHEK ALL Right Reserved.</p></div>
      </div>
      
    
  );

};

export default Footer;


