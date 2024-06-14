using FPetSpa.Repository.Model;
using Microsoft.AspNetCore.Authentication.Google.Apis.Auth.OAuth2;
using Google.Apis.Util.Store;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            UserCredential credential;

            //using(var stream = new FileStream(_gmailSettings.ClientSecretFilePath, FileMode.Open, FileAccess.Read))
            //{
            //    string credPath = "token.json";
            //    credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
            //        GoogleClientSecrets.FromStream(stream).Secrets,
            //        Scopes,
            //        "user",
            //        CancellationToken.None,
            //        new FileDataStore(credPath, true));
            //}   

            //var accessToken = await credential.GetAccessTokenForRequestAsync();

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("FpetSpa", "hungnpse172907@fpt.edu.vn"));
            message.To.Add(new MailboxAddress("",email));
            message.Subject = subject;
            message.Body = new TextPart("html")
            {
                Text = htmlMessage
            };


            try
            {
                using(var client = new SmtpClient())
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
    }
}
