using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Dtos;
using ProEventos.Application.Interfaces;
using ProEventos.Domain;
using ProEventos.Persistence.Interfaces;

namespace ProEventos.Application
{
    public class RedeSocialService : IRedeSocialService
    {
        private readonly IRedeSocailPersist _redeSocialPersist;
        private readonly IMapper _mapper;
        public RedeSocialService(IRedeSocailPersist redeSocialPersist,
                            IMapper mapper)
        {
            this._mapper = mapper;
            this._redeSocialPersist = redeSocialPersist;
        }

        public async Task AddRedeSocial(int eventoId, RedeSocialDto model, bool isEvento)
        {
            try
            {
                var redeSocial = _mapper.Map<RedeSocial>(model);

                if(isEvento)
                {

                    redeSocial.EventoId = eventoId;
                    redeSocial.PalestranteId = null;
                }
                else
                {
                    redeSocial.EventoId = null;
                    redeSocial.PalestranteId = eventoId;
                }

                _redeSocialPersist.Add<RedeSocial>(redeSocial);

                await _redeSocialPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                var redeSociais = await _redeSocialPersist.GetAllByEventoIdsAsync(eventoId);
                if(redeSociais == null) return null;

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(eventoId, model, true);
                    }
                    else
                    {
                        var redeSocial = redeSociais.FirstOrDefault(RedeSocial => RedeSocial.Id == model.Id);
                        model.EventoId = eventoId;

                        _mapper.Map(model, redeSocial);

                        _redeSocialPersist.Update<RedeSocial>(redeSocial);

                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }

                var redeSocialRetorno = await _redeSocialPersist.GetAllByEventoIdsAsync(eventoId);

                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }

        public async Task<RedeSocialDto[]> SaveByPalestrante(int palestranteId, RedeSocialDto[] models)
        {
            try
            {
                var redeSociais = await _redeSocialPersist.GetAllByPalestranteIdsAsync(palestranteId);
                if(redeSociais == null) return null;

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(palestranteId, model, false);
                    }
                    else
                    {
                        var redeSocial = redeSociais.FirstOrDefault(RedeSocial => RedeSocial.Id == model.Id);
                        model.PalestranteId = palestranteId;

                        _mapper.Map(model, redeSocial);

                        _redeSocialPersist.Update<RedeSocial>(redeSocial);

                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }

                var redeSocialRetorno = await _redeSocialPersist.GetAllByPalestranteIdsAsync(palestranteId);

                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);
            }
            catch (System.Exception)
            {
                
                throw;
            }
        }

        public async Task<bool> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) throw new Exception("Rede Social por Evento para delete não encontrdo");

                _redeSocialPersist.Delte<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByPalestrante(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if (redeSocial == null) throw new Exception("Rede Social por Palestrante para delete não encontrdo");

                _redeSocialPersist.Delte<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByEventoIdsAsync(int eventoId)
        {
            try
            {
                var redeSociais = await _redeSocialPersist.GetAllByEventoIdsAsync(eventoId);
                if (redeSociais == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redeSociais);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByPalestranteIdsAsync(int palestranteId)
        {
            try
            {
                var redeSociais = await _redeSocialPersist.GetAllByPalestranteIdsAsync(palestranteId);
                if (redeSociais == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redeSociais);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if (redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}