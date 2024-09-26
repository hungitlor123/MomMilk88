import React from 'react';
// import FeedbackForm from './FeedbackForm';
import { FaStar, FaUser } from 'react-icons/fa';

type FeedbackProps = {
  productId?: string;
  feedbacks?: Array<{
    message: string;
    star: number;
    customer: {
      name: string;
    };
  }>;
};

const Feedback: React.FC<FeedbackProps> = ({ feedbacks }) => { //theem productId vao trong FeedbackProps de chay form
  return (
    <div className="container mx-auto">
      {/* <h4 className="text-gray-900 text-3xl title-font font-medium mb-1">Feedback</h4> */}
      <div className="flex flex-row">
        <div className="mt-5 flex">
          {/* <FeedbackForm productId={productId} /> */}
        </div>
        <div className="ml-56 mt-5">
          <span className="text-2xl font-bold">Reviews</span>
          <div className="mt-4">
            {feedbacks && feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-4 flex gap-4 min-w-[700px] border-black border mb-4">
                  <FaUser className="text-2xl text-gray-700" />
                  <div className="flex flex-col justify-center">
                    <div className="mb-2">
                      <span className="text-lg font-semibold block">{feedback.customer.name}</span>
                      <div className="flex items-center text-xl gap-1">
                        {[...Array(feedback.star)].map((_, index) => (
                          <FaStar key={index} size={24} color="#ffd700" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">{feedback.message}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No feedback available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;