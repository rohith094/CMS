import React, { useState } from "react";

const Academics = () => {
  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panelIndex) => {
    setOpenPanel((prevPanel) => (prevPanel === panelIndex ? null : panelIndex));
  };

  const data = {
    semesters: [
      {
        semester: 1,
        overallSGPA: 8.5,
        overallAttendence: 87,
        overallGrade: "A",
        subjects: [
          { name: "Mathematics I", marks: 85, grade: "A", credits: 4 },
          { name: "Physics", marks: 78, grade: "B+", credits: 3 },
          { name: "Chemistry", marks: 92, grade: "A", credits: 4 },
          { name: "Computer Science", marks: 88, grade: "A-", credits: 3 },
          { name: "English", marks: 80, grade: "B+", credits: 2 },
          { name: "Engineering Drawing", marks: 76, grade: "B", credits: 2 },
        ],
      },
      {
        semester: 2,
        overallSGPA: 8.7,
        overallAttendence: 89,
        overallGrade: "A",
        subjects: [
          { name: "Mathematics II", marks: 89, grade: "A", credits: 4 },
          { name: "Biology", marks: 82, grade: "B+", credits: 3 },
          { name: "Environmental Science", marks: 75, grade: "B", credits: 2 },
          { name: "Data Structures", marks: 90, grade: "A", credits: 4 },
          { name: "Economics", marks: 79, grade: "B+", credits: 3 },
          { name: "Statistics", marks: 85, grade: "A-", credits: 3 },
        ],
      },
      {
        semester: 3,
        overallSGPA: 8.6,
        overallAttendence: 97,
        overallGrade: "A",
        subjects: [
          { name: "Mathematics III", marks: 87, grade: "A", credits: 4 },
          { name: "Thermodynamics", marks: 74, grade: "B", credits: 3 },
          { name: "Electrical Engineering", marks: 91, grade: "A", credits: 4 },
          { name: "Algorithms", marks: 88, grade: "A-", credits: 4 },
          { name: "Psychology", marks: 80, grade: "B+", credits: 2 },
          { name: "Materials Science", marks: 77, grade: "B", credits: 3 },
        ],
      },
      {
        semester: 4,
        overallSGPA: 8.8,
        overallAttendence: 76,
        overallGrade: "A",
        subjects: [
          { name: "Linear Algebra", marks: 92, grade: "A", credits: 4 },
          { name: "Mechanics", marks: 81, grade: "B+", credits: 3 },
          { name: "Digital Electronics", marks: 89, grade: "A", credits: 4 },
          { name: "Operating Systems", marks: 87, grade: "A-", credits: 4 },
          { name: "Sociology", marks: 78, grade: "B", credits: 2 },
          { name: "Fluid Dynamics", marks: 84, grade: "B+", credits: 3 },
        ],
      },
      {
        semester: 5,
        overallSGPA: 8.9,
        overallAttendence: 93,
        overallGrade: "A",
        subjects: [
          { name: "Probability", marks: 90, grade: "A", credits: 3 },
          { name: "Control Systems", marks: 83, grade: "B+", credits: 4 },
          { name: "Microprocessors", marks: 88, grade: "A-", credits: 4 },
          { name: "Databases", marks: 92, grade: "A", credits: 4 },
          { name: "History", marks: 79, grade: "B+", credits: 2 },
          { name: "Network Theory", marks: 86, grade: "A-", credits: 3 },
        ],
      },
      {
        semester: 6,
        overallSGPA: 8.7,
        overallAttendence: 78,
        overallGrade: "A",
        subjects: [
          { name: "Numerical Methods", marks: 85, grade: "A-", credits: 4 },
          { name: "Signals and Systems", marks: 80, grade: "B+", credits: 4 },
          { name: "Machine Learning", marks: 93, grade: "A", credits: 3 },
          { name: "Web Development", marks: 87, grade: "A-", credits: 3 },
          { name: "Philosophy", marks: 78, grade: "B", credits: 2 },
          { name: "Electromagnetics", marks: 84, grade: "B+", credits: 4 },
        ],
      },
      {
        semester: 7,
        overallSGPA: 8.8,
        overallAttendence: 98,
        overallGrade: "A",
        subjects: [
          {
            name: "Artificial Intelligence",
            marks: 91,
            grade: "A",
            credits: 4,
          },
          { name: "Software Engineering", marks: 89, grade: "A-", credits: 4 },
          { name: "Cryptography", marks: 86, grade: "A-", credits: 3 },
          { name: "Robotics", marks: 92, grade: "A", credits: 4 },
          { name: "Political Science", marks: 80, grade: "B+", credits: 2 },
          { name: "Quantum Computing", marks: 88, grade: "A-", credits: 3 },
        ],
      },
    ],
  };

  return (
    <section className="w-[100%] h-[100vh] mt-12 sm:mt-0 md:mt-0 lg:mt-0 bg-plat border border-gray-300 p-2 px-4 rounded-tl-2xl sm:h-[100vh] md:h-[100vh] lg:h-[100vh] md:ml-2 rounded-tr-2xl sm:rounded-bl-2xl md:rounded-bl-2xl lg:rounded-bl-2xl lg:ml-2 sm:ml-2 overflow-x-hidden">
      <div className="my-6">
        <h1 className="text-3xl font-bold text-black">Academics</h1>
        <hr className="border border-d3" />
      </div>
      <div className="my-8 pb-8">
        <div id="accordion-open" data-accordion="open">
          {data.semesters.map((semesterData, index) => (
            <div key={index}>
              <h2 id={`accordion-open-heading-${index}`}>
                <button
                  type="button"
                  className="flex items-center justify-between bg-d4 w-full p-3 font-medium rtl:text-right text-white border border-d2 rounded-xl mb-2 gap-3"
                  onClick={() => togglePanel(index)}
                  aria-expanded={openPanel === index}
                  aria-controls={`accordion-open-body-${index}`}
                >
                  <span className="flex justify-start items-center">
                    Semester {semesterData.semester}
                  </span>
                  <svg
                    data-accordion-icon
                    className={`w-3 h-3 ${
                      openPanel === index ? "" : "rotate-180"
                    } shrink-0`}
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
                <div className="p-5 border border-b rounded-2xl border-plat mb-2 bg-plat1">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 border-b border-black text-d4 text-left">
                          Subject
                        </th>
                        <th className="px-1 py-2 border-b border-black text-d4 text-left">
                          Grade
                        </th>
                        <th className="px-1 py-2 border-b border-black text-d4 text-left">
                          Credits
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {semesterData.subjects.map((subject, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2 border-b border-black text-gray-900">
                            {subject.name}
                          </td>
                          <td className="px-2 py-2 border-b border-black text-gray-900">
                            {subject.grade}
                          </td>
                          <td className="px-2 py-2 border-b border-black text-gray-900">
                            {subject.credits}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="my-2">
                  <p className="text-d2 text-lg">
                      <strong>Overall Performance</strong>
                    </p>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-d4">
                      <strong>SGPA:</strong> {semesterData.overallSGPA}
                    </p>
                    <p className="text-d4">
                      <strong>Grade:</strong> {semesterData.overallGrade}
                    </p>
                    <p className="text-d4">
                      <strong>Attendence:</strong> {semesterData.overallAttendence}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Academics;