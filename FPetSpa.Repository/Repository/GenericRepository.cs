using FPetSpa.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    public class GenericRepository<T> where T : class
    {

        private  FpetSpaContext _context;

        public GenericRepository(FpetSpaContext context) {
            _context  = context;
        }


        public async Task<List<T>> GetAll()
        {
            return await _context.Set<T>().ToListAsync();
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

       
    }
}
