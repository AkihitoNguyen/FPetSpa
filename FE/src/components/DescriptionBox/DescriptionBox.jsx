// eslint-disable-next-line no-unused-vars
import React from 'react'
import '../DescriptionBox/DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="description-navigator">
        <div className="description-nav-box">Description</div>
        <div className="description-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
        Ở phần front-end, ngoài file petrol service ra, còn nhiều thành phần khác mà tôi không đưa vào (tránh dài dòng khó hiểu). Tất nhiên là có code html nhé, nếu không làm sao hiển thị giao diện ra được 😅, đúng không😊?
Back-end cũng thế, phần code bên trên trong Spring framework được gọi là controller. Ngoài ra còn các thành phần khác để tương tác với database, vân vân và mây mây😄. 
        </p>
        <p>
        Phần cuối (C#):

Sử dụng ASP.NET Core Web API, một framework mạnh mẽ trong .NET, để thiết lập API RESTful.
Xác định điểm cuối (URL) xử lý các yêu cầu từ giao diện người dùng ReactJS.
Triển khai logic để xử lý dữ liệu, tương tác cơ sở dữ liệu và quy tắc kinh doanh trong bộ điều khiển API.
Trả về phản hồi ở định dạng JSON, định dạng trao đổi dữ liệu ưa thích giữa API RESTful và ReactJS.
Giao diện người dùng (ReactJS):

Sử dụng các thư viện như fetchhoặc axiosđể bắt đầu các yêu cầu HTTP tới các điểm cuối API đã xác định trên back-end .NET.
Phân tích cú pháp các phản hồi JSON nhận được để cập nhật trạng thái thành phần React và tự động hiển thị giao diện người dùng.
Cách tiếp cận này thúc đẩy sự phân tách rõ ràng các mối quan tâm và tạo điều kiện cho sự phát triển và bảo trì độc lập các thành phần front-end và back-end.  
        </p>
      </div>
    </div>
  )
}

export default DescriptionBox
