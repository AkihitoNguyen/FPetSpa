import React, { useState, useEffect } from "react";
import FirstForm from "../../components/FormComponents/FirstForm";
import SecondForm from "../../components/FormComponents/SecondForm";

const Service = () => {
  const formList = ["FirstForm", "SecondForm", "ThirdForm"];

  const formLength = formList.length;

  const [page, setPage] = useState(0);
  const [values, setValues] = useState({
    fullname: "",
    date: "",
    pet: "",
    petage: "",
    pettype: "",
    weight: "",
    email: "",
    phonenumber: "",
    message: "",
    servicetype: "",
  });
  const [states, setStates] = useState([]);

  useEffect(() => {
    // Gọi API của bạn ở đây để lấy dữ liệu cho tùy chọn của states
    fetch("https://fpetspa.azurewebsites.net/api/services")
      .then((response) => response.json())
      .then((data) => {
        // Cập nhật state của states với dữ liệu từ API
        setStates(
          data.map((item) => ({
            name: item.serviceName,
            //  id: item .serviceId.toString()
          }))
        );
      })
      .catch((error) => console.error("Error fetching services", error));
  }, []);

  const handlePrev = () => {
    setPage(page === 0 ? formLength - 1 : page - 1);
  };
  const handleNext = () => {
    setPage(page === formLength - 1 ? 0 : page + 1);
  };

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleForms = () => {
    switch (page) {
      case 0: {
        return (
          <div>
            <FirstForm
              formValues={values}
              onChange={onChange}
              option={states}></FirstForm>
          </div>
        );
      }
      case 1: {
        return (
          <SecondForm formValues={values} onChange={onChange}></SecondForm>
        );
      }
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await setTimeout(() => {
      console.log("form", values);
      setSubmitSuccess(true);
    }, 2000);
    return response;
  };

  setTimeout(() => {
    setSubmitSuccess(false);
  }, 2000);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div>

      <div className="grid gap-4 place-content-center  h-screen items-center place-items-center ">
        <div className="flex-1">
          {page === 0 ? (
            <FirstForm
              formValues={values}
              onChange={onChange}
              option={states}
            />
          ) : (
            <SecondForm
              formValues={values}
              onChange={onChange}
              selectedService={values.servicetype}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 place-content-center items-center">
          <button
            onClick={handlePrev}
            className="bg-blue-200 hover:bg-blue-300 rounded-md text-gray-800 font-bold py-2 px-4 disabled:bg-gray-400 "
            disabled={page === 0}>
            Prev
          </button>
          {page === 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-200 hover:bg-blue-300 rounded-md text-gray-800 font-bold py-2 px-4 ">
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-blue-200 hover:bg-blue-300 rounded-md text-gray-800 font-bold py-2 px-4 ">
              Next
            </button>
          )}
        </div>
      </div>
      <div className="mt-36">
        <p>aaaaaaaaaaaaaaaaaaa</p>
        <br />
        <p>aaaaaaaaaaaaaaaaaaa</p>
        <br />
        <p>aaaaaaaaaaaaaaaaaaa</p>
        <br />
        <p>aaaaaaaaaaaaaaaaaaa</p>
        <br />
        <p>aaaaaaaaaaaaaaaaaaa</p>
        <br />
        <p>aaaaaaaaaaaaaaaaaaa</p>
        <br />

      </div>
    </div>
  );
};

export default Service;
