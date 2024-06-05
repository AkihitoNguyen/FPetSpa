using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FPetSpa.Repository.Data;

public partial class FpetSpaContext : IdentityDbContext<ApplicationUser>
{
    public FpetSpaContext()
    {
    }

    public FpetSpaContext(DbContextOptions<FpetSpaContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartDetail> CartDetails { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<FeedBack> FeedBacks { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<Pet> Pets { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductOrderDetail> ProductOrderDetails { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<ServiceOrderDetail> ServiceOrderDetails { get; set; }

    public virtual DbSet<Staff> Staff { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<Voucher> Vouchers { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("PK__Cart__51BCD79763453EE0");

            entity.ToTable("Cart");

            entity.Property(e => e.CartId)
                .HasMaxLength(20)
                .HasColumnName("CartID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Carts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Cart.UserID");
        });

        modelBuilder.Entity<CartDetail>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.CartId)
                .HasMaxLength(20)
                .HasColumnName("CartID");
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.ProductId)
                .HasMaxLength(20)
                .HasColumnName("ProductID");
            entity.Property(e => e.Quantity).HasColumnType("datetime");

            entity.HasOne(d => d.Cart).WithMany()
                .HasForeignKey(d => d.CartId)
                .HasConstraintName("FK_CartDetails.CartID");

            entity.HasOne(d => d.Product).WithMany()
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_CartDetails.ProductID");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A2B60E60B33");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryId)
                .HasMaxLength(20)
                .HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(20);
            entity.Property(e => e.Description).HasMaxLength(100);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B812C7E4FE");

            entity.ToTable("Customer");

            entity.Property(e => e.CustomerId)
                .ValueGeneratedNever()
                .HasColumnName("CustomerID");
            entity.Property(e => e.Address).HasMaxLength(20);
            entity.Property(e => e.Name).HasMaxLength(20);
            entity.Property(e => e.Password).HasMaxLength(20);
            entity.Property(e => e.Phone).HasColumnType("decimal(10, 0)");
            entity.Property(e => e.PictureName).HasMaxLength(50);
            entity.Property(e => e.UserName)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<FeedBack>(entity =>
        {
            entity.HasKey(e => e.FeedBackId).HasName("PK__FeedBack__E2CB3867C1251C5E");

            entity.ToTable("FeedBack");

            entity.Property(e => e.FeedBackId)
                .ValueGeneratedNever()
                .HasColumnName("FeedBackID");
            entity.Property(e => e.Description).HasMaxLength(300);
            entity.Property(e => e.OrderId)
                .HasMaxLength(20)
                .HasColumnName("OrderID");
            entity.Property(e => e.PictureName).HasMaxLength(50);

            entity.HasOne(d => d.Order).WithMany(p => p.FeedBacks)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK_FeedBack.OrderID");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__C3905BAFD18ADF9C");

            entity.ToTable("Order");


            entity.Property(e => e.OrderId)
                .HasMaxLength(20)
                .HasColumnName("OrderID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.StaffId).HasColumnName("StaffID");
            entity.Property(e => e.Total).HasColumnType("decimal(20, 2)");
            entity.Property(e => e.TransactionId)
                .HasMaxLength(20)
                .HasColumnName("TransactionID");
            entity.Property(e => e.VoucherId)
                .HasMaxLength(20)
                .HasColumnName("VoucherID");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK_Order.CustomerID");

            entity.HasOne(d => d.Staff).WithMany(p => p.Orders)
                .HasForeignKey(d => d.StaffId)
                .HasConstraintName("FK_Order.StaffID");

            entity.HasOne(d => d.Transaction).WithMany(p => p.Orders)
                .HasForeignKey(d => d.TransactionId)
                .HasConstraintName("FK_Order.TransactionID");

            entity.HasOne(d => d.Voucher).WithMany(p => p.Orders)
                .HasForeignKey(d => d.VoucherId)
                .HasConstraintName("FK_Order.VoucherID");
        });

        modelBuilder.Entity<PaymentMethod>(entity =>
        {
            entity.HasKey(e => e.MethodId).HasName("PK__PaymentM__FC681FB1B1EDC1C8");

            entity.ToTable("PaymentMethod");

            entity.Property(e => e.MethodId)
                .ValueGeneratedNever()
                .HasColumnName("MethodID");
            entity.Property(e => e.MethodApi)
                .HasMaxLength(100)
                .HasColumnName("MethodAPI");
            entity.Property(e => e.MethodName).HasMaxLength(20);
        });

        modelBuilder.Entity<Pet>(entity =>
        {
            entity.HasKey(e => e.PetId).HasName("PK__Pet__48E5380209E1C170");

            entity.ToTable("Pet");

            entity.Property(e => e.PetId)
                .ValueGeneratedNever()
                .HasColumnName("PetID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.PetGender)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Pet Gender");
            entity.Property(e => e.PetName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Pet Name");
            entity.Property(e => e.PetType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Pet Type");
            entity.Property(e => e.PetWeight)
                .HasColumnType("decimal(9, 2)")
                .HasColumnName("Pet Weight");
            entity.Property(e => e.PictureName).HasMaxLength(50);

            entity.HasOne(d => d.Customer).WithMany(p => p.Pets)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK_Pet.CustomerID");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6EDFBA41E79");

            entity.ToTable("Product");

            entity.Property(e => e.ProductId)
                .HasMaxLength(20)
                .HasColumnName("ProductID");
            entity.Property(e => e.CategoryId)
                .HasMaxLength(20)
                .HasColumnName("CategoryID");
            entity.Property(e => e.PictureName).HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.ProductDescription).HasMaxLength(300);
            entity.Property(e => e.ProductName).HasMaxLength(50);

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK_Product.CategoryID");
        });

        modelBuilder.Entity<ProductOrderDetail>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.OrderId)
                .HasMaxLength(20)
                .HasColumnName("OrderID");
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.ProductId).HasMaxLength(20);

            entity.HasOne(d => d.Order).WithMany()
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK_ProductOrderDetails.OrderID");

            entity.HasOne(d => d.Product).WithMany()
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_ProductOrderDetails.ProductId");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB0EA05A1F5B3");

            entity.ToTable("Service");

            entity.Property(e => e.ServiceId)
                .HasMaxLength(20)
                .HasColumnName("ServiceID");
            entity.Property(e => e.Description).HasMaxLength(300);
            entity.Property(e => e.EndDate).HasColumnType("datetime");
            entity.Property(e => e.MaxWeight).HasColumnType("decimal(6, 3)");
            entity.Property(e => e.MinWeight).HasColumnType("decimal(5, 3)");
            entity.Property(e => e.PictureName).HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.ServiceName).HasMaxLength(50);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<ServiceOrderDetail>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.OrderId)
                .HasMaxLength(20)
                .HasColumnName("OrderID");
            entity.Property(e => e.PetId).HasColumnName("PetID");
            entity.Property(e => e.PetWeight).HasColumnType("decimal(5, 3)");
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.ServiceId)
                .HasMaxLength(20)
                .HasColumnName("ServiceID");

            entity.HasOne(d => d.Order).WithMany()
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK_ServiceOrderDetails.OrderID");

            entity.HasOne(d => d.Pet).WithMany()
                .HasForeignKey(d => d.PetId)
                .HasConstraintName("FK_ServiceOrderDetails.PetID");

            entity.HasOne(d => d.Service).WithMany()
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK_ServiceOrderDetails.ServiceID");
        });

        modelBuilder.Entity<Staff>(entity =>
        {
            entity.HasKey(e => e.StaffId).HasName("PK__Staff__96D4AAF7BDCD0930");

            entity.Property(e => e.StaffId)
                .ValueGeneratedNever()
                .HasColumnName("StaffID");
            entity.Property(e => e.FirstName).HasMaxLength(20);
            entity.Property(e => e.LastName).HasMaxLength(20);
            entity.Property(e => e.Password).HasMaxLength(20);
            entity.Property(e => e.PictureName).HasMaxLength(50);
            entity.Property(e => e.UserName)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__Transact__55433A4B636BA637");

            entity.Property(e => e.TransactionId)
                .HasMaxLength(20)
                .HasColumnName("TransactionID");
            entity.Property(e => e.MethodId).HasColumnName("MethodID");

            entity.HasOne(d => d.Method).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.MethodId)
                .HasConstraintName("FK_Transactions.MethodID");
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.HasKey(e => e.VoucherId).HasName("PK__Voucher__3AEE79C1F0EBB0A6");

            entity.ToTable("Voucher");

            entity.Property(e => e.VoucherId)
                .HasMaxLength(20)
                .HasColumnName("VoucherID");
            entity.Property(e => e.Description).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
