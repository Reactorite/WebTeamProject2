import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Styles/RecentPosts.css';
import { getUserByHandle } from '../services/users.service';

const RecentPosts = ({ id, author, title, content, createdOn, likeCount, commentsCounter }) => {
    const [authorProfile, setAuthorProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthorProfile = async () => {
            try {
                const profile = await getUserByHandle(author);
                setAuthorProfile(profile);
            } catch (error) {
                console.error('Error fetching author profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorProfile();
    }, [author]);

    const {
        profilePictureURL = '',
        isAdmin = false,
        isOwner = false,
        isBlocked = false
    } = authorProfile || {};

    const rank = isAdmin ? 'Admin' : isOwner ? 'Owner' : 'User';
    const status = isBlocked ? 'Blocked' : 'Active';

    const rankClass = isAdmin ? 'rank-admin' : isOwner ? 'rank-owner' : 'rank-user';

    const statusClass = isBlocked ? 'status-blocked' : 'status-active';

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-container">
            <div className="left-section">
                <div className="author-info">
                    {profilePictureURL ? (
                        <img
                            src={profilePictureURL}
                            alt={`${author}'s profile`}
                            className="author-profile-picture"
                        />
                    ) : (
                        <div className="default-profile-picture">No Picture</div>
                    )}
                    <div className="author-details">
                        <p><strong>Username:</strong> <NavLink to={`/single-user/${author}`}>{author}</NavLink></p>
                        {/* <p><strong>First Name:</strong> {firstName}</p>
                        <p><strong>Last Name:</strong> {lastName}</p> */}
                        <p><strong>Rank:</strong> <span className={rankClass}>{rank}</span></p>
                        <p><strong>Status:</strong> <span className={statusClass}>{status}</span></p>
                        <p><strong>Join Date: {new Date(createdOn).toLocaleDateString()}</strong></p>
                    </div>
                </div>
            </div>
            <div className="right-section">
                <div className="post-content">
                    <h3>
                        <Link to={`/posts/${id}`}>{title}</Link>
                    </h3>
                    {content.length > 900 ? <p>{`${content.slice(0, 900)}...`}<NavLink to={`/posts/${id}`}>Click to read more</NavLink></p> : <p>{content}</p>}
                </div>
                <div className="post-info">
                    <p><strong>Posted:</strong> {new Date(createdOn).toLocaleString()}</p>
                    <p><strong>Likes:</strong> {likeCount}</p>
                    <p><strong>Comments:</strong> {commentsCounter}</p>
                </div>
            </div>
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
