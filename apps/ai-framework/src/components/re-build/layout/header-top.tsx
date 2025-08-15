import { Link } from 'react-router-dom';

export default function HeaderTop() {
  return (
    <div className="top mb-1 flex items-center justify-between border-b pb-5">
      <Link to="/">
        <div className="logo">
          <img className="w-[120px]" src="logo.svg" alt="Logo" />
        </div>
      </Link>
    </div>
  );
}
