import { type FC } from 'react';
import Link from 'next/link';

const NotFound: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-96 bg-[#1e1f22] text-[#bcbec4] font-mono">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link 
        href="/" 
        className="border border-[#bcbec4] text-[#bcbec4] py-2 px-4 rounded hover:bg-[#bcbec4] hover:text-[#1e1f22] transition duration-300"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;