// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";

const SupportCenter = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    // Perform validation here
    if (!formData.firstName.trim()) {
      errors.firstName = "First name cannot be blank";
    } else if (!isValidName(formData.firstName)) {
      errors.firstName = "First name is not valid";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name cannot be blank";
    } else if (!isValidName(formData.lastName)) {
      errors.lastName = "Last name is not valid";
    }
    if (!formData.email.trim()) {
      errors.email = "Email cannot be blank";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number cannot be blank";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 to 11 digits";
    }
    // Add more validation rules for other fields
    return errors;
  };

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    // Regular expression for name validation
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ]+(([',. -][a-zA-ZÀ-ÖØ-öø-ÿ ])?[a-zA-ZÀ-ÖØ-öø-ÿ]*)*$/;
    return nameRegex.test(name);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    // Regular expression for phone number validation
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log("Form is valid:", formData);
      // Clear form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
      // Clear errors
      setErrors({});
    } else {
      // Form is invalid, display errors
      console.log("Form is invalid:", validationErrors);
      setErrors(validationErrors);
    }
  };

  return (
    <div className="pb-5">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-[42px] font-bold tracking-[-0.84px] leading-[50.4px] text-gray-900 sm:text-4xl">
          Get in touch with us
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="mx-auto mt-16 w-4/5 sm:mt-20 ">
        <div className="grid grid-cols-1 gap-y-10">
          <div className="grid grid-cols-2">
            <div>
              <label
                htmlFor="first-name"
                className="block text-[18px] font-medium leading-6 ">
                First name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="firstName"
                  id="first-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  className={`block w-[570.400px]  border-[0.800px] pl-4 pr-5 py-2 text-gray-900 border-black placeholder:text-gray-400  sm:text-sm sm:leading-6 ${
                    errors.firstName && "border-red-500"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-[18px] font-medium leading-6 text-gray-900">
                Last name
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="lastName"
                  id="last-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  className={`block w-full border-[0.800px] pl-4 pr-5 py-2 text-gray-900 border-black placeholder:text-gray-400  sm:text-sm sm:leading-6 ${
                    errors.lastName && "border-red-500"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-[18px] font-medium leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={`block w-full  border-[0.800px] pl-4 pr-5 py-2 text-gray-900 border-black placeholder:text-gray-400  sm:text-sm sm:leading-6 ${
                  errors.email && "border-red-500"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-[18px] font-medium leading-6 text-gray-900">
              Phone number
            </label>
            <div className="relative mt-2.5">
              <input
                type="tel"
                name="phoneNumber"
                id="phone-number"
                value={formData.phoneNumber}
                onChange={handleChange}
                autoComplete="tel"
                className={`block w-80  border-[0.800px] pl-4 pr-5 py-2  text-gray-900 border-black placeholder:text-gray-400  sm:text-sm sm:leading-6 ${
                  errors.phoneNumber && "border-red-500"
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-[18px] font-medium leading-6 text-gray-900">
              How can we help?
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                placeholder="Tell us a little about it..."
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className={`block w-full border-[0.800px] pl-4 pr-5 py-2 text-gray-900 border-black ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 ${
                  errors.message && "border-red-500"
                }`}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="text-[18px] font-semibold border rounded-full bg-black text-white py-2.5 px-12"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportCenter;
