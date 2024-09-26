import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

const PolicyAndTerms = () => {
  return (
    <>
      <Header />
      <section className="text-gray-700 body-font bg-gradient-to-br from-pink-100 to-blue-100">
        <div className="container mx-auto p-6 lg:p-24">
          <h1 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-900">Policy & Terms</h1>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">1. Privacy Policy</h2>
            <p className="mb-4">
              We are committed to protecting your personal information. All personal information provided by you will be stored and kept confidential according to the law.
            </p>
            <p className="mb-4">
              We will not share your personal information with any third party without your consent or unless required by law.
            </p>
            <p>
              Your information will only be used to improve our services and support better customer service.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">2. Terms of Use</h2>
            <p className="mb-4">
              By using our services, you agree to the following terms and conditions:
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Do not use our services for any illegal activities.</li>
              <li>Do not interfere with the operation of the system or attempt to access the system unauthorized.</li>
              <li>Provide accurate and complete information when registering and using the service.</li>
            </ul>
            <p>
              We reserve the right to discontinue service or restrict your access if you violate these terms.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">3. Return Policy</h2>
            <p className="mb-4">
              We accept returns within 7 days of receipt, provided the product is intact, unused, and in its original packaging.
            </p>
            <p className="mb-4">
              To request a return, please contact our customer service department via email or phone provided on our website.
            </p>
            <p>
              Return shipping costs will be borne by the customer, except in cases of product defects from our side.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">4. Shipping Policy</h2>
            <p className="mb-4">
              We offer nationwide shipping. Estimated delivery time is 3-7 business days, depending on the shipping address.
            </p>
            <p className="mb-4">
              Shipping fees are calculated based on the weight of the order and the shipping address.
            </p>
            <p>
              We will notify you of any delays in the shipping process.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about our policies and terms, please contact us via email at: baockse172296@fpt.edu.vn or phone: 0335 418 118.
            </p>
            <p>
              Office address: Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PolicyAndTerms;
