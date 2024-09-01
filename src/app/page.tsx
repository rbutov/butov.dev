export default function HomePage() {
  return (
    <main className="bg-[#1e1f22] min-h-screen flex items-center justify-center text-[13px]">
      <pre className="whitespace-pre-wrap text-[#bcbec4]">
        <code>
          <span className="text-[#ce8e6d]">export const</span>
          <span className="text-[#c87dba]"> webDeveloper </span>
          {'= {'}
          <div className="whitespace-nowrap">
            <span className="text-[#c87dba] ml-5">name</span>:
            <span className="text-[#6aab73]">
              {' '}
              &apos;Ruslan <span className="underline decoration-wavy">Butov</span>&apos;
            </span>
            ,
          </div>
          <div className="whitespace-nowrap">
            <span className="text-[#c87dba] ml-5">age</span>:
            <span className="text-[#6aab73]"> &apos;34&apos;</span>,
          </div>
          <div className="whitespace-nowrap">
            <span className="text-[#c87dba] ml-5">location</span>:
            <span className="text-[#6aab73]"> &apos;San Jose, CA&apos;</span>,
          </div>
          <div>
            <span className="text-[#c87dba] ml-5">position</span>:
            <span className="text-[#6aab73]"> &apos;Senior Software Engineer&apos;</span>,
          </div>
          <div className="whitespace-nowrap">
            <span className="text-[#c87dba] ml-5">github</span>:
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
            <span className="text-[#c87dba] ml-5">linkedin</span>:
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
