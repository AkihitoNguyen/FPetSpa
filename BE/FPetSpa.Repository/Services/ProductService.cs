﻿namespace FPetSpa.Repository.Services
{

    public interface IProducService
    {
        Task<string> GenerateNewProductIdAsync();
    }

    public class ProductService : IProducService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<string> GenerateNewProductIdAsync()
        {
            var lastProduct = (await _unitOfWork.ProductRepository.GetAll())
                                      .OrderByDescending(p => int.Parse(p.ProductId.Substring(3))) // Sắp xếp theo giá trị số của ProductId
                                      .FirstOrDefault();

            int newIdNumber = 1;
            if (lastProduct != null)
            {
                string lastId = lastProduct.ProductId;
                if (lastId.StartsWith("PRO"))
                {
                    string numberPart = lastId.Substring(3); // Bỏ phần "PRO"
                    if (int.TryParse(numberPart, out int lastNumber))
                    {
                        newIdNumber = lastNumber + 1;
                    }
                }
            }

            return $"PRO{newIdNumber}";
        }

    }
}
