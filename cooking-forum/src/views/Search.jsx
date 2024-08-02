import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllPosts } from "../services/posts.service";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  const [searchTerm, setSearchTerm] = useState(search);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    setSearchParams({ search: searchTerm });
    const posts = await getAllPosts(searchTerm);
    setResults(posts);
    setSearchTerm(''); 
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..."/>
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.id}>
              <Link to={`/posts/${result.id}`}>
                <h3>{result.title}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}
