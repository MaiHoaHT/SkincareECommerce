using SkincareWebBackend.API.Data.Interface;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkincareWebBackend.API.Data.Entities
{
    [Table("Products")]
    public class Product : IDateTracking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        [Column(TypeName = "NVARCHAR(500)")]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Discount { get; set; }

        [Required]
        public string ImageUrl { get; set; }

        [Required]
        [Range(1, Double.PositiveInfinity)]
        public int CategoryId { get; set; }

        [Required]
        [Range(1, Double.PositiveInfinity)]
        public int BrandId { get; set; }

        [Required]
        [Column(TypeName = "varchar(500)")]
        public string SeoAlias { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public int Sold { get; set; }
        public bool Status { get; set; } = false;
        public bool IsFeature { get; set; } = false;
        public bool IsHome { get; set; } = false;
        public bool IsHot { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public DateTime? DeleteDate { get; set; }
    }
}
