import React from "react";
import { useNavigate } from "react-router-dom";
import acc from '../Assets/acc.png'
import del from '../Assets/del.png'

const Placements = () => {
  const navigate = useNavigate();

  const handleApplyClick = (companyId) => {
    navigate(`/placements`);
  };

  const companies = [
    {
      id: 1,
      logo: acc,
      name: "Accenture",
      details: "Accenture is a leading firm in the tech industry offering innovative solutions."
    },
    {
      id: 2,
      logo: del,
      name: "Delta X",
      details: "Delta X specializes in software development and IT services."
    },
    // Add more companies as needed
  ];

  return (
    <section className="w-[100%] h-[100vh] my-12 py-6 sm:py-2 md:py-2 lg:py-2 sm:my-0 md:my-0 lg:my-0 bg-plat border border-gray-300 px-4 rounded-tl-2xl sm:h-[100vh] md:h-[100vh] lg:h-[100vh] md:ml-2 rounded-tr-2xl sm:rounded-bl-2xl md:rounded-bl-2xl lg:rounded-bl-2xl lg:ml-2 sm:ml-2 overflow-x-hidden">
      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Placement Opportunities</h1>
        <hr className="border border-d3" />
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div key={company.id} className="p-4 bg-plat1 border border-d2 rounded-xl shadow-md">
            <div className="flex w-[85%] px-2 items-center gap-4">
            <img src={company.logo} alt={`${company.name} Logo`} className="w-24 h-24 rounded-full mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-d4">{company.name}</h2>
            </div>
            <p className="text-gray-700 mt-2">{company.details}</p>
            <button
              onClick={() => handleApplyClick(company.id)}
              className="mt-4 w-full py-2 bg-d4 text-white font-semibold rounded-full shadow-md hover:bg-d3"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Placements;
