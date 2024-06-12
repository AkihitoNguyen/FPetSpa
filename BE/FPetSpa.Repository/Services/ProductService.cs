using FPetSpa.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Services
{

    public interface IProducService
    {
        Task<string> GenerateNewProductIdAsync();
    }

    public class ProductService : IProducService
    {
        private readonly UnitOfWork _unitOfWork;

        public ProductService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<string> GenerateNewProductIdAsync()
        {
            var lastProduct = (await _unitOfWork.ProductRepository.GetAll())
                                      .OrderByDescending(p => p.ProductId)
                                      .FirstOrDefault();
            int newIdNumber = 1;
            if (lastProduct != null)
            {
                string lastId = lastProduct.ProductId;
                string numberPart = lastId.Substring(3); // Bỏ phần "PRO"
                newIdNumber = int.Parse(numberPart) + 1;
            }

            return $"PRO{newIdNumber}";
        }
    }
}
