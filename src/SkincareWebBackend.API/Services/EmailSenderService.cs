using Microsoft.AspNetCore.Identity.UI.Services;

namespace SkincareWeb.BackendServer.Service
{
    public class EmailSenderService : IEmailSender
    {
        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            throw new NotImplementedException();
        }
    }
}
