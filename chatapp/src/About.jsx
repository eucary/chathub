import Navside from "./assets/Navside";
import './About.css';
function About() {
    return(
        <div className="about-page">
            <div className="about-container">
                <Navside/>
                <div className="about-content">
                    <div className="imageside">
                        <img src="public/Image 1.png" alt="Logo" />
                        <img src="public/Image 2.png" alt="Logo" />
                    </div>
                    <div className="textside">
                        <div className="titletext">
                            <h1>Chat made easy</h1>
                            <p>Connecting People Everywhere</p>
                        </div>
                        <div className="contenttext">
                            <h1>About us</h1>
                            <p>Chathub is a cutting-edge chat application designed to simplify communication and enhance user experiences. Our platform offers private messaging, group chats, and an array of expressive emojis and stickers. Seamlessly integrating with social media platforms, Chathub enables users to effortlessly connect with their friends and contacts. Registration and login are essential to unlock the full potential of Chathub, providing access to all its exciting features and functionalities.</p>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}


export default About;