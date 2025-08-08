export default function RightPanel() {
  return (
    <div className="absolute top-0 right-0 w-[340px] h-full bg-white p-4 border transition duration-300">
      <h1 className="text-xl font-bold mb-4">Right Panel</h1>
      <p className="text-gray-600 mb-4">
        This is the right panel where you can add additional controls or
        information.
      </p>
      <h2>Right Panel</h2>
      <div className="content">
        <p>Additional information or controls can go here.</p>
      </div>
    </div>
  );
}
