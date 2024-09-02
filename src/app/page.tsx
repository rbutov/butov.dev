export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1e1f22] text-[13px]">
      <pre className="whitespace-pre-wrap text-[#bcbec4]">
        <code>
          <span className="text-[#ce8e6d]">export const</span>
          <span className="text-[#c87dba]"> webDeveloper </span>
          {'= {'}
          <div className="whitespace-nowrap">
            <span className="ml-5 text-[#c87dba]">name</span>:
            <span className="text-[#6aab73]">
              {' '}
              &apos;Ruslan <span className="underline decoration-wavy">Butov</span>&apos;
            </span>
            ,
          </div>
          <div className="whitespace-nowrap">
            <span className="ml-5 text-[#c87dba]">location</span>:
            <span className="text-[#6aab73]"> &apos;San Jose, CA&apos;</span>,
          </div>
          <div>
            <span className="ml-5 text-[#c87dba]">position</span>:
            <span className="text-[#6aab73]"> &apos;Senior Software Engineer&apos;</span>,
          </div>
          <div className="whitespace-nowrap">
            <span className="ml-5 text-[#c87dba]">github</span>:
            <span className="text-[#6aab73]">
              {' '}
              &apos;
              <a href="https://github.com/rbutov" className="underline" target="_blank">
                https://github.com/rbutov
              </a>
              &apos;
            </span>
            ,
          </div>
          <div className="whitespace-nowrap">
            <span className="ml-5 text-[#c87dba]">linkedin</span>:
            <span className="text-[#6aab73]">
              {' '}
              &apos;
              <a href="https://www.linkedin.com/in/rbutov/" className="underline" target="_blank">
                https://linkedin.com/in/rbutov
              </a>
              &apos;
            </span>
          </div>
          {'}'}
        </code>
      </pre>
    </main>
  );
}
