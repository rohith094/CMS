import React, { useState } from "react";

const Attendance = () => {


  const data = {
    semesters: [
      {
        semester: 1,
        subjects: [
          { name: "Mathematics I", classesHeld: 48, classesAttended: 44 },
          { name: "Physics", classesHeld: 48, classesAttended: 40 },
          { name: "Chemistry", classesHeld: 48, classesAttended: 45 },
          { name: "Computer Science", classesHeld: 48, classesAttended: 42 },
          { name: "English", classesHeld: 48, classesAttended: 38 },
          { name: "Engineering Drawing", classesHeld: 48, classesAttended: 39 },
        ],
      },
      {
        semester: 2,
        subjects: [
          { name: "Mathematics II", classesHeld: 48, classesAttended: 45 },
          { name: "Biology", classesHeld: 48, classesAttended: 41 },
          { name: "Environmental Science", classesHeld: 48, classesAttended: 43 },
          { name: "Data Structures", classesHeld: 48, classesAttended: 46 },
          { name: "Economics", classesHeld: 48, classesAttended: 39 },
          { name: "Statistics", classesHeld: 48, classesAttended: 44 },
        ],
      },
      {
        semester: 3,
        subjects: [
          { name: "Mathematics III", classesHeld: 48, classesAttended: 43 },
          { name: "Thermodynamics", classesHeld: 48, classesAttended: 39 },
          { name: "Electrical Engineering", classesHeld: 48, classesAttended: 46 },
          { name: "Algorithms", classesHeld: 48, classesAttended: 44 },
          { name: "Psychology", classesHeld: 48, classesAttended: 42 },
          { name: "Materials Science", classesHeld: 48, classesAttended: 40 },
        ],
      },
      {
        semester: 4,
        subjects: [
          { name: "Linear Algebra", classesHeld: 48, classesAttended: 47 },
          { name: "Mechanics", classesHeld: 48, classesAttended: 40 },
          { name: "Digital Electronics", classesHeld: 48, classesAttended: 44 },
          { name: "Operating Systems", classesHeld: 48, classesAttended: 45 },
          { name: "Sociology", classesHeld: 48, classesAttended: 38 },
          { name: "Fluid Dynamics", classesHeld: 48, classesAttended: 42 },
        ],
      },
      {
        semester: 5,
        subjects: [
          { name: "Probability", classesHeld: 48, classesAttended: 46 },
          { name: "Control Systems", classesHeld: 48, classesAttended: 43 },
          { name: "Microprocessors", classesHeld: 48, classesAttended: 44 },
          { name: "Databases", classesHeld: 48, classesAttended: 48 },
          { name: "History", classesHeld: 48, classesAttended: 41 },
          { name: "Network Theory", classesHeld: 48, classesAttended: 42 },
        ],
      },
      {
        semester: 6,
        subjects: [
          { name: "Numerical Methods", classesHeld: 48, classesAttended: 44 },
          { name: "Signals and Systems", classesHeld: 48, classesAttended: 42 },
          { name: "Machine Learning", classesHeld: 48, classesAttended: 47 },
          { name: "Web Development", classesHeld: 48, classesAttended: 45 },
          { name: "Philosophy", classesHeld: 48, classesAttended: 40 },
          { name: "Electromagnetics", classesHeld: 48, classesAttended: 43 },
        ],
      },
      {
        semester: 7,
        subjects: [
          { name: "Artificial Intelligence", classesHeld: 48, classesAttended: 46 },
          { name: "Software Engineering", classesHeld: 48, classesAttended: 43 },
          { name: "Cryptography", classesHeld: 48, classesAttended: 44 },
          { name: "Robotics", classesHeld: 48, classesAttended: 47 },
          { name: "Political Science", classesHeld: 48, classesAttended: 41 },
          { name: "Quantum Computing", classesHeld: 48, classesAttended: 45 },
        ],
      },
    ],
  };
  


  const [openPanel, setOpenPanel] = useState(null);

  const togglePanel = (panelIndex) => {
    setOpenPanel((prevPanel) => (prevPanel === panelIndex ? null : panelIndex));
  };

  const calculateAttendancePercentage = (classesHeld, classesAttended) => {
    return ((classesAttended / classesHeld) * 100).toFixed(2);
  };

  return (
    <section className="w-[100%] h-[100vh] mt-12 sm:mt-0 md:mt-0 lg:mt-0 bg-plat border border-gray-300 p-2 px-4 rounded-tl-2xl sm:h-[100vh] md:h-[100vh] lg:h-[100vh] md:ml-2 rounded-tr-2xl sm:rounded-bl-2xl md:rounded-bl-2xl lg:rounded-bl-2xl lg:ml-2 sm:ml-2 overflow-x-hidden">
      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Attendance</h1>
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
                          Held
                        </th>
                        <th className="px-1 sm:px-2 py-2 border-b border-black text-d4 text-left">
                          Attended
                        </th>
                        <th className="px-1 sm:px-2 py-2 border-b border-black text-d4 text-left">
                          Attend.. %
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
                            {subject.classesHeld}
                          </td>
                          <td className="px-1 sm:px-2 py-2 border-b border-black text-gray-900">
                            {subject.classesAttended}
                          </td>
                          <td className="px-1 sm:px-2 py-2 border-b border-black text-gray-900">
                            {calculateAttendancePercentage(subject.classesHeld, subject.classesAttended)}%
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

export default Attendance;