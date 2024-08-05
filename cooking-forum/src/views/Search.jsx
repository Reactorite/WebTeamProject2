import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllPosts } from "../services/posts.service";
import { getAllComments } from "../services/comments.service";

export default function Search() {
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

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <select value={type} onChange={handleTypeChange}>
        <option value="posts">Posts</option>
        <option value="comments">Comments</option>
      </select>
      <button onClick={handleSearch}>Search</button>

      <div>
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.id}>
              {type === 'posts' ? (
                <Link to={`/posts/${result.id}`}>
                  <h3>{result.title}</h3>
                </Link>
              ) : (
                <div>
                  <p>{result.content}</p>
                  <p>In post: <Link to={`/posts/${result.postId}`}>{result.postTitle}</Link></p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}
