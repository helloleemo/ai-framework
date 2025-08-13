import { CollapseIcon } from '../../icon/collapse-icon';

export default function HeaderTop() {
  return (
    <div className="top flex justify-between items-center mb-4 border-b pb-5">
      <div className="logo">
        <img className="w-[120px]" src="logo.svg" alt="Logo" />
      </div>
    </div>
  );
}
