using FPetSpa.Repository.Data;
using FPetSpa.Repository.Model;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net.Mail;
using System.Net.Mime;

namespace FPetSpa.Repository.Services
{
    public class SendMailServices
    {
        private readonly MailSettingsModel _gmailSettings;

        public SendMailServices(IOptions<MailSettingsModel> gmailSettings)
        {
            _gmailSettings = gmailSettings.Value;
        }
        private static string[] Scopes = { "https://www.googleapis.com/auth/gmail" };


        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("FpetSpa", "hungnpse172907@fpt.edu.vn"));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = subject;
            message.Body = new TextPart("html")
            {
                Text = htmlMessage
            };


            try
            {
                using (var client = new MailKit.Net.Smtp.SmtpClient())
                {
                    await client.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
                    // var oauth2 = new SaslMechanismOAuth2("hungnpse172907@fpt.edu.vn", accessToken);
                    // await client.AuthenticateAsync(oauth2);
                    await client.AuthenticateAsync("hungnpse172907@fpt.edu.vn", _gmailSettings.Password);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {
                // Gửi mail thất bại, nội dung email sẽ lưu vào thư mục mailssave
                System.IO.Directory.CreateDirectory("mailssave");
                var emailsavefile = string.Format(@"mailssave/{0}.eml", Guid.NewGuid());
                await message.WriteToAsync(emailsavefile);

            }
        }

        public async Task SendEmailWithQRCodeAsync(string email, string subject, string htmlMessage, byte[] qrCodeBytes)
        {

            var messageMail = new MailMessage
            {
                From = new MailAddress("hungnpse172907@fpt.edu.vn", "FpetSpa"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };


            messageMail.To.Add(email);


            var qrCodeAttachment = new Attachment(new MemoryStream(qrCodeBytes), "qrcode.png", MediaTypeNames.Image.Jpeg);
            qrCodeAttachment.ContentId = "qrcode";
            qrCodeAttachment.ContentDisposition.Inline = true;
            qrCodeAttachment.ContentDisposition.DispositionType = DispositionTypeNames.Inline;

            messageMail.Attachments.Add(qrCodeAttachment);


            try
            {
                using (var client = new System.Net.Mail.SmtpClient("smtp.gmail.com"))
                {
                    client.Port = 587;
                    client.Credentials = new System.Net.NetworkCredential("hungnpse172907@fpt.edu.vn", _gmailSettings.Password);
                    client.EnableSsl = true;
                    await client.SendMailAsync(messageMail);
                }
            }
            catch (Exception ex)
            {

            }

        }
    }
}
