using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Interfaces
{
    public interface IRedeSocialService
    {
        Task<RedeSocialDto[]>SaveByEvento(int eventoId, RedeSocialDto[] models);
        Task<bool>DeleteByEvento(int eventoId, int redeSocialId);
        
        Task<RedeSocialDto[]>SaveByPalestrante(int palestranteId, RedeSocialDto[] models);
        Task<bool>DeleteByPalestrante(int palestranteId, int redeSocialId);
        
        Task<RedeSocialDto[]>GetAllByEventoIdsAsync(int eventoId);
        Task<RedeSocialDto[]>GetAllByPalestranteIdsAsync(int palestranteId);

        Task<RedeSocialDto>GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId);
        Task<RedeSocialDto>GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId);

        
    }
}