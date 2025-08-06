import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <p className="text-blue-500">/home</p>
      <Link to="artboard">
        <p>Go to Menu</p>
      </Link>
    </>
  );
}

export default Home;
