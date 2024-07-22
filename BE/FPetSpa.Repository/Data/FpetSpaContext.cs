using Microsoft.AspNetCore.Identity;
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
    public virtual DbSet<ApplicationUser> Users { get; set; }

    public virtual DbSet<CartDetail> CartDetails { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<FeedBack> FeedBack { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

    public virtual DbSet<Pet> Pets { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductOrderDetail> ProductOrderDetails { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<ServiceOrderDetail> ServiceOrderDetails { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }
    public virtual DbSet<BookingTime> BookingTime { get; set; }
    public virtual DbSet<Voucher> Vouchers { get; set; }
    public DbSet<StaffStatus> Staff{ get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.Entity<BookingTime>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.Time)
                .HasMaxLength(20)
                .HasColumnName("BookingTime");
            entity.Property(e => e.Date)
                    .HasColumnName("Date");
            entity.Property(e => e.MaxSlots)
                .HasColumnName("MaxSlots");
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("PK__Cart__51BCD79747FAC93A");

            entity.ToTable("Cart");

            entity.Property(e => e.CartId).HasColumnName("CartID");
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.UserId)
                .HasMaxLength(50)
                .HasColumnName("UserID");

            entity.HasOne(d => d.User)
                .WithMany(p => p.Carts)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Cart.UserID");
        });

        modelBuilder.Entity<CartDetail>(entity =>
        {
            entity.HasKey(cd => new { cd.CartId, cd.ProductId });
            entity.Property(e => e.CartId)
                .HasMaxLength(450)
                .HasColumnName("CartID");
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.ProductId)
                .HasMaxLength(20)
                .HasColumnName("ProductID");

            entity.HasOne(d => d.Cart)
                .WithMany(c => c.CartDetails)
                .HasForeignKey(d => d.CartId)
                  .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_CartDetails.CartID");

        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A2B022D7698");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryId)
                .HasMaxLength(20)
                .HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(20);
            entity.Property(e => e.Description).HasMaxLength(100);
        });

        modelBuilder.Entity<FeedBack>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).ValueGeneratedOnAdd();


            entity.Property(e => e.Description).HasMaxLength(300);
            entity.Property(e => e.ProductId)
                .HasMaxLength(20)
                .HasColumnName("ProductId");
            entity.Property(e => e.PictureName).HasMaxLength(50);
            entity.Property(e => e.UserFeedBackId)
                .HasMaxLength(50)
                .HasColumnName("UserFeedBackID");

            entity.HasOne(d => d.product).WithMany()
                .HasForeignKey(d => d.ProductId)
                .HasConstraintName("FK_FeedBack.ProductId");

            entity.HasOne(d => d.UserFeedBack).WithMany()
                .HasForeignKey(d => d.UserFeedBackId)
                .HasConstraintName("FK_FeedBack.UserFeedBackId");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__C3905BAF71F59845");

            entity.ToTable("Order");

            entity.Property(e => e.OrderId)
                .HasMaxLength(20)
                .HasColumnName("OrderID");
            entity.Property(e => e.CustomerId)
                .HasMaxLength(50)
                .HasColumnName("CustomerID");
            entity.Property(e => e.StaffId)
                .HasMaxLength(50)
                .HasColumnName("StaffID");
            entity.Property(e => e.Total).HasColumnType("decimal(20, 2)");
            entity.Property(e => e.TransactionId)
                .HasMaxLength(20)
                .HasColumnName("TransactionID");
            entity.Property(e => e.VoucherId)
                .HasMaxLength(20)
                .HasColumnName("VoucherID");
            entity.Property(e => e.DeliveryOption)
                .HasMaxLength(20)
                .HasColumnName("DeliveryOption");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasOne(d => d.Customer).WithMany(p => p.OrderCustomers)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK_Order.CustomerID");

            entity.HasOne(d => d.Staff1).WithMany(p => p.OrderStaffs)
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
            entity.HasKey(e => e.MethodId).HasName("PK__PaymentM__FC681FB19861E276");

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
            entity.HasKey(e => e.PetId).HasName("PK__Pet__48E538029A90B6D1");

            entity.ToTable("Pet");

            entity.Property(e => e.PetId)
                .ValueGeneratedNever()
                .HasColumnName("PetID");
            entity.Property(e => e.CustomerId)
                .HasMaxLength(50)
                .HasColumnName("CustomerID");
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
            entity.HasKey(e => e.ProductId).HasName("PK__Product__B40CC6ED118BD779");

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

            entity.HasKey(cd => cd.Id);
            entity.Property(i => i.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.OrderId)
                .HasMaxLength(20)
                .HasColumnName("OrderID");
            entity.Property(e => e.Price).HasColumnType("money");
            entity.Property(e => e.ProductId).HasMaxLength(20);

            entity.HasOne(d => d.Order).WithMany(p => p.ProductOrderDetails)
                .HasConstraintName("FK_ProductOrderDetails.OrderID");
            entity.HasOne(d => d.Product).WithMany()
                .HasConstraintName("FK_ProductOrderDetails.ProductId");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PK__Service__C51BB0EAC4D88B37");

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

            entity.HasKey(cd => cd.Id);
            entity.Property(i => i.Id).ValueGeneratedOnAdd();
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
                .HasConstraintName("FK_ServiceOrderDetails.OrderID");

            entity.HasOne(d => d.Pet).WithMany()
                .HasConstraintName("FK_ServiceOrderDetails.PetID");

            entity.HasOne(d => d.Service).WithMany()
                .HasConstraintName("FK_ServiceOrderDetails.ServiceID");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__Transact__55433A4B99715DB2");

            entity.Property(e => e.TransactionId)
                .HasMaxLength(20)
                .HasColumnName("TransactionID");
            entity.Property(e => e.MethodId).HasColumnName("MethodID");

            entity.HasOne(d => d.Method).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.MethodId)
                .HasConstraintName("FK_Transactions.MethodID");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CCACDACE5146");

            entity.ToTable("User");

            entity.Property(e => e.UserId)
                .HasMaxLength(50)
                .HasColumnName("UserID");
            entity.Property(e => e.Address).HasMaxLength(20);
            entity.Property(e => e.Name).HasMaxLength(20);
            entity.Property(e => e.Password).HasMaxLength(20);
            entity.Property(e => e.Phone).HasColumnType("decimal(10, 0)");
            entity.Property(e => e.PictureName).HasMaxLength(50);
            entity.Property(e => e.UserName)
                .HasMaxLength(20)
                .IsUnicode(false);
        });
        modelBuilder.Entity<StaffStatus>(entity =>
        {
            entity.ToTable("StaffStatus"); // Tên bảng trong cơ sở dữ liệu

            entity.HasKey(e => e.StaffId); // Khóa chính là StaffId

            entity.Property(e => e.StaffId)
                  .IsRequired()
                  .HasMaxLength(450);

            entity.Property(e => e.Status)
                  .IsRequired();

            entity.Property(e => e.StaffName)
                  .HasMaxLength(450);
        });

        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.HasKey(e => e.VoucherId).HasName("PK__Voucher__3AEE79C1F400B288");

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
