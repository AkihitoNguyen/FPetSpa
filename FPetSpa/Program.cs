
using FPetSpa.Data;
using FPetSpa.Repository;
using FPetSpa.Repository.Repository;
using FPetSpa.Repository.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

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
            builder.Services.AddScoped<IProducService, ProductService>();
            builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

            builder.Services.AddTransient<UnitOfWork>();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "FPetSpa", Version = "v1" });

                // Set the comments path for the Swagger JSON and UI.
                
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

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

            app.Run();
        }
    }
}
