using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Amazon.S3.Util.S3EventNotification;

namespace FPetSpa.Repository.Repository
{
    public class GenericRepository<T> where T : class
    {

        private  FpetSpaContext _context;
        private  DbSet<T> dbSet;


        public GenericRepository(FpetSpaContext context) {
            this._context  = context;
            this.dbSet = context.Set<T>();

        }
        public virtual IEnumerable<T> Get(
           Expression<Func<T, bool>> filter = null!,
           Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null!    ,
           string includeProperties = "",
           int? pageIndex = null, // Optional parameter for pagination (page number)
           int? pageSize = null)  // Optional parameter for pagination (number of records per page)
        {
            IQueryable<T> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            // Implementing pagination
            if (pageIndex.HasValue && pageSize.HasValue)
            {
                // Ensure the pageIndex and pageSize are valid
                int validPageIndex = pageIndex.Value > 0 ? pageIndex.Value - 1 : 0;
                int validPageSize = pageSize.Value > 0 ? pageSize.Value : 10; // Assuming a default pageSize of 10 if an invalid value is passed

                query = query.Skip(validPageIndex * validPageSize).Take(validPageSize);
            }

            return query.ToList();
        }

        public async Task<List<T>> GetAll()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }
        public async Task<T> GetByIdAsync(string cartId, string productId) {
          return await _context.Set<T>().FindAsync(cartId, productId);

        }
        public async Task<T> GetByIdAsync(string id)
        {
            return await dbSet.FindAsync(id);
        }

        public async Task AddAsync(AddToCartModel request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            var cart = new Cart
            {
                CartId = Guid.NewGuid().ToString(),
                UserId = request.UserId,
                CreatedDate = DateTime.UtcNow
            };

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                throw new ArgumentException("Product not found");
            }

            var cartDetail = new CartDetail
            {
                CartId = cart.CartId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Price = product.Price * request.Quantity
            };

            await _context.Carts.AddAsync(cart);
            await _context.CartDetails.AddAsync(cartDetail);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(string cartId, string productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                throw new Exception("Product not found");
            }
            decimal newPrice = (decimal)(product.Price * quantity);

            try
            {
                var sql = "UPDATE CartDetails SET Quantity = @Quantity, Price = @Price WHERE CartId = @CartId AND ProductId = @ProductId";
                var parameters = new[] {

            new SqlParameter("@Quantity", quantity),
             new SqlParameter("@Price", newPrice),
            new SqlParameter("@CartId", cartId),
            new SqlParameter("@ProductId", productId),

                };

                _context.Database.ExecuteSqlRaw(sql, parameters);


            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while updating the product cartdetail's quantity: {ex.Message}");
                throw;
            }
        }
        public async Task DeleteCartAsync(string cartId)
        {
            var cart = await _context.Carts.Include(c => c.CartDetails).FirstOrDefaultAsync(c => c.CartId == cartId);
            if (cart != null)
            {
                 _context.CartDetails.RemoveRange(cart.CartDetails);
                _context.Carts.Remove(cart);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteAsync(string cartId, string productId)
        {
            var cartDetail = await _context.CartDetails
                .FirstOrDefaultAsync(cd => cd.CartId == cartId && cd.ProductId == productId);

            if (cartDetail == null)
            {
                throw new Exception("Cart detail not found");
            }

            _context.CartDetails.Remove(cartDetail);
            await _context.SaveChangesAsync();
        }
        public void DeleteById(object id)
        {
             var toDelete = GetById(id);
            if (toDelete != null)
            {
               _context.Set<T>().Remove(toDelete);
            }
        }


        public void Delete(T entity)
        {
               _context.Set<T>().Remove(entity);
        }

        public  T GetById(object id)
        {
            return  _context.Set<T>().Find(id)!;
        }

        public void Insert(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
        }

        public IEnumerable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return _context.Set<T>().Where(predicate);
        }

        public virtual int Count(Expression<Func<T, bool>> filter = null)
        {
            IQueryable<T> query = dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }
            return query.Count();
        }

        
    }
}
