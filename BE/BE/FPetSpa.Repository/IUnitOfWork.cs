using FPetSpa.Repository.Data;
using FPetSpa.Repository.Repository;

namespace FPetSpa.Repository
{
    public interface IUnitOfWork : IDisposable
    {
        GenericRepository<Service> ServiceRepository { get; }
        GenericRepository<Product> ProductRepository { get; }
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
<<<<<<< HEAD:BE/BE/FPetSpa.Repository/IUnitOfWork.cs
         GenericRepository<BookingTime> BookingTime {  get; }

=======
        GenericRepository<BookingTime> BookingTime {  get; }
        FeedBackRepository FeedBackRepository { get; }
   
>>>>>>> b93e53d9cbf364b09703c444af04cab68e1821a6:BE/FPetSpa.Repository/IUnitOfWork.cs
        IAccountRepository _IaccountRepository { get; }
        Task<int> SaveChangesAsync();
        void Save();
    }
}