import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const RecentPosts = ({ id, author, title, content, createdOn, likeCount, commentsCounter }) => {
    return (
        <div>
            <h3>
                <Link to={`/posts/${id}`}>{title}</Link>
            </h3>
            <p>Created by: {author}</p>
            <p>{content}</p>
            <p>Posted: {new Date(createdOn).toLocaleString()}</p>
            <p>Likes: {likeCount}</p>
            <p>Comments: {commentsCounter}</p><br />
        </div>
    );
}

RecentPosts.propTypes = {
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    likeCount: PropTypes.number.isRequired,
    commentsCounter: PropTypes.number.isRequired,
};

export default RecentPosts;
