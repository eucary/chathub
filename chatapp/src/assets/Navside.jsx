import Landingpage from '../Landingpage';
import './Navside.css';
function Navside() {
    return (
        <div className="navside">
            <nav className="nav-links">
                <ul>
                    <li><a href='/landingpage'><img src='/public/Talk.png'/></a></li>
                    <li><a href='/about'><img src='/public/About.png'/></a></li>
                    <li><a href='/faq'><img src='/public/Questions.png'/></a></li>
                    <li><a href='/profile'><img src='/public/Customer.png'/></a></li>
                </ul>
                <button onClick={() => {
                    window.location.href = '/';
                }}>
                    <img src='/public/log out.png' alt='Logout' />
                </button>
            </nav>
        </div>
    );
}

export default Navside;