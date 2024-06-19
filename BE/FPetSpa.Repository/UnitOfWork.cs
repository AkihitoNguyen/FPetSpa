using FPetSpa.Repository.Data;
using FPetSpa.Repository.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository
{
    public class UnitOfWork
    {
        private FpetSpaContext _context;
        private GenericRepository<Service> _service;
        private GenericRepository<Product> _product;
        private CartRepository<Cart> _cart;
        private CartDetailRepository<CartDetail> _cartDetails;
        private GenericRepository<FeedBack> _feedback;
        private ServiceOrderDetailRepository<ServiceOrderDetail> _serviceOrderDetailRepository;
        private ProductOrderDetailRepositoty<ProductOrderDetail> _productOrderDetailRepository;
        private GenericRepository<Pet> _pet;
        private OrderRepository<Order> _orderRepository;
        private GenericRepository<Category> _category;

        public IAccountRepository _IaccountRepository { get;}
        public UnitOfWork(FpetSpaContext context, IAccountRepository accountRepository)
        {
            _context = context;
            _IaccountRepository = accountRepository; 
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
        public GenericRepository<FeedBack> FeedBackRepository
        {
            get
            {
                if (_feedback == null)
                {
                    this._feedback = new GenericRepository<FeedBack>(_context);
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
        public OrderRepository<Order> OrderRepository
        {
            get
            {
                if (_orderRepository == null)
                {
                    this._orderRepository = new OrderRepository<Order>(_context);
                }
                return _orderRepository;
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

