using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkincareWebBackend.API.Data.Entities
{
    public class Permission
    {
        public Permission(string FunctionId, string RoleId, string CommandId)
        {
            this.FunctionId = FunctionId;
            this.RoleId = RoleId;
            this.CommandId = CommandId;
        }
        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string FunctionId { get; set; }

        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string RoleId { get; set; }

        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        public string CommandId { get; set; }
    }
}
