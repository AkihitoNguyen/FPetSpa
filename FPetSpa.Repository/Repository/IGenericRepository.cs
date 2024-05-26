using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace FPetSpa.Repository.Repository
{
    public interface IServiceRepository<T> where T : class
    {
     
        Task<IEnumerable<T>> GetAll();
        T GetById(object id);
        IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
        void Insert(T entity);
        void Update(T entity);
        void DeleteById(object id);
        void Delete(T entity);
        
    }
}
