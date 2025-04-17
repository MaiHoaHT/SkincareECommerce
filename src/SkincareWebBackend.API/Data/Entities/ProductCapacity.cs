namespace SkincareWebBackend.API.Data.Entities
{
    public class ProductCapacity
    {
        public int ProductId { get; set; }

        public int CapacityId { get; set; }

        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
