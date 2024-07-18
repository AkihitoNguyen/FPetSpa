namespace FPetSpa.Repository.Repository
{
    public interface IEmailSenderRepository
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
