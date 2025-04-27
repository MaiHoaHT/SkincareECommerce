namespace SkincareWeb.ViewModels.Ratings
{
    public class RatingCreateRequest
    {
        public string UserId { get; set; }
        public string ProductId { get; set; }
        public int NumRate { get; set; }
        public string Context { get; set; }
    }
}
