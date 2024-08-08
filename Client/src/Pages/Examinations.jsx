import React, { useState } from "react";

const Examinations = () => {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panelIndex) => {
    setOpenPanel((prevPanel) => (prevPanel === panelIndex ? null : panelIndex));
  };

  const calculateGrade = (points) => {
    if (points >= 9) return "A+";
    if (points >= 8) return "A";
    if (points >= 7) return "B+";
    if (points >= 6) return "B";
    if (points >= 5) return "C";
    return "F";
  };

  const data = {
    semesters: [
      {
        semester: 1,
        subjects: [
          { name: "Mathematics I", internal: 28, points: 9 },
          { name: "Physics", internal: 22, points: 7.7 },
          { name: "Chemistry", internal: 25, points: 9.3 },
          { name: "Computer Science", internal: 26, points: 8.6 },
          { name: "English", internal: 24, points: 8.0 },
          { name: "Engineering Drawing", internal: 21, points: 7.1 },
        ],
      },
      {
        semester: 2,
        subjects: [
          { name: "Mathematics II", internal: 27, points: 8.7 },
          { name: "Biology", internal: 23, points: 7.7 },
          { name: "Environmental Science", internal: 24, points: 7.4 },
          { name: "Data Structures", internal: 29, points: 9.0 },
          { name: "Economics", internal: 24, points: 7.9 },
          { name: "Statistics", internal: 26, points: 8.4 },
        ],
      },
      {
        semester: 3,
        subjects: [
          { name: "Mathematics III", internal: 26, points: 8.6 },
          { name: "Thermodynamics", internal: 20, points: 7.0 },
          { name: "Electrical Engineering", internal: 28, points: 9.2 },
          { name: "Algorithms", internal: 27, points: 8.5 },
          { name: "Psychology", internal: 22, points: 7.7 },
          { name: "Materials Science", internal: 23, points: 7.5 },
        ],
      },
      {
        semester: 4,
        subjects: [
          { name: "Linear Algebra", internal: 29, points: 9.3 },
          { name: "Mechanics", internal: 23, points: 7.8 },
          { name: "Digital Electronics", internal: 28, points: 8.8 },
          { name: "Operating Systems", internal: 27, points: 8.5 },
          { name: "Sociology", internal: 22, points: 7.4 },
          { name: "Fluid Dynamics", internal: 25, points: 8.1 },
        ],
      },
      {
        semester: 5,
        subjects: [
          { name: "Probability", internal: 27, points: 8.7 },
          { name: "Control Systems", internal: 24, points: 8.0 },
          { name: "Microprocessors", internal: 26, points: 8.6 },
          { name: "Databases", internal: 28, points: 9.2 },
          { name: "History", internal: 22, points: 7.6 },
          { name: "Network Theory", internal: 25, points: 8.3 },
        ],
      },
      {
        semester: 6,
        subjects: [
          { name: "Numerical Methods", internal: 26, points: 8.4 },
          { name: "Signals and Systems", internal: 24, points: 7.6 },
          { name: "Machine Learning", internal: 29, points: 9.3 },
          { name: "Web Development", internal: 27, points: 8.7 },
          { name: "Philosophy", internal: 22, points: 7.4 },
          { name: "Electromagnetics", internal: 25, points: 8.1 },
        ],
      },
      {
        semester: 7,
        subjects: [
          {
            name: "Artificial Intelligence",
            internal: 28,
            points: 9.2,
          },
          { name: "Software Engineering", internal: 27, points: 8.5 },
          { name: "Cryptography", internal: 26, points: 8.2 },
          { name: "Robotics", internal: 29, points: 9.2 },
          { name: "Political Science", internal: 24, points: 7.8 },
          { name: "Quantum Computing", internal: 27, points: 8.6 },
        ],
      },
    ],
  };

  return (
    <section className="w-[100%] h-[100vh] mt-12 sm:mt-0 md:mt-0 lg:mt-0 bg-plat border border-gray-300 p-2 px-4 rounded-tl-2xl sm:h-[100vh] md:h-[100vh] lg:h-[100vh] md:ml-2 rounded-tr-2xl sm:rounded-bl-2xl md:rounded-bl-2xl lg:rounded-bl-2xl lg:ml-2 sm:ml-2 overflow-x-hidden">
    <div className="my-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-black">Examinations</h1>
      <hr className="border border-d3" />
    </div>
    <div className="my-8 pb-8">
      <div id="accordion-open" data-accordion="open">
        {data.semesters.map((semesterData, index) => (
          <div key={index}>
            <h2 id={`accordion-open-heading-${index}`}>
              <button
                type="button"
                className="flex items-center justify-between bg-d4 w-full p-3 sm:p-3 font-medium rtl:text-right text-white border border-d2 rounded-xl mb-2 gap-2 sm:gap-3"
                onClick={() => togglePanel(index)}
                aria-expanded={openPanel === index}
                aria-controls={`accordion-open-body-${index}`}
              >
                <span className="flex justify-start items-center">
                  Semester {semesterData.semester}
                </span>
                <svg
                  data-accordion-icon
                  className={`w-3 h-3 ${openPanel === index ? "" : "rotate-180"} shrink-0`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5 5 1 1 5"
                  />
                </svg>
              </button>
            </h2>
            <div
              id={`accordion-open-body-${index}`}
              className={`${openPanel === index ? "block" : "hidden"}`}
              aria-labelledby={`accordion-open-heading-${index}`}
            >
              <div className="p-4 sm:p-5 border border-b rounded-2xl border-plat mb-2 border-gray-400 bg-plat1">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-2 sm:px-4 py-2 border-b border-black text-d4 text-left">
                        Subject
                      </th>
                      <th className="px-1 sm:px-2 py-2 border-b border-black text-d4 text-left">
                        Internal<br/>Marks
                      </th>
                      <th className="px-1 sm:px-2 py-2 border-b border-black text-d4 text-left">
                        Points
                      </th>
                      <th className="px-1 sm:px-2 py-2 border-b border-black text-d4 text-left">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {semesterData.subjects.map((subject, idx) => (
                      <tr key={idx}>
                        <td className="px-2 sm:px-4 py-2 border-b border-black text-gray-900 truncate max-w-[100px] sm:max-w-[none]">
                          {subject.name}
                        </td>
                        <td className="px-1 sm:px-2 py-2 border-b border-black text-gray-900">
                          {subject.internal}
                        </td>
                        <td className="px-1 sm:px-2 py-2 border-b border-black text-gray-900">
                          {subject.points}
                        </td>
                        <td className="px-1 sm:px-2 py-2 border-b border-black text-gray-900">
                          {calculateGrade(subject.points)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  

  );
};

export default Examinations;
