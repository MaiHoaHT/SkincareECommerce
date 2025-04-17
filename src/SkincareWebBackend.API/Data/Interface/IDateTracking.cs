namespace SkincareWebBackend.API.Data.Interface
{
    public interface IDateTracking
    {
        DateTime CreateDate { get; set; }
        DateTime LastModifiedDate { get; set; }
    }
}
