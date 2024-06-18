using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPetSpa.Repository.Migrations
{
    /// <inheritdoc />
    public partial class initIdentityAspNet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Gmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    CategoryID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CategoryName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Category__19093A2B60E60B33", x => x.CategoryID);
                });


            migrationBuilder.CreateTable(
                name: "PaymentMethod",
                columns: table => new
                {
                    MethodID = table.Column<int>(type: "int", nullable: false),
                    MethodName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    MethodAPI = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Tax = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PaymentM__FC681FB1B1EDC1C8", x => x.MethodID);
                });

            migrationBuilder.CreateTable(
                name: "Service",
                columns: table => new
                {
                    ServiceID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PictureName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ServiceName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MinWeight = table.Column<decimal>(type: "decimal(5,3)", nullable: true),
                    MaxWeight = table.Column<decimal>(type: "decimal(6,3)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Price = table.Column<decimal>(type: "money", nullable: true),
                    StartDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Service__C51BB0EA05A1F5B3", x => x.ServiceID);
                });


            migrationBuilder.CreateTable(
                name: "Voucher",
                columns: table => new
                {
                    VoucherID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Voucher__3AEE79C1F0EBB0A6", x => x.VoucherID);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Product",
                columns: table => new
                {
                    ProductID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ProductName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PictureName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CategoryID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ProductDescription = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    ProductQuantity = table.Column<int>(type: "int", nullable: true),
                    Price = table.Column<decimal>(type: "money", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Product__B40CC6EDFBA41E79", x => x.ProductID);
                    table.ForeignKey(
                        name: "FK_Product.CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Category",
                        principalColumn: "CategoryID");
                });

            migrationBuilder.CreateTable(
                name: "Cart",
                columns: table => new
                {
                    CartID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UserID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Cart__51BCD79763453EE0", x => x.CartID);
                    table.ForeignKey(
                        name: "FK_Cart.UserID",
                        column: x => x.UserID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Pet",
                columns: table => new
                {
                    PetID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CustomerID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    PetName = table.Column<string>(name: "Pet Name", type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    PictureName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PetGender = table.Column<string>(name: "Pet Gender", type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    PetType = table.Column<string>(name: "Pet Type", type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    PetWeight = table.Column<decimal>(name: "Pet Weight", type: "decimal(9,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Pet__48E5380209E1C170", x => x.PetID);
                    table.ForeignKey(
                        name: "FK_Pet.CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    TransactionID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: true),
                    TransactionDate = table.Column<DateOnly>(type: "date", nullable: true),
                    MethodID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Transact__55433A4B636BA637", x => x.TransactionID);
                    table.ForeignKey(
                        name: "FK_Transactions.MethodID",
                        column: x => x.MethodID,
                        principalTable: "PaymentMethod",
                        principalColumn: "MethodID");
                });

            migrationBuilder.CreateTable(
                name: "CartDetails",
                columns: table => new
                {
                    CartID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ProductID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Quantity = table.Column<DateTime>(type: "datetime", nullable: true),
                    Price = table.Column<decimal>(type: "money", nullable: true)
                },
                constraints: table =>
                {
                    table.ForeignKey(
                        name: "FK_CartDetails.CartID",
                        column: x => x.CartID,
                        principalTable: "Cart",
                        principalColumn: "CartID");
                    table.ForeignKey(
                        name: "FK_CartDetails.ProductID",
                        column: x => x.ProductID,
                        principalTable: "Product",
                        principalColumn: "ProductID");
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    OrderID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CustomerID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    StaffID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RequiredDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Total = table.Column<decimal>(type: "decimal(20,2)", nullable: true),
                    VoucherID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TransactionID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Order__C3905BAFD18ADF9C", x => x.OrderID);
                    table.ForeignKey(
                        name: "FK_Order.CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Order.StaffID",
                        column: x => x.StaffID,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Order.TransactionID",
                        column: x => x.TransactionID,
                        principalTable: "Transactions",
                        principalColumn: "TransactionID");
                    table.ForeignKey(
                        name: "FK_Order.VoucherID",
                        column: x => x.VoucherID,
                        principalTable: "Voucher",
                        principalColumn: "VoucherID");
                });

            migrationBuilder.CreateTable(
                name: "FeedBack",
                columns: table => new
                {
                    FeedBackID = table.Column<int>(type: "int", nullable: false),
                    OrderID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    PictureName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Star = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FeedBack__E2CB3867C1251C5E", x => x.FeedBackID);
                    table.ForeignKey(
                        name: "FK_FeedBack.OrderID",
                        column: x => x.OrderID,
                        principalTable: "Order",
                        principalColumn: "OrderID");
                });

            migrationBuilder.CreateTable(
                name: "ProductOrderDetails",
                columns: table => new
                {

                    OrderID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    ProductId = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Quantity = table.Column<int>(type: "int", nullable: true),
                    Price = table.Column<decimal>(type: "money", nullable: true),
                    Discount = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.ForeignKey(
                        name: "FK_ProductOrderDetails.OrderID",
                        column: x => x.OrderID,
                        principalTable: "Order",
                        principalColumn: "OrderID");
                    table.ForeignKey(
                        name: "FK_ProductOrderDetails.ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "ProductID");
                });

            migrationBuilder.CreateTable(
                name: "ServiceOrderDetails",
                columns: table => new
                {
                    ServiceID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    OrderID = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Discount = table.Column<double>(type: "float", nullable: true),
                    PetWeight = table.Column<decimal>(type: "decimal(5,3)", nullable: true),
                    Price = table.Column<decimal>(type: "money", nullable: true),
                    PetID = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.ForeignKey(
                        name: "FK_ServiceOrderDetails.OrderID",
                        column: x => x.OrderID,
                        principalTable: "Order",
                        principalColumn: "OrderID");
                    table.ForeignKey(
                        name: "FK_ServiceOrderDetails.PetID",
                        column: x => x.PetID,
                        principalTable: "Pet",
                        principalColumn: "PetID");
                    table.ForeignKey(
                        name: "FK_ServiceOrderDetails.ServiceID",
                        column: x => x.ServiceID,
                        principalTable: "Service",
                        principalColumn: "ServiceID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Cart_UserID",
                table: "Cart",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_CartDetails_CartID",
                table: "CartDetails",
                column: "CartID");

            migrationBuilder.CreateIndex(
                name: "IX_CartDetails_ProductID",
                table: "CartDetails",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_FeedBack_OrderID",
                table: "FeedBack",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_CustomerID",
                table: "Order",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_StaffID",
                table: "Order",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_TransactionID",
                table: "Order",
                column: "TransactionID");

            migrationBuilder.CreateIndex(
                name: "IX_Order_VoucherID",
                table: "Order",
                column: "VoucherID");

            migrationBuilder.CreateIndex(
                name: "IX_Pet_CustomerID",
                table: "Pet",
                column: "CustomerID");

            migrationBuilder.CreateIndex(
                name: "IX_Product_CategoryID",
                table: "Product",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductOrderDetails_OrderID",
                table: "ProductOrderDetails",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ProductOrderDetails_ProductId",
                table: "ProductOrderDetails",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDetails_OrderID",
                table: "ServiceOrderDetails",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDetails_PetID",
                table: "ServiceOrderDetails",
                column: "PetID");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOrderDetails_ServiceID",
                table: "ServiceOrderDetails",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_MethodID",
                table: "Transactions",
                column: "MethodID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CartDetails");

            migrationBuilder.DropTable(
                name: "FeedBack");

            migrationBuilder.DropTable(
                name: "ProductOrderDetails");

            migrationBuilder.DropTable(
                name: "ServiceOrderDetails");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Cart");

            migrationBuilder.DropTable(
                name: "Product");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropTable(
                name: "Pet");

            migrationBuilder.DropTable(
                name: "Service");

            migrationBuilder.DropTable(
                name: "Category");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Voucher");

            migrationBuilder.DropTable(
                name: "Customer");

            migrationBuilder.DropTable(
                name: "PaymentMethod");
        }
    }
}
