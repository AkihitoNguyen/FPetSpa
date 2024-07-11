using Microsoft.AspNetCore.Http;

namespace FPetSpa.Repository.Model.VnPayModel
{
    public interface IVnPayService
    {
        string CreatePaymentURl(VnPayRequestModel vnPayRequestModel, HttpContext context);
        VnPayResponseModel PayymentExecute(IQueryCollection collection);



    }
}
