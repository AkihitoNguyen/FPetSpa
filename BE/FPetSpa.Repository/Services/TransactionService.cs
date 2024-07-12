using FPetSpa.Repository.Data;
using FPetSpa.Repository.Helper;

namespace FPetSpa.Repository.Services
{
    public class TransactionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TransactionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Transaction> UpdateTransaction(string transactionId, string status)
        {
            if (status != null && transactionId != null)
            {
                var transaction = _unitOfWork.TransactionRepository.GetById(transactionId);
                if (transaction != null)
                {
                    int statusResult = -1;
                    if (status.Equals("SUCCESS", StringComparison.OrdinalIgnoreCase)) statusResult = (int)TransactionStatus.PAID;
                    else if (status.Equals("FAILSE", StringComparison.OrdinalIgnoreCase)) statusResult = (int)TransactionStatus.NOTPAID;
                    if (statusResult != -1)
                    {
                        transaction.Status = statusResult;
                        return transaction;
                    }
                }
            }
            return null;
        }
    }
}
