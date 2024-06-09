namespace FPetSpa.Repository.Model.VnPayModel
{
    public class VnPayRequestModel
    {
        public string FullName { get; set; }
        public string Description { get; set; }
        public double Amount {  get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiredDate { get; set; }
        public string OrderId { get; set; }
    }
}
