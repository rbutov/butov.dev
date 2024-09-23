import { type FC } from 'react';
import Link from 'next/link';

const NotFound: FC = () => {
  return (
    <div className="flex w-96 flex-col items-center justify-center bg-[#1e1f22] font-mono text-[#bcbec4]">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-8 text-xl">Page not found</p>
      <Link
        href="/"
        className="rounded border border-[#bcbec4] px-4 py-2 text-[#bcbec4] transition duration-300 hover:bg-[#bcbec4] hover:text-[#1e1f22]"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
