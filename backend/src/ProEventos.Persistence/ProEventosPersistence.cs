using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence
{
  public class ProEventosPersistence : IProEventosPersistence
  {
    private readonly ProEventosContext _context;
    public ProEventosPersistence(ProEventosContext context)
    {
      this._context = context;

    }

    public void Add<T>(T entity) where T : class
    {
      _context.Add(entity);
    }

    public void Update<T>(T entity) where T : class
    {
      _context.Update(entity);
    }
    public void Delte<T>(T entity) where T : class
    {
      _context.Remove(entity);
    }

    public void DelteRange<T>(T[] entityArray) where T : class
    {
      _context.RemoveRange(entityArray);
    }

    public async Task<bool> SaveChangesAsync()
    {
      return (await _context.SaveChangesAsync()) > 0;
    }

    public Task<Evento[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes)
    {
      throw new System.NotImplementedException();
    }
    public Task<Evento[]> GetAllEventosAsync(bool includePalestrantes)
    {
      throw new System.NotImplementedException();
    }

    public Task<Evento> GetAllEventoByIdAsync(int EventoId, bool includePalestrantes)
    {
      throw new System.NotImplementedException();
    }

    public Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos)
    {
      throw new System.NotImplementedException();
    }

    public Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos)
    {
      throw new System.NotImplementedException();
    }

    public Task<Palestrante> GetAllPalestranteByIdAsync(int PalestranteId, bool includeEventos)
    {
      throw new System.NotImplementedException();
    }


  }
}