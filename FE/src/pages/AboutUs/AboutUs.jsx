// eslint-disable-next-line no-unused-vars
import React,{useEffect} from 'react';
import { assets } from '../../assets/assets';

const AboutUs = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  return (
    <div className='mb-5'>
      <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32 mb-4">
        <img
          alt=""
          src={assets.dog_home}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center opacity-60"
        />
        <div
          aria-hidden="true"
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 text-center">
            <h2 className="text-7xl font-extrabold tracking-tight text-white sm:text-7xl">Our Story</h2>
            <p className=" mt-6 text-lg leading-8 text-gray-300 font-semibold">
              Get to know a little bit about us and the compassionate hearts and skilled hands, committed to your pet’s health and happiness.
            </p>
          </div>
        </div>
      </div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-blue-500 sm:text-5xl">About Us</h2>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          At Pet Spa, we believe in providing the highest quality care for your beloved pets. Our dedicated team of professionals is passionate about making every visit a positive experience for both pets and their owners.
        </p>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <img
            alt="Mission"
            src={assets.spa2}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
          <p className="text-gray-600">
            Our mission is to create a safe, fun, and relaxing environment where pets can be pampered and cared for by our expert team. We aim to ensure that every pet feels at home while providing top-notch grooming and spa services.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <img
            alt="Services"
            src={assets.Grooming_dog}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-2xl font-bold mb-4">Our Services</h3>
          <p className="text-gray-600">
            We offer a wide range of services including grooming, bathing, nail trimming, and more. Each service is designed to keep your pet looking and feeling their best.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
          <img
            alt="Team"
            src={assets.team}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-2xl font-bold mb-4">Meet Our Team</h3>
          <p className="text-gray-600">
            Our team consists of experienced and certified pet care professionals who are passionate about animals. They are committed to providing the best care and ensuring that each pet receives individual attention.
          </p>
        </div>
      </div>

      {/* Blog Section */}
      <div className="mt-12 mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-blue-500 sm:text-5xl text-center">Customer Experiences</h2>
        <p className="mt-6 text-lg leading-8 text-gray-600 text-center">
          Read about the experiences of our customers and their pets at Pet Spa.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <img
              alt="Customer 1"
              src={assets.customer1}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">John's Experience</h3>
            <p className="text-gray-600">
              "Our dog Bella had an amazing time at Pet Spa. The staff was so caring and professional. We will definitely be coming back!"
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <img
              alt="Customer 2"
              src={assets.customer2}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Sophie's Review</h3>
            <p className="text-gray-600">
              "Pet Spa is the best! My cat, Whiskers, was treated like royalty. The grooming services are top-notch."
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <img
              alt="Customer 3"
              src={assets.customer3}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Emily's Feedback</h3>
            <p className="text-gray-600">
              "I was nervous about taking my puppy to a new place, but Pet Spa exceeded my expectations. They are fantastic!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
