
using FPetSpa.Data;
using FPetSpa.Repository;
using FPetSpa.Repository.Repository;
using Microsoft.EntityFrameworkCore;

namespace FPetSpa
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            //Register Database FPetDBContext
            builder.Services.AddDbContext<FpetSpaContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("FPetDBContext"));
            });
            

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

            builder.Services.AddTransient<UnitOfWork>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseCors();

            app.MapControllers();
            app.UseCors();
            app.Run();
        }
    }
}
