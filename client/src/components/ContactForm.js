import "./ContactFormStyles.css";

function ContactForm() {
  return (
    <div className="form-container">
      <h1>Enter our message here!!</h1>
      <form>
        <input placeholder="Name" />
        <input placeholder="email" />
        <input placeholder="subject" />
        <input placeholder="message" rows="4" />
        <button>send message</button>
      </form>
    </div>
  );
}

export default ContactForm;
