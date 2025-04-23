namespace SkincareWeb.ViewModels.Systems
{
    public class UserChangePasswordRequest
    {
        public string UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
