import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

const ContactPage = () => {
  return (
    <>
      <Header />
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <p className="mb-2">If you have any issues regarding your purchase or any inquiries, please contact us at the address below:</p>
              <p className="mb-2">Email: <a href="mailto:baockse172296@fpt.edu.vn">baockse172296@fpt.edu.vn</a></p>
              <p className="mb-2">Phone: <a href="tel:+84355418118">0355 418 118</a></p>
              <p className="mb-2">Address: Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh</p>
              <p className="mb-2">Additional Email Addresses:</p>
              <ul className="list-disc list-inside">
                <li><a href="mailto:phatnttse184119@fpt.edu.vn">phatnttse184119@fpt.edu.vn</a></li>
                <li><a href="mailto:truongcpse172819@fpt.edu.vn">truongcpse172819@fpt.edu.vn</a></li>
                <li><a href="mailto:hungpvse172005@fpt.edu.vn">hungpvse172005@fpt.edu.vn</a></li>
                <li><a href="mailto:kocamxuc818@gmail.com">kocamxuc818@gmail.com</a></li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4 px-6 pt-6">Location</h2>
              <div className="relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15674.440041588125!2d106.809883!3d10.8411276!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgVFAuIEhDTQ!5e0!3m2!1svi!2s!4v1720306452464!5m2!1svi!2s"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Google Map"
                  className="rounded-t-lg"
                ></iframe>
                <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-75 p-4">
                  <p className="text-center text-gray-600 text-sm">Click on the map to explore</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ContactPage;
