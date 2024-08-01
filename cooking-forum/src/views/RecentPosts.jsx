import PropTypes from 'prop-types';

const RecentPosts = ({ title, content, createdOn, likeCount }) => {

    return (
        <div>
            <h4>{title}</h4>
            <p>{content}</p>
            <p>{createdOn}</p>
            <p>Likes: {likeCount}</p>
        </div>
    );
}

RecentPosts.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    likeCount: PropTypes.any
};

export default RecentPosts;