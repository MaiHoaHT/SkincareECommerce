﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkincareWebBackend.API.Data.Entities
{
    [Table("Commands")]
    public class Command
    {
        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        [Key]
        public string Id { get; set; }

        [MaxLength(250)]
        [Required]
        public string Name { get; set; }
    }
}
