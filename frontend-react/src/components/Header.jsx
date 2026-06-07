import { useContext } from 'react'
import Button from './Button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../AuthProvider'


const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
    
    
  }

  // Function to check current page
  const isCurrentPage = (path) => location.pathname === path;

  return (
    <>
      <nav className='navbar container pt-3 pb-3 align-items-start' >
        <Link className='navbar-brand text-light' to= '/'>GES-Ai powered Stock Prediction</Link>
        <div>
          {isLoggedIn ? (
            <>
              {!isCurrentPage('/dashboard') && (
                <>
                  <Button text= 'Dashboard' class = 'btn-outline-info' url='/dashboard'/>
                  &nbsp;
                </>
              )}
              <Button text= 'Logout' class = 'btn-outline-danger' url= '/login' onClick={handleLogout} />
            </>
          ) : (
            <>
              {!isCurrentPage('/login') && (
                <>
                  <Button text='Login' class = 'btn-outline-info' url="/login"/>
                  &nbsp;
                </>
              )}
              {!isCurrentPage('/register') && (
                <>
                  <Button text='Register' class = 'btn-info' url="/register"/>
                </>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  )
}

export default Header