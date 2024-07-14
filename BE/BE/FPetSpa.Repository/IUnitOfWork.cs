using FPetSpa.Repository.Data;
using FPetSpa.Repository.Repository;

namespace FPetSpa.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        GenericRepository<Service> ServiceRepository { get; }
        GenericRepository<Product> ProductRepository { get; }
        GenericRepository<FeedBack> FeedBackRepository { get; }
        GenericRepository<Pet> PetRepository { get; }
        GenericRepository<Order> OrderGenericRepo { get; }
        GenericRepository<Category> CategoryRepository { get; }
        GenericRepository<Transaction> TransactionRepository { get; }
        CartRepository<Cart> Carts { get; }
        CartDetailRepository<CartDetail> CartDetails { get; }
        ServiceOrderDetailRepository<ServiceOrderDetail> ServiceOrderDetailRepository { get; }
        ProductOrderDetailRepositoty<ProductOrderDetail> productOrderDetailRepository { get; }
        GenericRepository<Voucher> VoucherRepository { get; }
        OrderRepository OrderRepository { get; }
         GenericRepository<BookingTime> BookingTime {  get; }

        IAccountRepository _IaccountRepository { get; }
        Task<int> SaveChangesAsync();
        void Save();
    }
}