using Microsoft.AspNetCore.Identity;
using SkincareWebBackend.API.Data.Interface;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkincareWebBackend.API.Data.Entities
{
    public class User : IdentityUser, IDateTracking
    {
        [Required]
        [Column(TypeName = "NVARCHAR(255)")]
        public string FirstName { get; set; }

        [Required]
        [Column(TypeName = "NVARCHAR(255)")]
        public string LastName { get; set; }
        [Required]
        public DateTime Dob { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }
}
