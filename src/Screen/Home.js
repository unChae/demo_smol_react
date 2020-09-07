import React from 'react';
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="Home">
      <Link to={'/loginInstagram'}>instagram</Link>
    </div>
  );
}

export default Home;
