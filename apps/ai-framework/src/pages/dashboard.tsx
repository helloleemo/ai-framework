import HeaderDashboard from '@/components/header-dashboard';
import { PlatformItem } from '@/types/platformsItems';
import { Link } from 'react-router-dom';

const platformItems: PlatformItem[] = [
  {
    title: 'AI Framework',
    tags: ['tag1', 'tag2'],

    content: 'Subtitle for AI Framework',
    description:
      'This is the description for AI Framework. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: 'login/dashboard-2.jpg',
    linkTo: '/ai-framework/artboard',
  },
  {
    title: 'Item 2',
    content: 'Subtitle for item 2',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: 'login/dashboard-1.png',
    linkTo: '/item2',
    tags: ['tag1', 'tag2'],
  },
  {
    title: 'Item 3',
    content: 'Subtitle for item 3',
    description: 'This is the description for item 3',
    image: 'https://picsum.photos/200/300?random=2',
    linkTo: '/item3',
    tags: ['tag1', 'tag2'],
  },
  {
    title: 'Item 4',
    content: 'Subtitle for item 4',
    description: 'This is the description for item 4',
    image: 'https://picsum.photos/200/300?random=3',
    linkTo: '/item4',
    tags: ['tag1', 'tag2'],
  },
  {
    title: 'Item 5',
    content: 'Subtitle for item 5',
    description: 'This is the description for item 5',
    image: 'https://picsum.photos/200/300?random=4',
    linkTo: '/item5',
    tags: ['tag1', 'tag2'],
  },
  {
    title: 'Item 6',
    content: 'Subtitle for item 6',
    description: 'This is the description for item 6',
    image: 'https://picsum.photos/200/300?random=5',
    linkTo: '/item6',
    tags: ['tag1', 'tag2'],
  },
];
export default function Dashboard() {
  return (
    <>
      <HeaderDashboard />
      <div className="dashboard bg-neutral-100 h-full pt-[50px]">
        <div className="grid grid-cols-1 gap-5 p-5 justify-items-center ">
          {platformItems.map((item, index) => (
            <Link
              to={item.linkTo}
              className="relative overflow-hidden flex justify-between items-center bg-white cursor-pointer rounded-lg hover:shadow-lg shadow-sm pl-5 w-2/3 h-[250px] transition-all duration-400 ease-in-out"
            >
              {/* left - text */}
              <div className="w-2/5">
                {item.tags &&
                  item.tags.map((tag) => {
                    return (
                      <span
                        key={tag}
                        className="text-xs bg-neutral-300 text-white px-3 py-1  rounded-full -ml-1 mr-3"
                      >
                        {tag}
                      </span>
                    );
                  })}
                <p className="text-lg font-bold text-neutral-800 py-1">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">{item.content}</p>
                <div className="border-b border-gray-200 my-2 w-2/3"></div>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              {/* right - imgs */}
              <div className="relative w-3/5 h-full flex items-center justify-end">
                <div className="absolute top-0 right-0 w-full h-full rounded-r-lg bg-gradient-to-r from-white via-white/40 to-transparent z-10" />
                <img
                  className="object-fit w-full relative z-0"
                  src={item.image}
                  alt=""
                />
              </div>
            </Link>
          ))}
        </div>
        <div className="text-xs text-gray-400 text-center pb-2 pt-10">
          © {new Date().getFullYear()} Delmind Inc. All rights reserved.
        </div>
      </div>
    </>
  );
}
