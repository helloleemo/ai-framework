import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <p className="text-blue-500">/home</p>
      <Link to="/page-1">
        <p>Go to Page 1</p>
      </Link>
    </>
  );
}

export default Home;
