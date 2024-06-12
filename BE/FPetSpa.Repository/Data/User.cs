using System;
using System.Collections.Generic;

namespace FPetSpa.Repository.Data;

public partial class User
{
    public string UserId { get; set; } = null!;

    public string? PictureName { get; set; }

    public string? UserName { get; set; }

    public string? Name { get; set; }

    public string? Password { get; set; }

    public string? Address { get; set; }

    public decimal? Phone { get; set; }

    public double? Coupon { get; set; }

    public bool? Status { get; set; }

    public int? Role { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Order> OrderCustomers { get; set; } = new List<Order>();

    public virtual ICollection<Order> OrderStaffs { get; set; } = new List<Order>();

    public virtual ICollection<Pet> Pets { get; set; } = new List<Pet>();
}
