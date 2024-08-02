import UserCount from '../views/UserCount';
import PostCount from '../views/PostsCount';

const Footer = () => {
  return (
    <footer>
      <div>
        <UserCount /> 
        <PostCount /> 
      </div>
    </footer>
  );
};

export default Footer;
