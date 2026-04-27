export const metadata = {
  title: "About",
  description: "About Christian Joseph: Data Science student, analyst, and builder.",
};


export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16" style={{ fontFamily: "'Roboto Mono', monospace" }}>

      {/* Bio */}
      <section className="mb-14">
        <h1 className="text-2xl font-bold mb-6">About</h1>
        <div className="flex flex-col gap-4 text-neutral-900 leading-relaxed">
          <p>
            Hi, I'm Christian. I build production tools, analyze data and like to use AI to help bring things to life. 
          </p>
          <p>
            My background started in Information Systems Cyber Security and Information Assurance at UNC Greensboro, with additional coursework in psychology research covering behavioral analysis, experiments, surveys, and case studies. I built a foundation in both systems thinking and human behavior before switching to data science at UNC Charlotte.
          </p>
        </div>
      </section>

      {/* Education */}
      <section className="mb-14">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-6">
          education
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">University of North Carolina at Charlotte</p>
                <p className="text-sm text-neutral-800">
                  B.S. in Data Science
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">University of North Carolina at Greensboro</p>
                <p className="text-sm text-neutral-800">
                  Information Systems: Cyber Security & Information Assurance; Psychology Research
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section className="mb-14">
        <h2 className="inline-block font-mono text-xs px-2.5 py-1 rounded border border-neutral-200 bg-neutral-100 text-neutral-700 mb-6">
          work experience
        </h2>
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="font-semibold">Dick&apos;s Sporting Goods, Going Going Gone</p>
              <p className="text-sm text-neutral-700">Charlotte, NC</p>
            </div>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-neutral-900">
            <li className="flex gap-2">
              <span className="text-neutral-600 mt-0.5">-</span>
              Keep daily stock operations running: accurate product placement and an
              organized floor that makes it easy for customers to find what they need.
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600 mt-0.5">-</span>
              Help customers find the right gear and give recommendations they come back for.
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600 mt-0.5">-</span>
              Reorganized displays and restocking routines to cut downtime and keep the floor moving.
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600 mt-0.5">-</span>
              Helped new team members get settled and up to speed during onboarding.
            </li>
            <li className="flex gap-2">
              <span className="text-neutral-600 mt-0.5">-</span>
              Hit daily and weekly sales targets through product knowledge and good customer service.
            </li>
          </ul>
        </div>
      </section>

    </main>
  );
}
