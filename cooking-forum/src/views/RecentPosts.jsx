import PropTypes from 'prop-types';

const RecentPosts = ({ title, content, createdOn }) => {

    return (
        <div>
            <h4>{title}</h4>
            <p>{content}</p>
            <p>{createdOn}</p>
        </div>
    )
}

export default RecentPosts

RecentPosts.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired
};