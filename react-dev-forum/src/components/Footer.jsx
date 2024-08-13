import UserCount from '../views/UserCount';
import PostCount from '../views/PostsCount';
import './Styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='footer'>
        <UserCount /> 
        <PostCount /> 
      </div>
    </footer>
  );
};

export default Footer;
