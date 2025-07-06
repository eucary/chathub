import Landingpage from '../Landingpage';
import './Navside.css';

function Navside() {
    return (
        <div className="navside">
            <nav className="nav-links">
                <ul>
                    <li><a href='/landingpage'><img src='/Talk.png' alt="Talk" /></a></li>
                    <li><a href='/about'><img src='/About.png' alt="About" /></a></li>
                    <li><a href='/faq'><img src='/Questions.png' alt="FAQ" /></a></li>
                    <li><a href='/profile'><img src='/Customer.png' alt="Profile" /></a></li>
                </ul>
                <button onClick={() => {
                    window.location.href = '/';
                }}>
                    <img src='/log out.png' alt='Logout' />
                </button>
            </nav>
        </div>
    );
}

export default Navside;
