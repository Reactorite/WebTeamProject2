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
