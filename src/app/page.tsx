import Link from 'next/link';

const developerInfo = [
  { key: 'name', value: 'Ruslan Butov', special: 'underline' },
  { key: 'location', value: 'San Jose, CA' },
  { key: 'position', value: 'Senior Software Engineer' },
  { key: 'github', value: 'https://github.com/rbutov', link: true },
  { key: 'linkedin', value: 'https://linkedin.com/in/rbutov', link: true },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#3c3c3c] font-mono text-[11px] sm:text-[13px]">
      <pre className="overflow-hidden whitespace-pre-wrap rounded-lg bg-[#1e1f22] text-[#bcbec4] shadow-lg">
        <div className="relative w-full">
          <div className="flex h-8 items-center justify-between rounded-t-lg bg-[#2b2d30] px-2 text-[#bbbbbb]">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-[#787979]"></div>
              <div className="h-3 w-3 rounded-full bg-[#787979]"></div>
              <div className="h-3 w-3 rounded-full bg-[#787979]"></div>
              <div className="ml-2 text-xs font-medium"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-pulse rounded-sm bg-[#787979]"></div>
              <div className="h-4 w-4 animate-pulse rounded-sm bg-[#787979] delay-150"></div>
              <div className="h-4 w-4 animate-pulse rounded-sm bg-[#787979] delay-300"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <code>
            <span className="text-[#ce8e6d]">export const</span>
            <span className="text-[#c87dba]"> webDeveloper </span>
            {'= {'}
            {developerInfo.map(({ key, value, special, link }) => (
              <div key={key} className="ml-4 whitespace-nowrap">
                <span className="text-[#c87dba]">{key}</span>:{' '}
                <span className="text-[#6aab73]">
                  &apos;
                  {link ? (
                    <Link
                      href={value}
                      className="underline hover:text-[#8adb93]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {value}
                    </Link>
                  ) : special === 'underline' ? (
                    <>
                      Ruslan <span className="underline decoration-wavy">Butov</span>
                    </>
                  ) : (
                    value
                  )}
                  &apos;
                </span>
                ,
              </div>
            ))}
            <span className="relative">
              <span className="animate-blink absolute left-0 top-[-1px] h-4 w-[0.6em] bg-[#ced0d6]"></span>
              <span className="animate-blinkReverse color-white relative">{'}'}</span>
            </span>
          </code>
        </div>
      </pre>
    </main>
  );
}
