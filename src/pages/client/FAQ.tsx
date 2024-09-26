import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

const FaqPage = () => {
  const faqData = [
    {
      question: 'What is MilkForMomAndBabies?',
      answer: 'MilkForMomAndBabies is an e-commerce system specializing in providing milk products for pregnant mothers and babies. The platform helps users easily search, and purchase milk products suitable for their needs.',
    },
    {
      question: 'How do I create an account on MilkForMomAndBabies?',
      answer: 'To create an account, simply click the "Sign Up" button on the homepage, fill in the necessary personal information, and verify via email. Once confirmed, you can log in and use all the platform\'s features.',
    },
    {
      question: 'How do I search for the right milk products?',
      answer: 'You can use the search bar on the homepage to enter the product name or use filters such as age range and price to find products that meet your needs.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept payments via VnPay, COD. All payment transactions are secured to ensure your information is safe.',
    },
    {
      question: 'How do I track my order?',
      answer: 'After placing an order, you will receive a status in order history.',
    },
    {
      question: 'What is the return policy of MilkForMomAndBabies?',
      answer: 'We offer a 30-day return policy from the date of receipt. Products must be intact, unused, and with the original purchase receipt. Please contact our customer service for detailed instructions.',
    },
    {
      question: 'Does MilkForMomAndBabies have a loyalty program?',
      answer: 'Yes, we have a loyalty program. When you purchase and accumulate reward points, you can use these points for discounts on future purchases. Details about the program will be updated on our website.',
    },
    {
      question: 'Is my personal information secure with MilkForMomAndBabies?',
      answer: 'We are committed to protecting your personal information. All personal data is encrypted and stored securely. We do not share your information with third parties without your consent.',
    },
    {
      question: 'Can I cancel my order after placing it?',
      answer: 'Yes, you can cancel your order within 24 hours of placing it and status is pending. Please contact customer service with your order details for assistance with the cancellation.',
    },
    {
      question: 'How do I contact customer service?',
      answer: 'You can contact customer service via email at baockse172296@fpt.edu.vn or call our hotline number 0355418118.',
    },
    {
      question: 'What is the minimum order value for free shipping?',
      answer: 'We offer free shipping on orders with a total value of 30,000 VND or more.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only offer shipping within the Viet Nam. We are working on expanding our shipping capabilities in the future.',
    },
    {
      question: 'How can I apply a discount code to my order?',
      answer: 'You can apply a discount code during the checkout process. Simply enter the code in the designated field and click "Apply".',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <>
      <Header />
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <div className="max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md mb-4">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left py-4 px-6 text-lg font-semibold focus:outline-none"
                >
                  {faq.question}
                  <span className="float-right">{openIndex === index ? '-' : '+'}</span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-800">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer  />
    </>
  );
};

export default FaqPage;
