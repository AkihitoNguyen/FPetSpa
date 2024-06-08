import React, { useState } from "react";
import FirstForm from "../../components/FormComponents/FirstForm";
import SecondForm from "../../components/FormComponents/SecondForm";
import { assets } from "../../assets/assets";

const Service = () => {
  const formList = ["FirstForm", "SecondForm", "ThirdForm"];

  const formLength = formList.length;

  const [page, setPage] = useState(0);

  const handlePrev = () => {
    setPage(page === 0 ? formLength - 1 : page - 1);
  };
  const handleNext = () => {
    setPage(page === formLength - 1 ? 0 : page + 1);
  };

  const initialValues = {
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
  };
  const [values, setValues] = useState(initialValues);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const handleForms = () => {
    switch (page) {
      case 0: {
        return (
          <div>
            <FirstForm formValues={values} onChange={onChange}></FirstForm>
          </div>
        );
      }
      case 1: {
        return (
          <SecondForm formValues={values} onChange={onChange}></SecondForm>
        );
      }
      // case 2: {
      //   return <ThirdForm formValues={values} onChange={onChange}></ThirdForm>;
      // }
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
      <div className=" grid gap-4 place-content-center h-screen items-center place-items-center ">
        <div className="flex-1">{handleForms()}</div>
        <div className="grid grid-cols-2 gap-4 place-content-center items-center">
          <button
            onClick={handlePrev}
            className="bg-blue-200  hover:bg-blue-300 rounded-md text-gray-800 font-bold py-2 px-4 disabled:bg-gray-400 "
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
           {submitSuccess && ( // Hiển thị thông báo nếu submit thành công
          <div className="text-green-500">Submit thành công!</div>
        )}
        </div>
      </div>

        <div className="flex items-center justify-center sm:mt-60 ">
            <img className="w-8/12" src={assets.service} alt="" />
        </div>
      <div className="">
        <h1 className="text-3xl">Matts and Knots</h1>

        <div>
          <p className="">
            Tại Head to Tail, quy trình dịch vụ tắm, vệ sinh & cắt tỉa được thực
            hiện theo các bước như sau:
            <br /> 1. Tiếp nhận yêu cầu, kiểm tra tình trạng, đăng ký và tư vấn
            dịch vụ
            <br />
            2. Vệ sinh, nhổ lông tai và khử mùi hôi
            <br />
            3. Cạo lông vệ sinh bàn chân, vùng bụng và hậu môn
            <br />
            4. Cắt và dũa móng
            <br />
            5. Gỡ lông rối
            <br />
            6. Bơi vận động ngoài trời hoặc ngâm thảo dược trong bồn (nếu có)
            <br />
            7. Tắm gội bằng nước ấm và sữa tắm chuyên dụng cho từng loại lông/da
            <br />
            8. Vắt tuyến hôi
            <br />
            9. Vệ sinh răng miệng
            <br />
            10. Hấp dầu làm mượt lông
            <br />
            11. Massage thư giãn
            <br />
            12. Lau, thổi, sấy khô và đánh tơi lông
            <br />
            13. Kiểm tra tình trạng lông sau khi tắm
            <br />
            14. Cắt tạo kiểu (nếu có)
            <br /> 15. Xịt dưỡng lông, nước hoa và khử mùi răng miệng
            <br />
            16. Đưa, trả và báo cáo lại cho bố mẹ
          </p>

          <h3 className="mt-10">
            *Lưu ý:
            <br /> Có chính sách giá đặc biệt cho các giống thú cưng thuộc chủng
            loại lông ngắn bẩm sinh, vui lòng liên hệ để biết thêm chi tiết Head
            to Tail có quyền từ chối tiếp nhận thú cưng: có dấu hiệu bệnh truyền
            nhiễm nặng, tiểu sử bệnh hen, co giật hoặc các bệnh về thần kinh,
            nhiễm viêm da hoặc ký sinh trùng nặng, quá khích động và hung dữ.
            Nên sử dụng túi xách hoặc lồng vận chuyển nếu đi xa. Trường hợp thú
            cưng có biểu hiện bất thường về sức khỏe, bố mẹ có thể liên hệ số
            tổng đài của Head to Tail để được tư vấn và trợ giúp. Bố mẹ vui lòng
            kiểm tra kỹ các bé trước khi ra về hoặc khi được giao đến nhà, để
            đảm bảo nhân viên của Head to Tail đã thực hiện đúng yêu cầu dịch
            vụ.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Service;
