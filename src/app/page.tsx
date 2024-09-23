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
        <span className="absolute left-0 top-[-1px] h-4 w-[0.6em] animate-blink bg-[#ced0d6]"></span>
        <span className="color-white relative animate-blinkReverse">{'}'}</span>
      </span>
    </code>
  );
}
