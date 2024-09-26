import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const ThankYou = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3); 

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/home");
        }, countdown * 1000); 

        const interval = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1); 
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [countdown, navigate]);

    return (
        <>
            <section className="text-gray-700 body-font overflow-hidden bg-white">
                <div className="container px-5 py-24 mx-auto text-center">
                    <FontAwesomeIcon icon={faCheckCircle} size="5x" className="text-green-500 mb-4" />
                    <h1 className="text-3xl font-medium text-gray-900">Thank you for ordering!</h1>
                    <p className="mt-4 text-lg">You will be redirected to the home page in {countdown} seconds...</p>
                </div>
            </section>
        </>
    );
};

export default ThankYou;
