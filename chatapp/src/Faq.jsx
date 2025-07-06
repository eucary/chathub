import Navside from "./assets/Navside";
import './Faq.css';
function Faq() {
    return (
        <div className="faq-page">
            <Navside />
            <div className="faq-content">
                <div className="faq-header">FAQ Section</div>
                <div className="faq-qa">
                    <div className="faq1">
                        <question>How to create an account?</question>
                        <p>To create an account on Chathub, simply download the app, follow the registration steps, and set up your profile. Once done, you can start enjoying the various communication features available.</p>
                    </div>
                    <div className="faq2">
                        <question>How can I chat to others?</question>
                        <p>Simply search the name of the user. And you can message them.</p>
                    </div>
                    <div className="faq3">
                        <question>How to chat with ai?</question>
                        <p>To chat with AI, just simply type and send a message. AI will automatically response on you. </p>
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default Faq;