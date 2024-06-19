using FPetSpa.Repository.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    interface IProductOrderDetailRepository
    {
        Task<List<ProductOrderDetail>> GetAllAsync();
        Task<ProductOrderDetail> GetByOrderID(string orderId);
    }
}
