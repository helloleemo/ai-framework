import { Link, Outlet } from 'react-router-dom';

function Page1() {
  return (
    <div>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
      <p className="text-blue-500">/Page1</p>
      <p>
        <Link to="/page-1/details">Go to details</Link>
      </p>
      <Outlet />
    </div>
  );
}

export default Page1;
