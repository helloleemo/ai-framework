const bottomMenu = [{ name: 'User' }, { name: 'Settings' }, { name: 'Logout' }];

export default function BottomMenu() {
  return (
    <div className="border-t p-2">
      {bottomMenu.map((item, index) => {
        return (
          <p key={index} className="text-sm text-gray-500 p-1">
            {item.name}
          </p>
        );
      })}
    </div>
  );
}
