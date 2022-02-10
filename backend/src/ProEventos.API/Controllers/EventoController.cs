using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class EventoController : ControllerBase
  {
    public IEnumerable<Evento> _evento = new Evento[] {
      new Evento() {
        EventoId = 1,
        Tema = "TESTE",
        Local = "Aqui",
        Lote = "1",
        QtdPessoa = 250,
        DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
        ImagemURL = "img.png"
      },
      new Evento() {
        EventoId = 2,
        Tema = "TESTE2",
        Local = "Aqui",
        Lote = "1",
        QtdPessoa = 250,
        DataEvento = DateTime.Now.AddDays(3).ToString("dd/MM/yyyy"),
        ImagemURL = "img.png"
      }
    };
    public EventoController()
    {
    }

    [HttpGet]
    public IEnumerable<Evento> Get()
    {
      return _evento;
    }

    [HttpGet("{id}")]
    public IEnumerable<Evento> GetById(int id)
    {
      return _evento.Where(e => e.EventoId == id);
    }
  }
}