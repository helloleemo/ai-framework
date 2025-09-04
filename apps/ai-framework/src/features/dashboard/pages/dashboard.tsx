import HeaderDashboard from '../components/header-dashboard';
// import { useAuthGuard } from '@/hooks/use-auth';
import { PlatformItem } from '@/shared/types/platformsItems';
import { Link } from 'react-router-dom';

const platformItems: PlatformItem[] = [
  {
    title: 'AI Framework',
    tags: ['tag1', 'tag2'],

    content: 'Subtitle for AI Framework',
    description:
      'This is the description for AI Framework. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: 'login/dashboard-2.jpg',
    linkTo: '/ai-framework/menu',
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
  // useAuthGuard();
  return (
    <>
      <HeaderDashboard />
      <div className="dashboard h-full bg-neutral-100 pt-[50px]">
        <div className="grid grid-cols-1 justify-items-center gap-5 p-5">
          {platformItems.map((item, index) => (
            <Link
              to={item.linkTo}
              key={index}
              className="relative flex h-[250px] w-2/3 cursor-pointer items-center justify-between overflow-hidden rounded-lg bg-white pl-5 shadow-sm transition-all duration-400 ease-in-out hover:shadow-lg"
            >
              {/* left - text */}
              <div className="w-2/5">
                {item.tags &&
                  item.tags.map((tag) => {
                    return (
                      <span
                        key={tag}
                        className="mr-3 -ml-1 rounded-full bg-neutral-300 px-3 py-1 text-xs text-white"
                      >
                        {tag}
                      </span>
                    );
                  })}
                <p className="py-1 text-lg font-bold text-neutral-800">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">{item.content}</p>
                <div className="my-2 w-2/3 border-b border-gray-200"></div>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              {/* right - imgs */}
              <div className="relative flex h-full w-3/5 items-center justify-end">
                <div className="absolute top-0 right-0 z-10 h-full w-full rounded-r-lg bg-gradient-to-r from-white via-white/40 to-transparent" />
                <img
                  className="object-fit relative z-0 w-full"
                  src={item.image}
                  alt=""
                />
              </div>
            </Link>
          ))}
        </div>
        <div className="pt-10 pb-2 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Delmind Inc. All rights reserved.
        </div>
      </div>
    </>
  );
}
