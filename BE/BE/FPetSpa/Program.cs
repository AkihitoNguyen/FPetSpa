
using FPetSpa.Repository.Data;
using FPetSpa.Repository;
using FPetSpa.Repository.Repository;
using FPetSpa.Repository.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using FPetSpa.Repository.Model;
using Amazon.S3;
using Quartz;
using FPetSpa.Repository.Model.VnPayModel;
using FPetSpa.Repository.Services.VnPay;
using Hangfire;
using FPetSpa.Controllers;
using System.ComponentModel;
using FPetSpa.Repository.Helper;
using FPetSpa.Repository.Services.PayPal;

namespace FPetSpa
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            //Register Database FPetDBContext
            //Note
           

            builder.Services.AddDbContext<FpetSpaContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("FPetDBContext"));
            });
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<FpetSpaContext>()
                .AddDefaultTokenProviders();
            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.SignIn.RequireConfirmedEmail = true;
            });



            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireStaffRole", policy => policy.RequireRole("Staff"));
                options.AddPolicy("RequireCustomerRole", policy => policy.RequireRole("Customer"));
            });
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                //      options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                //     options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new
                Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:ValidAudience"],
                    ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
                    (builder.Configuration["JWT:Secret"]))
                };
            }).AddCookie(options =>
            {
                options.ExpireTimeSpan = TimeSpan.FromMinutes(60); // Set the cookie expiration time here
                options.SlidingExpiration = true;
            })
              .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
              {
                  options.ClientId = builder.Configuration.GetSection("GoogleKeys:ClientId").Value;
                  options.ClientSecret = builder.Configuration.GetSection("GoogleKeys:ClientSecret").Value;
                  options.CallbackPath = new PathString("/signin-google");
              });
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddDistributedMemoryCache();   
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            builder.Services.AddCors(options => options.AddPolicy("AllowAllOrigins", policy => policy.WithOrigins("http://localhost:5173", "https://fpet-spa.vercel.app").AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            // builder.Services.AddScoped<SendMailServices>();
            builder.Services.AddScoped<IEmailSenderRepository, EmailSenderRepository>();
            builder.Services.AddScoped<IAccountRepository, AccountRepository>();
            builder.Services.AddScoped<IProducService, ProductService>();
            builder.Services.AddScoped<IPetService, PetService>();
            builder.Services.AddScoped<ImageController>();
            builder.Services.AddScoped<ProductOrderDetailController>();
            builder.Services.AddScoped<ServiceOrderDetailController>();
            builder.Services.AddScoped<PetController>();
            builder.Services.AddScoped<OrderRepository>();
            builder.Services.AddScoped<IIdService, IdService>();
            builder.Services.AddScoped<IOrderServices, OrderServices>();
            builder.Services.AddScoped<TransactionService>();
            builder.Services.AddScoped<ImageService>();
            builder.Services.AddScoped<GoogleMapService>();
            builder.Services.AddSingleton(new BotService("https://api.coze.com/v3/chat", "pat_t8mzOeNB4jsfon2OXohlzK2HNhY6yiF7SExbrU30kpxrsfIBmA57bBQd3o3kYXy7"));
            builder.Services.AddControllers()
                    .AddJsonOptions(options =>
                    {
                        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
                        options.JsonSerializerOptions.Converters.Add(new FormatDateTime());
                    });
            //Add AWS
            builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
            builder.Services.AddAWSService<IAmazonS3>();
            builder.Services.Configure<MailSettingsModel>(builder.Configuration.GetSection("GmailSettings"));
            builder.Services.AddScoped<SendMailServices>();
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton<IVnPayService, VnPayService>();
            builder.Services.AddSingleton<IPayPalService, PayPalService>();
            builder.Services.AddHangfire(config => config.UseSqlServerStorage(builder.Configuration.GetConnectionString("FPetDBContext")));
            builder.Services.AddHangfireServer();   
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            //   builder.Services.AddSwaggerGen();
            builder.Services.AddSwaggerGen(option =>
            {
                option.SwaggerDoc("v1", new OpenApiInfo { Title = "Book API", Version = "v1" });
                option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                option.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] { }
                        }
                    });
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                option.IncludeXmlComments(xmlPath);
            });
            
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors("AllowAllOrigins");
            app.UseSession();
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHangfireDashboard();

            app.MapControllers();

            app.Run();
        }
    }
}
