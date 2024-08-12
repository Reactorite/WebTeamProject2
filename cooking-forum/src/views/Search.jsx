import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllPosts } from "../services/posts.service";
import { getAllComments } from "../services/comments.service";
import { AppContext } from "../state/app.context";
import { getAllUsers } from "../services/users.service";
import './Styles/Search.css'; 

export default function Search() {
  const { isAdmin, isOwner } = useContext(AppContext); 
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const searchType = searchParams.get('type') ?? 'posts';

  const [searchTerm, setSearchTerm] = useState(search);
  const [type, setType] = useState(searchType);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setSearchTerm(''); 
    setResults([]);
  }, [searchType, searchParams]);

  const handleSearch = async () => {
    setSearchParams({ search: searchTerm, type });

    let fetchedResults = [];
    if (type === 'posts') {
      fetchedResults = await getAllPosts(searchTerm);
    } else if (type === 'comments') {
      const posts = await getAllPosts('');
      let allComments = [];
      await Promise.all(posts.map(async post => {
        const comments = await getAllComments(post.id);
        allComments = allComments.concat(
          comments.map(comment => ({
            ...comment,
            postId: post.id,
            postTitle: post.title
          }))
        );
      }));
      fetchedResults = allComments.filter(comment =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (type === 'users' && (isAdmin || isOwner)) {
      const users = await getAllUsers();
      fetchedResults = users.filter(user =>
        (user.handle && user.handle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setResults(fetchedResults);
    setSearchTerm(''); 
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setSearchParams({ search: '', type: newType }); 
    setResults([]); 
  };

  const handleClear = () => {
    setSearchTerm('');
    setType('posts');
    setSearchParams({ search: '', type: 'posts' });
    setResults([]);
  };

  return (
    <div className="search-container">
      <div className="search-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <select value={type} onChange={handleTypeChange} className="search-selector">
          <option value="posts">Posts</option>
          <option value="comments">Comments</option>
          {(isAdmin || isOwner) && <option value="users">Users</option>}
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClear} className="clear-button">Clear</button>
      </div>

      <div className="search-results-container">
        <div className="search-results">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id || result.uid || result.email}>
                {type === 'posts' ? (
                  <Link to={`/posts/${result.id}`}>
                    <h3>{result.title}</h3>
                  </Link>
                ) : type === 'comments' ? (
                  <div>
                    <p>{result.content}</p>
                    <p>In post: <Link to={`/posts/${result.postId}`}>{result.postTitle}</Link></p>
                  </div>
                ) : type === 'users' ? (
                  <div>
                    <p>Username: <Link to={`/single-user/${result.handle}`}>{result.handle}</Link></p>
                    <p>Email: {result.email}</p>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
}
