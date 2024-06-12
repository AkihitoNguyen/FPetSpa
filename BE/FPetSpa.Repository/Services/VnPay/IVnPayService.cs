using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Model.VnPayModel
{
    public interface IVnPayService
    {
        string CreatePaymentURl(HttpContext httpContent, VnPayRequestModel vnpay);
        VnPayResponseModel PayymentExecute(IQueryCollection collection);
    }
}
