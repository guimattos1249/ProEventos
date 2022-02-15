using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Interfaces;
using ProEventos.Domain;

namespace ProEventos.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class EventosController : ControllerBase
  {
    private readonly IEventoService _eventoService;
    public EventosController(IEventoService eventoService)
    {
      this._eventoService = eventoService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
      try
      {
        var eventos = await _eventoService.GetAllEventosAsync(true);
        if(eventos == null) return NotFound("Nenhum Evento econtrado.");

        return Ok(eventos);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      try
      {
        var evento = await _eventoService.GetEventoByIdAsync(id, true);
        if(evento == null) return NotFound("Nenhum Evento econtrado.");

        return Ok(evento);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar evento. Erro: {ex.Message}");
      }
    }

    [HttpGet("{tema}/tema")]
    public async Task<IActionResult> GetByTema(string tema)
    {
      try
      {
        var evento = await _eventoService.GetAllEventosByTemaAsync(tema, true);
        if(evento == null) return NotFound("Eventos por Tema não econtrado.");

        return Ok(evento);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar evento. Erro: {ex.Message}");
      }
    }

    [HttpPost]
    public async Task<IActionResult> Post(Evento model)
    {
      try
      {
        var evento = await _eventoService.AddEventos(model);
        if(evento == null) return BadRequest("Erro ao tentar incluir evento.");

        return Ok(evento);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar incluir evento. Erro: {ex.Message}");
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Evento model)
    {
      try
      {
        var evento = await _eventoService.UpdateEvento(id, model);
        if(evento == null) return BadRequest("Erro ao tentar alterar evento.");

        return Ok(evento);
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar alterar evento. Erro: {ex.Message}");
      }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      try
      {
        if(await _eventoService.DeleteEvento(id))
          return Ok("Deletado");
        else
          return BadRequest("Evento não deletado");
      }
      catch (Exception ex)
      {
        return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar evento. Erro: {ex.Message}");
      }
    }
  }
}