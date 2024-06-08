import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getAllServices } from "../../api/apiService";
const FirstForm = ({ formValues, onChange, option }) => {
  const today = dayjs().format("YYYY-MM-DD");

  const [service, setService] = useState([]);
  const fetchService =  async () => {
      try {
        const res = await getAllServices();
      setService(res);
      } catch (error) {
        console.error("Error", error); 
      }
  }

    useEffect(()=>{
      fetchService();
    }, [])

  return (



    //
    <div className="">
      <div className="mx-auto max-w-2xl text-center sm:mt-48">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Customer Information
        </h2>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-10">
        {/* name */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="full-name"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Full name
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="fullname"
                id="full-name"
                onChange={onChange}
                value={formValues.fullname}
              />
            </div>
          </div>

          {/* phonenumber */}
          <div>
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Phone number
            </label>
            <div className="mt-2.5">
              <input
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                name="phonenumber"
                id="phone-number"
                onChange={onChange}
                value={formValues.phonenumber}
              />
            </div>
          </div>
        </div>
      </form>

      <div className="mx-auto max-w-2xl text-center mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-xl">
          Pet Information
        </h3>
      </div>
      <form className="mx-auto mt-2 max-w-xl sm:mt-5">
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 sm:grid-cols-2">
          {/* petname */}
          <div className="">
            <label
              htmlFor="pet"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Pet name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="pet"
                id="pet"
                onChange={onChange}
                value={formValues.pet}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* pet age */}
          <div className="">
            <label
              htmlFor="pet-age"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Pet age
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="petage"
                id="pet-age"
                onChange={onChange}
                value={formValues.petage}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* type pet */}
          <div className="">
            <label
              htmlFor="pet-type"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Type pet
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="pettype"
                id="pet-type"
                onChange={onChange}
                value={formValues.pettype}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {/* weight pet */}
          <div className="">
            <label
              htmlFor="weight"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Weight
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="weight"
                id="weight"
                onChange={onChange}
                value={formValues.weight}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* time */}
          <div className="">
            <label
              htmlFor="time"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Time
            </label>
            <div className="mt-2.5">
              <input
                className="border rounded-lg"
                type="date"
                id="date"
                name="date"
                onChange={onChange}
                value={formValues.date}
                min={today}
              />
            </div>
          </div>

          {/* service name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="service-type"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Select type
            </label>
            <div className="mb-6">
            
              <select 
              className="block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="servicetype"
              name="servicetype"
             
            >
              {service.map((item) =>(
              <option value={formValues.servicetype} onChange={onChange}>{item.serviceName}</option>
            ))}
              
            </select>
          
        </div>{" "}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900">
              Note
            </label>
            <div className="mt-2.5">
              <textarea
                onChange={onChange}
                value={formValues.message}
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FirstForm;
