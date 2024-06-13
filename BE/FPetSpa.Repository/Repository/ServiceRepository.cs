using FPetSpa.Repository.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    public class ServiceRepository<T> where T : class
    {
        private readonly FpetSpaContext _context;
        private readonly DbSet<Service> _dbSet;

        public ServiceRepository(FpetSpaContext context)
        {
            _context = context;
            _dbSet = context.Set<Service>();
        }

        public IEnumerable<Service> Get(Expression<Func<Service, bool>> filter = null)
        {
            IQueryable<Service> query = _dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }
            return query.ToList();
        }
    }
}
