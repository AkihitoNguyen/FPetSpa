namespace FPetSpa.Repository.Repository
{
    public class EmailSenderRepository : IEmailSenderRepository
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            throw new NotImplementedException();
        }
    }
}
