using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Interfaces
{
    public interface IGeralPersist
    {
        void Add<T>(T entity) where T: class;
        void Update<T>(T entity) where T: class;
        void Delte<T>(T entity) where T: class;
        void DelteRange<T>(T[] entityArray) where T: class;
        Task<bool> SaveChangesAsync();
    }
}