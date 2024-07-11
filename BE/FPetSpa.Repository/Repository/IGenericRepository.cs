using System.Linq.Expressions;

namespace FPetSpa.Repository.Repository
{
    public interface IGenericRepository<T> where T : class
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
