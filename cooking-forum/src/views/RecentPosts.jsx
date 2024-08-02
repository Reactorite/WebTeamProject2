import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const RecentPosts = ({ id, title, content, createdOn, likeCount }) => {
    return (
        <div>
            <h3>
                <Link to={`/posts/${id}`}>{title}</Link>
            </h3>
            <p>{content}</p>
            <p>{createdOn}</p>
            <p>Likes: {likeCount}</p>
        </div>
    );
}

RecentPosts.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    likeCount: PropTypes.number
};

export default RecentPosts;
