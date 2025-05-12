namespace SkincareWeb.ViewModels.Ratings
{
    public class RatingViewModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string ProductId { get; set; }
        public int NumRate { get; set; }
        public string Context { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }
}
