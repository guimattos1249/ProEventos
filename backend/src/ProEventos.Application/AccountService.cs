using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ProEventos.Application.Dtos;
using ProEventos.Application.Interfaces;
using ProEventos.Domain.Identity;
using ProEventos.Persistence.Interfaces;

namespace ProEventos.Application
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly IUserPersist _userPersist;

        public AccountService(UserManager<User> userManager,
                                SignInManager<User> signInManager,
                                IMapper mapper,
                                IUserPersist userPersist)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            this._mapper = mapper;
            this._userPersist = userPersist;
        }
        public Task<SignInResult> CheckUserPasswordAsync(UserUpdateDto userUpdateDto, string Password)
        {
            throw new System.NotImplementedException();
        }

        public Task<UserDto> CreatAccountAsync(UserDto userDto)
        {
            throw new System.NotImplementedException();
        }

        public Task<UserUpdateDto> GetUserByUsernameAsync(string username)
        {
            throw new System.NotImplementedException();
        }

        public Task<UserUpdateDto> UpdateAccount(UserUpdateDto userUpdateDto)
        {
            throw new System.NotImplementedException();
        }

        public Task<bool> UserExists(string username)
        {
            throw new System.NotImplementedException();
        }
    }
}