import React from "react";

import axios from 'axios';
const FeedbackForm = () => {
  const [feedback, setFeedback] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  // const handleSubmit = aync(req,res) => {
  //   e.preventDefault();
  //   // if (feedback.trim()) {
  //   //   setSubmitted(true);
  //   // }

  // };
  const token = 
  const handleSubmit = async (req, res)=>{
    try{
      const response = await axios.post('http://localhost:3000/student/feedback', {
        fmessage : feedback,
      },{
        headers: {
          'Authorization': `${token}`
        }
      })

    }catch(error){

    }
  }

  return (
    <section className="w-[100%] h-[100vh] mt-12 sm:mt-0 md:mt-0 lg:mt-0 bg-plat border border-gray-300 p-2 px-4 rounded-tl-2xl sm:h-[100vh] md:h-[100vh] lg:h-[100vh] md:ml-2 rounded-tr-2xl sm:rounded-bl-2xl md:rounded-bl-2xl lg:rounded-bl-2xl lg:ml-2 sm:ml-2 overflow-x-hidden">
      <div className="my-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Feedback Form</h1>
        <div className="relative my-2">
          <hr className="absolute inset-0 border-none h-[1px] bg-gradient-to-r from-d3 via-d0 to-transparent" />
        </div>
      </div>
      <div className="my-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="6"
              placeholder="Your feedback here..."
              className="w-full p-4 border sm:w-[60vw] md:w-[60vw] lg:w-[60vw]  border-gray-400 rounded-xl bg-neutral-300 text-gray-900 resize-none focus:border-d4 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-d4 sm:w-[60vw] md:w-[60vw] lg:w-[60vw] text-white font-medium rounded-full hover:bg-d3 focus:outline-none focus:ring-2 focus:ring-d4"
          >
            Submit Feedback
          </button>
        </form>
        {submitted && (
          <div className="mt-4 text-green-600">
            <p>Thank you for your feedback!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackForm;
