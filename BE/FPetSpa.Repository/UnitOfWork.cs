using FPetSpa.Repository.Data;
using FPetSpa.Repository.Repository;

namespace FPetSpa.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private FpetSpaContext _context;
        private GenericRepository<Service> _service;
        private GenericRepository<Product> _product;
        private CartRepository<Cart> _cart;
        private CartDetailRepository<CartDetail> _cartDetails;
        private FeedBackRepository _feedback;
        private StaffRepository _staffRepository;
        private ServiceOrderDetailRepository<ServiceOrderDetail> _serviceOrderDetailRepository;
        private ProductOrderDetailRepositoty<ProductOrderDetail> _productOrderDetailRepository;
        private GenericRepository<Pet> _pet;
        private GenericRepository<Order> _orderGenericRepository;
        private GenericRepository<Category> _category;
        private GenericRepository<Transaction> _transaction;
        private GenericRepository<Voucher> _voucher;
        private GenericRepository<BookingTime> _bookingTime;
        public OrderRepository OrderRepository { get; }
        public IAccountRepository _IaccountRepository { get; }
        public UnitOfWork(FpetSpaContext context, IAccountRepository accountRepository, OrderRepository orderRepository)
        {
            _context = context;
            _IaccountRepository = accountRepository;
            this.OrderRepository = orderRepository;
        }

        public GenericRepository<Voucher> VoucherRepository
        {
            get
            {
                if (_voucher == null)
                {
                    this._voucher = new GenericRepository<Voucher>(_context);
                }
                return this._voucher;
            }
        }
        public GenericRepository<Service> ServiceRepository
        {
            get
            {
                if (_service == null)
                {
                    this._service = new GenericRepository<Service>(_context);
                }
                return this._service;
            }
        }
        public CartRepository<Cart> Carts
        {
            get
            {
                if (_cart == null)
                {
                    this._cart = new CartRepository<Cart>(_context);
                }
                return this._cart;
            }
        }
        public CartDetailRepository<CartDetail> CartDetails
        {
            get
            {
                if (_cart == null)
                {
                    this._cartDetails = new CartDetailRepository<CartDetail>(_context);
                }
                return this._cartDetails;
            }
        }
        public GenericRepository<Product> ProductRepository
        {
            get
            {
                if (_product == null)
                {
                    this._product = new GenericRepository<Product>(_context);
                }
                return _product;
            }
        }
        public StaffRepository StaffRepository
        {
            get
            {
                if (_staffRepository == null)
                {
                    this._staffRepository = new StaffRepository(_context);
                }
                return _staffRepository;
            }
        }
        public FeedBackRepository FeedBackRepository
        {
            get
            {
                if (_feedback == null)
                {
                    this._feedback = new FeedBackRepository(_context);
                }
                return _feedback;
            }
        }
        public ProductOrderDetailRepositoty<ProductOrderDetail> productOrderDetailRepository
        {
            get
            {
                if (_productOrderDetailRepository == null)
                {
                    _productOrderDetailRepository = new ProductOrderDetailRepositoty<ProductOrderDetail>(_context);
                }
                return _productOrderDetailRepository;
            }
        }
        public ServiceOrderDetailRepository<ServiceOrderDetail> ServiceOrderDetailRepository
        {
            get
            {
                if (_serviceOrderDetailRepository == null)
                {
                    _serviceOrderDetailRepository = new ServiceOrderDetailRepository<ServiceOrderDetail>(_context);
                }
                return _serviceOrderDetailRepository;
            }
        }

        public GenericRepository<Pet> PetRepository
        {
            get
            {
                if (_pet == null)
                {
                    this._pet = new GenericRepository<Pet>(_context);
                }
                return _pet;
            }
        }

        public GenericRepository<Category> CategoryRepository
        {
            get
            {
                if (_category == null)
                {
                    this._category = new GenericRepository<Category>(_context);
                }
                return this._category;
            }
        }

        public GenericRepository<Order> OrderGenericRepo
        {
            get
            {
                if (_orderGenericRepository == null)
                {
                    this._orderGenericRepository = new GenericRepository<Order>(_context);
                }
                return this._orderGenericRepository;
            }
        }

        public GenericRepository<Transaction> TransactionRepository
        {
            get
            {
                if (_transaction == null)
                {
                    this._transaction = new GenericRepository<Transaction>(_context);
                }
                return this._transaction;
            }
        }

        public GenericRepository<BookingTime> BookingTime
        {
            get
            {
                if (_bookingTime == null)
                {
                    this._bookingTime = new GenericRepository<BookingTime>(_context);
                }
                return this._bookingTime;
            }
        }



        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
        public void Save()
        {
            _context.SaveChanges();
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
                Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}

